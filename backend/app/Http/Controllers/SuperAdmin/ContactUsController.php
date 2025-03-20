<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactUsMessagesResource;
use App\Models\ContactUs;
use App\Models\MessagesResponse;
use App\Models\User;
use App\Models\WebsiteSetting;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactUsController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "username" => 'required|min:2',
            "email" => 'required|email',
            "subject" => 'required',
            "message" => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $message = 'You have a new message from ' . $request->username . ' having email address ' . $request->email . ' message: ' . $request->message;

            $siteDetails = WebsiteSetting::find(1);

            $user = new User();
            $user->subject = $request->subject;
            $user->greeting = "Hey, " . $siteDetails->site_name;
            $user->email = $siteDetails->site_email;
            $user->verificationUrl = $message;
            $user->notify(new VerifyEmailNotification($user));

            $entry = ContactUs::create([
                "username" => $request->username,
                "email" => $request->email,
                "subject" => $request->subject,
                "message" => $request->message,
            ]);

            if (!empty($entry)) {
                $message = new ContactUsMessagesResource($entry);

                return response()->json([
                    "res" => "success",
                    "message" => "We have received your mail. We Will get back to you soon.",
                    "data" => $message,
                ], 200);
            }
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function messages(Request $request)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $perPage = $request->query('per_page');

        try {
            $messages = ContactUs::with('responses')->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

            if (count($messages) > 0) {

                $messages = ContactUsMessagesResource::collection($messages);

                $totalPages = $messages->lastPage();
                $totalRecords = $messages->total();

                return response()->json([
                    "res" => "success",
                    "message" => "Messages Found Successfully",
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    "data" => $messages
                ], 200);
            }

            return response()->json([
                "res" => "error",
                "message" => "Messages not found.",
            ], 404);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function respond(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => 'required|exists:contact_us,id',
            "subject" => 'required',
            "message" => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $recievedMessage = ContactUs::where('id', $request->id)->first();

            if (!empty($recievedMessage)) {

                $message = $request->message;

                $user = new User();
                $user->subject = $request->subject;
                $user->greeting = "Greetings, " . $recievedMessage->username;
                $user->email = $recievedMessage->email;
                $user->verificationUrl = $message;
                $user->notify(new VerifyEmailNotification($user));

                $entry = MessagesResponse::create([
                    "contact_id" => $request->id,
                    "subject" => $request->subject,
                    "message" => $request->message,
                ]);

                if (!empty($entry)) {
                    return response()->json([
                        "res" => "success",
                        "message" => "Response sent successfully.",
                    ], 200);
                }
            }

            return response()->json([
                "res" => "error",
                "message" => "The message you're trying to respond is not found.",
            ], 404);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            $isDeleted = ContactUs::destroy($id);

            if ($isDeleted) {
                return response()->json([
                    "res" => "success",
                    "message" => "Message Successfully Deleted. Note: The message has been deleted from database, this action doesn't delete mails from your inbox",
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Couldn't Delete Message",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }
}
