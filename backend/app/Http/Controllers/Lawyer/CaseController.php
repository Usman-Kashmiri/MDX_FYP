<?php

namespace App\Http\Controllers\Lawyer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseResource;
use App\Models\AreaExpertise;
use App\Models\Cases;
use App\Models\Chat;
use App\Models\LawyersCase;
use App\Models\Notification;
use App\Models\WebsiteSetting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Pusher\Pusher;

class CaseController extends Controller
{

    // ? API for handling case submission and for suggesting suitable area of practice for case
    public function submit_case(Request $request)
    {
        try {
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

            $user = auth()->user();

            $validator = Validator::make($request->all(), [
                "case_description" => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            $areas_of_practice = AreaExpertise::all();
            $systemPrompt = $request->case_description . ' Please suggest the relevant area of practice from the given areas of practice for the following case description: (note: respond with just right record id only from the given areas of pratice, exclude text)';
            $userPrompt = 'Areas of Practice: ' . $areas_of_practice;

            $response = $this->callOpenAIAPI($systemPrompt, $userPrompt);

            $jsonData = $response['choices'][0]['message']['content'];

            if (isset($jsonData['error'])) {
                return $this->handleErrorResponse($jsonData['error']);
            }

            $area_of_practice_id = $jsonData;
            $areas_of_practices = AreaExpertise::all();
            $area_of_practice = $areas_of_practices->find($area_of_practice_id);

            if (!$area_of_practice) {
                $area_of_practice = $areas_of_practices->first();
            }

            $case = $this->summarize_case($user, $request->case_description);


            return response()->json([
                'success' => true,
                'message' => 'Your case description has been processed successfully',
                'data' => [
                    'area_of_practice' => $area_of_practice ?? "",
                    'case' => $case,
                ],
            ]);
        } catch (\Exception $e) {
            return $this->handleErrorResponse($e->getMessage());
        }
    }

    // ? function for summarize the submitted case
    public function summarize_case($user, $caseDescription)
    {
        $systemPrompt = 'Note: summarize the provided case for better understanding for a lawyer and do not answer it, just summarize it';
        $userPrompt = $caseDescription . ', "Note: summerize this case for better understanding for a lawyer and not answer this, note just summerize this"';

        $response = $this->callOpenAIAPI($systemPrompt, $userPrompt);

        if (isset($response['error'])) {
            return $this->handleErrorResponse($response['error']);
        }

        $caseSummary = $response['choices'][0]['message']['content'];

        return Cases::create([
            'client_id' => $user->id,
            'case' => $caseDescription,
            'case_summary' => $caseSummary,
            'status' => 0,
        ]);
    }

    // ? method for chatGPT API
    private function callOpenAIAPI($systemPrompt, $userPrompt)
    {
        try {
            $website = WebsiteSetting::find(1);
            $apiData = Http::timeout(80)->withHeaders([
                'Authorization' => 'Bearer ' . $website->gpt_key,
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                        'model' => 'gpt-3.5-turbo',
                        'messages' => [
                            [
                                'role' => 'system',
                                'content' => $systemPrompt,
                            ],
                            [
                                'role' => 'user',
                                'content' => $userPrompt,
                            ],
                        ],
                        'max_tokens' => 100,
                        'temperature' => 0.8,
                    ])->json();

            // ? Handle the exception
            if (isset($apiData['error']) && $apiData['error']['code'] == 'insufficient_quota') {
                $userPrompt = str_replace('"Note: summerize this case for better understanding for a lawyer and not answer this, note just summerize this"', '', $userPrompt);
                $defaultResponse = "Sorry, we are unable to summarize: $userPrompt";
                $apiData = [
                    'choices' => [
                        [
                            'message' => [
                                'content' => $defaultResponse
                            ]
                        ]
                    ]
                ];
                return $apiData;
            }
            return $apiData;
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    // ? method for error handling
    private function handleErrorResponse($error)
    {
        $errorCode = $error['code'] ?? null;
        $errorType = $error['type'] ?? null;
        return response()->json([
            'success' => false,
            'error' => $error['message'] ?? null,
            'errorCode' => $errorCode,
            'errorType' => $errorType
        ]);
    }

    // ? API for initializing a case request
    public function case_request(Request $request)
    {

        try {
            $validator = Validator::make($request->all(), [
                "case_id" => 'required|exists:cases,id',
                "lawyer_id" => 'required|exists:users,id',
            ]);

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

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }
            $chatdata = [];
            $existingCase = LawyersCase::where('lawyer_id', $request->lawyer_id)
                ->where('case_id', $request->case_id)
                ->where('client_id', auth()->user()->id)
                ->first();

            if ($existingCase) {
                return response()->json(['res' => 'error', 'message' => 'Case request already exists'], 409);
            }

            $case = Cases::find($request->case_id);


            if (!$case) {
                return response()->json(['res' => 'error', 'message' => 'Case not found'], 404);
            }

            $user = auth()->user();

            $currentTime = Carbon::now();
            $milliseconds = round(microtime(true) * 1000);

            Chat::create([
                'sender_id' => $user->id,
                'recevier_id' => $request->lawyer_id,
                'message' => $case->case,
                'message_type' => 'original_case',
                'appointment_id' => 0,
                'case_id' => $case->id,
                'chat_timestampn' => $currentTime->timestamp * 1000 + $milliseconds % 1000,
            ]);

            $SUMchat = Chat::create([
                'sender_id' => $user->id,
                'recevier_id' => $request->lawyer_id,
                'message' => $case->case_summary,
                'message_type' => 'summarized_case',
                'appointment_id' => 0,
                'case_id' => $case->id,
                'chat_timestampn' => $currentTime->timestamp * 1000 + $milliseconds % 1000,
            ]);

            LawyersCase::create([
                'case_id' => $case->id,
                'client_id' => $user->id,
                'lawyer_id' => $request->lawyer_id,
            ]);

            $chat = Chat::where('sender_id', $user->id)
                ->where('recevier_id', $request->lawyer_id)
                ->get();

            $SUMchat->load(['sender_detail', 'recevier_detail']);

            Notification::create([
                "user_id" => $request->lawyer_id,
                "title" => 'New case requested ' . ', by ' . $user->first_name . ' ' . $user->last_name,
                "description" => $case->case_summary,
                "url" => "/lawyer/dashboard/#$case->id",
            ]);
            array_push(
                $chatdata,
                array(
                    "id" => $SUMchat->id,
                    "sender_id" => $SUMchat->sender_id,
                    "sender_name" => $SUMchat->sender_detail->first_name . ' ' . $SUMchat->sender_detail->last_name,
                    "sender_image" => $SUMchat->sender_detail->image,
                    "recevier_id" => $SUMchat->recevier_id,
                    "message" => $SUMchat->message,
                    "message_type" => $SUMchat->message_type,
                    "attach_type" => $SUMchat->attach_type,
                    'status' => $SUMchat->seen,
                    'meeting_id' => $SUMchat->meeting_id,
                )
            );

            $pusher->trigger('all-message-channel.' . $SUMchat->recevier_id, 'all-message-event.' . $SUMchat->recevier_id, ['data' => $chatdata]);
            return response()->json([
                'res' => 'success',
                'message' => 'Case submitted successfully',
                'data' => $chat
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $status)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $perPage = $request->query('per_page');

        try {
            $user = auth()->user();
            $query = LawyersCase::with('client', 'lawyer', 'case')->orderBy('created_at', 'DESC');

            // ? Conditionally add where clause based on user role
            if ($user->role->name === "Client") {
                $query->where('client_id', $user->id);
            } else {
                $query->where('lawyer_id', $user->id);
            }

            switch ($status) {
                case 'all':
                    break;
                case 'pending':
                    $query->whereHas('case', function ($query) {
                        $query->where('status', 0);
                    });
                    break;
                case 'approved':
                    $query->whereHas('case', function ($query) {
                        $query->where('status', 1);
                    });
                    break;
                case 'rejected':
                    $query->whereHas('case', function ($query) {
                        $query->where('status', 2);
                    });
                    break;
                case 'completed':
                    $query->whereHas('case', function ($query) {
                        $query->where('status', 3);
                    });
                    break;
                default:
                    return response()->json(["res" => "error", "message" => "Invalid Status"], 400);
            }

            $lawyersCases = $query->paginate($perPage, ['*'], 'page', $page);

            if ($lawyersCases->isNotEmpty()) {
                $lawyersCases = CaseResource::collection($lawyersCases);

                $totalPages = $lawyersCases->lastPage();
                $totalRecords = $lawyersCases->total();

                return response()->json([
                    "res" => "success",
                    "message" => "Cases List Found",
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    "data" => $lawyersCases
                ]);
            }

            return response()->json(["res" => "error", "message" => "cases Not Found!"], 404);
        } catch (\Exception $e) {
            return response()->json(["res" => "error", "message" => $e->getMessage(), 'error' => $e->getTrace()], 500);
        }
    }

    public function pending_cases()
    {
        try {
            $user = auth()->user();
            $pendingCases = Cases::where('client_id', $user->id)->where('status', '=', 0)->orderBy('id', 'desc')->get();

            if ($pendingCases->isNotEmpty()) {
                return response()->json(["res" => "success", "message" => "Cases List Found", "data" => $pendingCases]);
            } else {
                return response()->json(["res" => "error", "message" => "cases Not Found!"], 404);
            }
        } catch (\Exception $e) {
            return response()->json(["res" => "error", "message" => $e->getMessage()], 500);
        }
    }

    public function find($id)
    {
        try {
            $user = auth()->user();
            $case = LawyersCase::with('client', 'lawyer', 'case')->where('case_id', $id)->where('client_id', $user->id)->first();

            if ($case->isNotEmpty()) {
                $case = new CaseResource($case);

                return response()->json(["res" => "success", "message" => "Cases List Found", "data" => $case]);
            } else {
                return response()->json(["res" => "error", "message" => "cases Not Found!"], 404);
            }
        } catch (\Exception $e) {
            return response()->json(["res" => "error", "message" => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            //code...
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
            $lawyer = auth()->user();
            $notifyData = [];
            $validator = Validator::make($request->all(), [
                "status" => 'required|numeric|in:0,1,2,3,4',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            $case = Cases::where('id', $id)->first();

            if (!$case) {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Update Case Status!",
                ]);
            }

            $case->status = $request->status;
            $case->save();

            $statusMessages = [
                1 => "Case approved Successfully!",
                2 => "Case Rejected!",
                3 => "Case Completed!",
                4 => "Case Cancelled!",
            ];

            $notification = Notification::create([
                "user_id" => $case->client_id,
                "title" => $statusMessages[$case->status] . ', By your lawyer ' . $lawyer->first_name . ' ' . $lawyer->last_name,
                "description" => $case->case_summary,
                "url" => "/client/dashboard/#$case->id",
            ]);

            array_push(
                $notifyData,
                array(
                    "id" => $case->id,
                    "sender_id" => $lawyer->id,
                    "sender_name" => $lawyer->first_name . ' ' . $lawyer->last_name,
                    "sender_image" => $lawyer->image,
                    "recevier_id" => $case->client_id,
                    "message" => $statusMessages[$case->status],
                    "message_type" => 'case',
                    'case_id' => $case->id,
                )
            );

            $pusher->trigger('all-message-channel.' . $case->client_id, 'all-message-event.' . $case->client_id, ['data' => $notifyData]);

            $message = $statusMessages[$case->status] ?? "Case Status Updated Successfully!";

            return response()->json([
                "res" => "success",
                "message" => $message,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "res" => "error",
                "message" => $th->getMessage(),
            ]);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            DB::table('cases')->where('id', $id)->delete();
        } catch (\Exception $e) {
            // Handle the exception, log the error, etc.
            return response()->json(['error' => 'An error occurred during deletion'], 500);
        }

        return response()->json(['message' => 'Record deleted successfully'], 200);
    }

    public function destroyAll()
    {
        Cases::where('id', '!=', 0)->delete();
    }
}
