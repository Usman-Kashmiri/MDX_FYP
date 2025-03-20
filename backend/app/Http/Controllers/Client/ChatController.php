<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Mail\UnreadMessage;
use App\Models\Chat;
use App\Models\Cases;
use App\Models\LawyersCase;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\WebsiteSetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
// ? use NewChatMessageEvent;
use Pusher\Pusher;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function caseDestroyAll()
    {
        LawyersCase::where('id', '!=', 0)->delete();
    }

    public function message(Request $request)
    {
        // event(new MessageSent($request->input('username'), $request->input('message')));
        // broadcast(new MessageSent($request->input('username'), $request->input('message')))->toOthers();
        // return [$request->input('message')];

        $user = auth()->user();
        $from = $user->id;
        $to = $request->recevier_id; // Fixed typo: 'recevier_id' to 'receiver_id'
        $message = $request->message;

        $data = new Chat();
        $data->sender_id = $from;
        $data->recevier_id = $to; // Fixed typo: 'recevier_id' to 'receiver_id'
        $data->message = $message;
        $data->appointment_id = 1;
        $data->save();

        $options = array(
            'cluster' => config('app.PUSHER_APP_CLUSTER'),
            'useTLS' => true
        );

        $pusher = new Pusher(
            config('app.PUSHER_APP_KEY'),
            config('app.PUSHER_APP_SECRET'),
            config('app.PUSHER_APP_ID'),
            $options
        );

        // Trigger the Pusher event on the 'my-channel' with the 'my-event' event name.
        $pusher->trigger('my-channel', 'my-event', ['message' => $message, 'id' => $from, 'to' => $to]);
    }

    public function case_availability($id)
    {
        try {
            $client = auth()->user();
            $lawyers_cases = LawyersCase::where('lawyer_id', $id)->where('client_id', $client->id)->get();

            $pendingCases = $lawyers_cases->filter(function ($lawyers_case) {
                return $lawyers_case->case->status === 0;
            });

            $ongoingCases = $lawyers_cases->filter(function ($lawyers_case) {
                return $lawyers_case->case->status === 1;
            });

            if ($pendingCases->count() > 0 && $ongoingCases->count() == 0) {
                return response()->json([
                    'res' => true,
                    'message' => 'One of your case is pending with this lawyer',
                ]);
            } elseif ($ongoingCases->count() > 0) {
                return response()->json([
                    'res' => true,
                    'message' => 'One of your cases is in progress with this lawyer',
                ]);
            } else {
                return response()->json([
                    'res' => false,
                    'message' => 'A new case can be created',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'message' => 'Something went wrong while retrieving cases',
                'error' => $e->getMessage()
            ]);
        }
    }

    // ! this is useless now because of the flow change
    public function case_request(Request $request)
    {
        $user = Auth()->user();
        $validator = Validator::make($request->all(), [
            "val" => 'required',
            "lawyer_id" => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }
        try {
            $website = WebsiteSetting::find(1);
            $response = Http::timeout(80)->withHeaders([
                'Authorization' => 'Bearer ' . $website->gpt_key,
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                        'model' => 'gpt-3.5-turbo',
                        'messages' => [
                            [
                                'role' => 'system',
                                'content' => 'Note: summarize this case for better understanding for a lawyer and do not answer this; just summarize',
                            ],
                            [
                                'role' => 'user',
                                'content' => $request->val . ', "Note: summerize this case for better understanding for a lawyer and not answer this, note just summerize"',
                            ],
                        ],
                        'max_tokens' => 100,
                        'temperature' => 0.8,
                    ]);
            $response = $response->json();
            if (isset($response['choices'][0]['message']['content'])) {
                $completion = $response['choices'][0]['message']['content'];


                $case = Cases::create(
                    [
                        'client_id' => $user->id,
                        'case' => $request->val,
                        'case_summary' => $completion,
                        'status' => 0,
                    ]
                );
                if (!empty($case)) {

                    $data = new Chat();

                    $data->sender_id = $user->id;
                    $data->recevier_id = $request->lawyer_id;
                    $data->message = $request->val;
                    $data->message_type = 'original_case';
                    $data->appointment_id = 0;
                    $data->case_id = $case->id;
                    $data->save();

                    // Create multiple Chat records using insert() method
                    $data = new Chat();

                    $data->sender_id = $user->id;
                    $data->recevier_id = $request->lawyer_id;
                    $data->message = $completion;
                    $data->message_type = 'summarized_case';
                    $data->appointment_id = 0;
                    $data->case_id = $case->id;
                    $data->save();

                    // $chat = Chat::insert($chatData);
                }
                if (!empty($chat)) {
                    $chat = Chat::where('sender_id', $user->id)->where('recevier_id', $request->lawyer_id)->get();
                    return response()->json([
                        'res' => 'success',
                        'message' => 'case submitted successfully',
                        'data' => $chat
                    ]);
                }
            }
            if (isset($response['error']['message'])) {
                $errorCode = $response['error']['code'] ?? null;
                $errorType = $response['error']['type'] ?? null;
                return response()->json([
                    'error' => $response['error']['message'],
                    'errorCode' => $errorCode,
                    'errorType' => $errorType
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    public function people_list()
    {
        $loggedInUser = auth()->user();
        $loggedInUserId = $loggedInUser->id;

        $distinctUserIds = Chat::whereIn('sender_id', [$loggedInUserId])
            ->orWhereIn('recevier_id', [$loggedInUserId])
            ->selectRaw('IF(sender_id = ?, recevier_id, sender_id) AS user_id', [$loggedInUserId])
            ->distinct()
            ->get();

        $chatPeople = [];

        foreach ($distinctUserIds as $distinctUserId) {
            $chatUser = User::find($distinctUserId->user_id);

            if ($chatUser) {

                $latestChat = Chat::where(function ($query) use ($distinctUserId) {
                    $query->where('sender_id', $distinctUserId->user_id)
                        ->where('recevier_id', auth()->user()->id);
                })->orWhere(function ($query) use ($distinctUserId) {
                    $query->where('sender_id', auth()->user()->id)
                        ->where('recevier_id', $distinctUserId->user_id);
                })->latest('created_at')->first();

                $unreadMessagesCount = Chat::where('sender_id', $distinctUserId->user_id)
                    ->where('recevier_id', auth()->user()->id)
                    ->where('seen', 0)
                    ->count();

                $chatPeople[] = [
                    "id" => $distinctUserId->user_id,
                    "first_name" => $chatUser->first_name,
                    "last_name" => $chatUser->last_name,
                    "is_online" => $chatUser->is_online,
                    "image" => $chatUser->image,
                    "unread_messages_count" => $unreadMessagesCount,
                    "latest_chat_data" => $latestChat,
                ];
            }
        }

        // ? Sort $chatPeople based on the 'updated_at' timestamp of the latest chat message
        usort($chatPeople, function ($a, $b) {
            $timeA = optional($a['latest_chat_data'])->updated_at ?? 0;
            $timeB = optional($b['latest_chat_data'])->updated_at ?? 0;
            return $timeB <=> $timeA;
        });

        $response = count($chatPeople) > 0
            ? ["res" => "success", "message" => "Chat People List", "data" => $chatPeople]
            : ["res" => "error", "message" => "Chat People Not Found!"];

        return response()->json($response);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $chatdata = [];
            $chatdata1 = [];
            $meeting_id = 0;
            $sender = auth()->user();
            $sender_id = $sender->id;

            $options = array(
                'cluster' => config('app.PUSHER_APP_CLUSTER'),
                'useTLS' => true
            );

            $pusher = new Pusher(
                config('app.PUSHER_APP_KEY'),
                config('app.PUSHER_APP_SECRET'),
                config('app.PUSHER_APP_ID'),
                $options
            );
            if (!$pusher) {
                return response()->json(['message' => 'Unable to send message realtime!'], 400);
            }
            $validator = Validator::make($request->all(), [
                "recevier_id" => 'required',
                "attach" => 'required_without:message',
                "message" => 'required_without:attach',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }
            if ($request->message_type) {
                $message_type = $request->message_type;
            } else {
                $message_type = "chat";
            }

            if ($message_type == 'audio_meeting' || $message_type == 'video_meeting') {
                $meeting_id = uniqid();
                $meeting = Meeting::create([
                    'sender_id' => $sender_id,
                    'recevier_id' => $request->recevier_id,
                    'meeting_id' => $meeting_id,
                    'room_name' => $sender->first_name . "'s Meeting",
                    'meeting_status' => 'pending',
                    'meeting_type' => $message_type,
                ]);
            }

            $allowedExtensions = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
                "svg", // Image
                "mp4",
                "avi",
                "mov",
                "wmv",
                "flv",
                "mkv", // Video
                "mp3",
                "m4a",
                "wav",
                "ogg",
                "aac",
                "flac", // Audio
                "doc",
                "docx",
                "pdf",
                "txt",
                "rtf", // Document
                "zip",
                "rar",
                "7z",
                "tar",
                "gz" // File
            ];

            $attach = $request->file("attach");
            $uploadedFile = null;
            if ($attach) {
                $extension = strtolower($attach->getClientOriginalExtension());
                if (in_array($extension, $allowedExtensions)) {
                    if (in_array($extension, ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"])) {
                        $attach_type = "image";
                        $uploadedFile = self::uploadWEBPImageOnS3($request, 'attach', null, 'chats', "private");
                    } elseif (in_array($extension, ["mp4", "avi", "mov", "wmv", "flv", "mkv"])) {
                        $attach_type = "video";
                        $uploadedFile = self::uploadPrivateFileOnS3($attach, 'chats');
                    } elseif (in_array($extension, ["mp3", "wav", "ogg", "m4a", "aac", "flac"])) {
                        $attach_type = "audio";
                        $uploadedFile = self::uploadPrivateFileOnS3($attach, 'chats');
                    } elseif (in_array($extension, ["doc", "docx", "pdf", "txt", "rtf"])) {
                        $attach_type = "doc";
                        $uploadedFile = self::uploadPrivateFileOnS3($attach, 'chats');
                    } elseif (in_array($extension, ["zip", "rar", "7z", "tar", "gz"])) {
                        $attach_type = "file";
                        $uploadedFile = self::uploadPrivateFileOnS3($attach, 'chats');
                    }

                    $chat = Chat::create([
                        "sender_id" => $sender_id,
                        "recevier_id" => $request->recevier_id,
                        "message" => $request->message,
                        "message_type" => $message_type,
                        'meeting_id' => $meeting_id,
                        "attach_type" => $attach_type,
                        "attach" => $uploadedFile,
                        "seen" => 0,
                        "chat_timestampn" => intval($request->time_stamp),
                        "attach_display_name" => $attach->getClientOriginalName(),
                    ]);

                    if (!empty($chat)) {
                        $alignmentClass = ($chat->sender_id == $sender_id) ? 'left' : 'right';
                        $alignmentClass1 = ($chat->recevier_id == $request->recevier_id) ? 'right' : 'left';
                        array_push(
                            $chatdata,
                            array(
                                "id" => $chat->id,
                                "alignment" => $alignmentClass,
                                "appointment_id" => $chat->appointment_id,
                                "sender_id" => $chat->sender_id,
                                "sender_name" => $sender->first_name . ' ' . $sender->last_name,
                                "sender_image" => $sender->image,
                                "recevier_id" => $chat->recevier_id,
                                "message" => $chat->message,
                                "message_type" => $chat->message_type,
                                "attach_type" => $chat->attach_type,
                                "attach" => $chat->attach ? self::getPrivateS3File($chat->attach) : null,
                                "attach_display_name" => $chat->attach_display_name ? $chat->attach_display_name : null,
                                'status' => $chat->seen,
                                "time_stamp" => intval($chat->chat_timestampn),
                                "appointment_detail" => (($chat->appointment_id != 0) ? $chat->appointment : null),
                                'meeting_id' => $chat->meeting_id,
                            )
                        );

                        array_push(
                            $chatdata1,
                            array(
                                "id" => $chat->id,
                                "alignment" => $alignmentClass1,
                                "appointment_id" => $chat->appointment_id,
                                "sender_id" => $chat->sender_id,
                                "sender_name" => $sender->first_name . ' ' . $sender->last_name,
                                "sender_image" => $sender->image,
                                "recevier_id" => $chat->recevier_id,
                                "message" => $chat->message,
                                "message_type" => $chat->message_type,
                                "attach_type" => $chat->attach_type,
                                "attach" => $chat->attach ? self::getPrivateS3File($chat->attach) : null,
                                "attach_display_name" => $chat->attach_display_name ? $chat->attach_display_name : null,
                                'status' => $chat->seen,
                                "time_stamp" => intval($chat->chat_timestampn),
                                "appointment_detail" => (($chat->appointment_id != 0) ? $chat->appointment : null),
                                'meeting_id' => $chat->meeting_id,
                            )
                        );
                    }
                } else {
                    $errors = [
                        "attach" => ["The attach file extension is not allowed!"]
                    ];
                    return response()->json($errors, 400);
                }
            } else {
                $chat = Chat::create([
                    "sender_id" => $sender_id,
                    "recevier_id" => $request->recevier_id,
                    "message" => $request->message,
                    "message_type" => $message_type,
                    'meeting_id' => $meeting_id,
                    "seen" => 0,
                    "chat_timestampn" => intval($request->time_stamp)
                ]);

                // Broadcast the new chat message using Pusher
                $alignmentClass = ($chat->sender_id == $sender_id) ? 'left' : 'right';
                $alignmentClass1 = ($chat->recevier_id == $request->recevier_id) ? 'right' : 'left';

                array_push(
                    $chatdata,
                    array(
                        "id" => $chat->id,
                        "alignment" => $alignmentClass,
                        "appointment_id" => $chat->appointment_id,
                        "sender_id" => $chat->sender_id,
                        "sender_name" => $sender->first_name . ' ' . $sender->last_name,
                        "sender_image" => $sender->image,
                        "recevier_id" => $chat->recevier_id,
                        "message" => $chat->message,
                        "message_type" => $chat->message_type,
                        "attach_type" => $chat->attach_type,
                        "attach" => $chat->attach ? self::getPrivateS3File($chat->attach) : null,
                        'status' => $chat->seen,
                        "time_stamp" => intval($chat->chat_timestampn),
                        "appointment_detail" => (($chat->appointment_id != 0) ? $chat->appointment : null),
                        'meeting_id' => $chat->meeting_id,
                    )
                );

                array_push(
                    $chatdata1,
                    array(
                        "id" => $chat->id,
                        "alignment" => $alignmentClass1,
                        "appointment_id" => $chat->appointment_id,
                        "sender_id" => $chat->sender_id,
                        "sender_name" => $sender->first_name . ' ' . $sender->last_name,
                        "sender_image" => $sender->image,
                        "recevier_id" => $chat->recevier_id,
                        "message" => $chat->message,
                        "message_type" => $chat->message_type,
                        "attach_type" => $chat->attach_type,
                        "attach" => $chat->attach ? self::getPrivateS3File($chat->attach) : null,
                        'status' => $chat->seen,
                        "time_stamp" => intval($chat->chat_timestampn),
                        "appointment_detail" => (($chat->appointment_id != 0) ? $chat->appointment : null),
                        'meeting_id' => $chat->meeting_id,
                    )
                );
            }

            if (!empty($chat)) {

                if ($chat->recevier_detail->is_online == "0" && $chat->recevier_detail->email_notifications == "1") {

                    $web_details = WebsiteSetting::find(1);

                    $message = $chat->message_type === "video_meeting" ? "You have missed video meeting" : ($chat->message_type === "audio_meeting" ? "You have missed audio meeting" : ($chat->attach ? "Sent a document attachment" : $chat->message));

                    $mailData = [
                        "site_name" => $web_details->site_name,
                        "site_logo" => self::getPublicS3File($web_details->site_logo),
                        "sender_id" => $chat->sender_detail->id,
                        "sender_name" => $chat->sender_detail->first_name . " " . $chat->sender_detail->last_name,
                        "sender_image" => $chat->sender_detail->image,
                        "message" => $message,
                        "time_stamp" => Carbon::parse($chat->created_at)->isoFormat('Do MMM YYYY [at] h:mm A'),
                        "link" => "https://nbundl.com/chat/" . $chat->sender_detail->id,
                    ];

                    Mail::to($chat->recevier_detail->email)->send(new UnreadMessage($mailData));

                    return response()->json([
                        "res" => "success",
                        "message" => "Email Sent Successfully!",
                        "data" => $chat
                    ]);
                }

                // Trigger the Pusher event on the 'my-channel' with the 'my-event' event name.
                $pusher->trigger('my-channel.' . $request->recevier_id, 'my-event.' . $request->recevier_id, ['data' => $chatdata1]);
                $pusher->trigger('my-channel.' . $sender_id, 'my-event.' . $sender_id, ['data' => $chatdata]);
                $pusher->trigger('all-message-channel.' . $request->recevier_id, 'all-message-event.' . $request->recevier_id, ['data' => $chatdata]);

                return response()->json([
                    "res" => "success",
                    "message" => "Message Sent Successfully!",
                    "data" => $chat
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Can Not Sent Message!",
                ]);
            }
        } catch (\Exception $e) {
            return response()->json(['res' => 'warning', 'message' => 'Something went wrong while sending message', 'error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function profile_details($lawyer_id)
    {
        try {
            $client = auth()->user();
            $lawyer = User::find($lawyer_id);
            $sender_id = $client->id;
            $receiver_id = $lawyer->id;

            $chats = Chat::where(function ($query) use ($sender_id) {
                $query->where('sender_id', $sender_id)->orWhere('recevier_id', $sender_id)->where('attach_type', '!=', null);
            })->orWhere(function ($subQuery) use ($receiver_id) {
                $subQuery->where('sender_id', $receiver_id)->orWhere('recevier_id', $receiver_id)->where('attach_type', '!=', null);
            })->get();

            foreach ($chats as $chat) {

                if ($chat->attach_type == "") {

                    array_push(
                        $data,
                        array(
                            "id" => $chat->id,
                            "link" => $chat->attach != "" ? self::getPrivateS3File($chat->attach) : "",
                            "file_name" => strtolower(pathinfo($chat->attach, PATHINFO_FILENAME)),
                            "extension" => strtolower(pathinfo($chat->attach, PATHINFO_EXTENSION))
                        )
                    );
                }
            }
            return response()->json([
                'res' => 'success',
                'message' => 'Data found successfully',
                'data' => [
                    'user' => [
                        'id' => $lawyer->id,
                        'first_name' => $lawyer->first_name,
                        'last_name' => $lawyer->last_name,
                        'email' => $lawyer->email,
                        'role_id' => $lawyer->role_id,
                        'country_id' => $lawyer->country_id,
                        'jurisdictions' => $lawyer->jurisdictions,
                        'image' => $lawyer->image,
                        'profile' => $lawyer->image,
                    ],
                    'chat' => $data,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['res' => 'warning', 'message' => 'Something wrong while retrieving data', 'error' => $e->getMessage()]);
        }
    }

    public function show_attachment($type, $lawyer_id, $page)
    {
        try {
            $lawyer = User::find($lawyer_id);
            $user = auth()->user();
            $sender_id = $user->id;
            $receiver_id = $lawyer->id;
            $data = [];

            // Use Laravel's pagination instead of skip and take
            $perPage = 15;
            $pageNumber = $page - 1; // Adjust page number to start from 0 for correct skipping

            $chats = DB::table('chat')
                ->where(function ($query) use ($sender_id, $type) {
                    $query->where('sender_id', $sender_id)
                        ->where('attach_type', $type)
                        ->orWhere('recevier_id', $sender_id)
                        ->where('attach_type', $type);
                })
                ->orWhere(function ($subQuery) use ($receiver_id, $type) {
                    $subQuery->where('sender_id', $receiver_id)
                        ->where('attach_type', $type)
                        ->orWhere('recevier_id', $receiver_id)
                        ->where('attach_type', $type);
                })
                ->orderBy('created_at', 'desc')
                ->skip($pageNumber * $perPage) // Calculate the correct number of rows to skip
                ->take($perPage)
                ->get();

            if (!empty($chats)) {
                foreach ($chats as $chat) {

                    $extension = strtolower(pathinfo($chat->attach, PATHINFO_EXTENSION));

                    $mimeTypes = [
                        "jpg" => "image/jpeg",
                        "jpeg" => "image/jpeg",
                        "svg" => "image/svg+xml",
                        "webp" => "image/webp",
                        "png" => "image/png",
                        "gif" => "image/gif",
                        "bmp" => "image/bmp",
                        "mp4" => "video/mp4",
                        "avi" => "video/x-msvideo",
                        "mov" => "video/quicktime",
                        "wmv" => "video/x-ms-wmv",
                        "flv" => "video/x-flv",
                        "mkv" => "video/x-matroska",
                        "mp3" => "audio/mpeg",
                        "wav" => "audio/wav",
                        "ogg" => "audio/ogg",
                        "aac" => "audio/aac",
                        "m4a" => "audio/mp4",
                        "flac" => "audio/flac",
                        "doc" => "application/msword",
                        "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "pdf" => "application/pdf",
                        "txt" => "text/plain",
                        "rtf" => "application/rtf",
                        "zip" => "application/zip",
                        "rar" => "application/x-rar-compressed",
                        "7z" => "application/x-7z-compressed",
                        "tar" => "application/x-tar",
                        "gz" => "application/gzip"
                    ];

                    if (array_key_exists($extension, $mimeTypes)) {
                        $fileType = $mimeTypes[$extension];
                    } else {
                        $fileType = "image/" . $extension;
                    }

                    array_push($data, [
                        "id" => $chat->id,
                        "link" => $chat->attach != "" ? self::getPrivateS3File($chat->attach) : "",
                        "file_name" => strtolower(pathinfo($chat->attach, PATHINFO_FILENAME)),
                        "extension" => $fileType,
                    ]);
                }

                return response()->json(["res" => "success", "message" => "Attachment Data List", "data" => $data]);
            } else {
                return response()->json(["res" => "error", "message" => "Attachment Data Not Found!"]);
            }
        } catch (\Exception $e) {
            return response()->json(['res' => 'warning', 'message' => 'Something went wrong while retrieving data', 'error' => $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Mark unread messages of a specific chat as read.
     */
    public function mark_msg_as_read($sender_id)
    {
        try {
            $user = auth()->user();

            Chat::where("sender_id", $sender_id)->where("recevier_id", $user->id)->where("seen", 0)->update([
                "seen" => 1,
            ]);

            return response()->json(["success" => true, "message" => "messages marked as read"], 200);
        } catch (\Throwable $th) {
            return response()->json(["success" => false, "message" => "An internal server error occurred!", "error" => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function destroyAll()
    {
        Chat::where('id', '!=', 0)->delete();
    }
}
