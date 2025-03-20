<?php

namespace App\Http\Controllers\lawyer;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseResource;
use App\Http\Resources\ContractResource;
use App\Mail\ContractCompleteRequestEmail;
use App\Mail\ContractSignedMail;
use App\Models\Contract;
use App\Models\ContractDocument;
use App\Models\LawyersCase;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Pusher\Pusher;

class ContractController extends Controller
{
    public function getClients(Request $request)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $perPage = $request->query('per_page');

        try {
            $user = auth()->user();

            $cases = LawyersCase::with(['case', 'client', 'lawyer'])
                ->whereHas('case', function ($query) {
                    $query->where('status', 1);
                })
                ->where('lawyer_id', $user->id)
                ->orderBy("created_at", "DESC")
                ->paginate($perPage, ['*'], 'page', $page);


            if (count($cases) > 0) {
                $cases = CaseResource::collection($cases);

                $totalPages = $cases->lastPage();
                $totalRecords = $cases->total();

                return response()->json([
                    "res" => "success",
                    "message" => "Cases retrieved successfully",
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    "clients" => $cases,
                ]);
            }

            return response()->json([
                "res" => "warning",
                "message" => "Clients not found",
                "clients" => [],
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function store(Request $request)
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
            $lawyer = auth()->user();
            $lawyer_id = $lawyer->id;

            $validator = Validator::make($request->all(), [
                "contract_type" => 'required',
                "contract_title" => 'required',
                "client" => 'required',
                "start_date" => 'required',
                "fees_amount" => 'required',
                "contract_clauses" => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }
            $client = User::where('id', $request->client)->first();
            $allowedExtensions = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
                "svg", // ? Image
                "mp4",
                "avi",
                "mov",
                "wmv",
                "flv",
                "mkv", // ? Video
                "mp3",
                "m4a",
                "wav",
                "ogg",
                "aac",
                "flac", // ? Audio
                "doc",
                "docx",
                "pdf",
                "txt",
                "rtf", // ? Document
                "zip",
                "rar",
                "7z",
                "tar",
                "gz" // ? File
            ];

            if ($request->hasFile("documents")) {
                $documents = $request->file("documents");

                foreach ($documents as $document) {
                    $extension = strtolower($document->getClientOriginalExtension());

                    if (!in_array($extension, $allowedExtensions)) {
                        return response()->json(['res' => 'warning', 'message' => $extension . ' files are not supported']);
                    }
                }
            }

            $storeContract = Contract::create([
                "type" => $request->contract_type,
                "title" => $request->contract_title,
                "client_id" => $request->client,
                "lawyer_id" => $lawyer_id,
                "start_date" => $request->start_date,
                "fees_amount" => $request->fees_amount,
                "currency" => 'USD',
                'clauses' => $request->contract_clauses,
                'additional_note' => $request->additional_note,
                'status' => 'pending',
            ]);

            $Contract = Contract::where('id', $storeContract->id)->first();

            if ($request->hasFile("documents")) {
                $documents = $request->file("documents");

                foreach ($documents as $document) {
                    $extension = strtolower($document->getClientOriginalExtension());

                    $attach_name = 'nbundl_' . time() . '_' . uniqid() . '.' . $document->getClientOriginalExtension();

                    $uploadedFile = self::uploadPrivateFileOnS3($document, 'contract-documents');

                    ContractDocument::create([
                        'contract_id' => $Contract->id,
                        'file_name' => $attach_name,
                        'src' => $uploadedFile,
                        'mime_type' => $document->getClientMimeType(),
                        'extension' => $extension,
                    ]);
                }
            }

            Mail::to($Contract->client->email)->send(new ContractSignedMail($Contract, "https://nbundl.com"));
            $chatdata1 = [];

            $notification = Notification::create([
                "user_id" => $Contract->client_id,
                "title" => 'A New Contract Has Been Created!',
                "description" => 'A new contract has been created by your lawyer ' . $Contract->lawyer->first_name . ' ' . $Contract->lawyer->last_name,
                "url" => "/dashboard/contract-details/$Contract->id",
            ]);

            $Contract = new ContractResource($Contract);

            array_push(
                $chatdata1,
                array(
                    "id" => $notification->id,
                    "sender_id" => $lawyer_id,
                    "sender_name" => $client->first_name . ' ' . $client->last_name,
                    "sender_image" => $client->image,
                    "recevier_id" => $client->id,
                    "message" => $notification->title,
                    "message_type" => 'contract',
                    'contract_id' => $Contract->id,
                )
            );

            $pusher->trigger('all-message-channel.' . $Contract->client_id, 'all-message-event.' . $Contract->client_id, ['data' => $chatdata1]);

            return response()->json(['res' => 'success', 'message' => 'Contract store successfully', 'contract' => $Contract]);
        } catch (\Throwable $th) {
            return response()->json(['res' => 'warning', 'message' => 'Something wrong while storing contract', 'error' => $th->getMessage()]);
        }
    }

    public function list(Request $request, $status)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $perPage = $request->query('per_page');

        try {
            $user = auth()->user();

            $query = Contract::with('documents');

            if ($user->role_id == 3) {
                $query = $query->where("lawyer_id", $user->id);
            } else {
                $query = $query->where("client_id", $user->id);
            }

            if ($status == "all") {
                $query = $query;
            } elseif ($status == strtolower('requested')) {
                $query = $query->where('status', 'in-progress')->where('lawyer_complete_request', 1);
            } elseif ($status == strtolower('completed')) {
                $query = $query->where('status', 'complete');
            } elseif ($status == strtolower('cancel')) {
                $query = $query->where('status', 'canceled');
            } else {
                $query = $query->where('status', strtolower($status));
            }

            $contracts = $query->orderBy("created_at", "DESC")->paginate($perPage, ['*'], 'page', $page);

            if (count($contracts) > 0) {
                $contracts = ContractResource::collection($contracts);

                $totalPages = $contracts->lastPage();
                $totalRecords = $contracts->total();

                return response()->json([
                    'res' => 'success',
                    'message' => 'Contract Retrieved successfully',
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    'contracts' => $contracts
                ]);
            }

            return response()->json(['res' => 'error', 'message' => 'Contracts not found']);
        } catch (\Throwable $th) {
            return response()->json(['res' => 'warning', 'message' => 'Something wrong while retrieving contract', 'error' => $th]);
        }
    }

    public function show($id)
    {
        try {
            $contract = Contract::where('id', $id)->first();

            if ($contract) {
                $contract = new ContractResource($contract);

                return response()->json(['res' => 'success', 'message' => 'Contract Retrieved successfully', 'contracts' => $contract]);
            }

            return response()->json(['res' => 'error', 'message' => 'Contract not found']);
        } catch (\Throwable $th) {
            return response()->json(['res' => 'warning', 'message' => 'Something wrong while retrieving contract', 'error' => $th]);
        }
    }

    public function CompleteRequest($id)
    {
        try {
            $lawyer = auth()->user();
            $lawyer_id = $lawyer->id;

            $contract = Contract::where('id', $id)->where('lawyer_id', $lawyer_id)->first();

            if (!$contract) {
                return response()->json(["res" => "error", "message" => "Contract not found!"]);
            }

            if ($contract->status != "in-progress") {
                return response()->json(["res" => "error", "message" => "The contract must be in-progress!"]);
            }

            if ($contract->lawyer_complete_request != 0) {
                Mail::to($contract->client->email)->send(new ContractCompleteRequestEmail($contract, "https://nbundl.com"));
                return response()->json(['res' => 'warning', 'message' => 'Request already sent!']);
            } else {
                Contract::where('id', $id)->update([
                    'lawyer_complete_request' => '1',
                ]);

                Mail::to($contract->client->email)->send(new ContractCompleteRequestEmail($contract, "https://nbundl.com"));

                Notification::create([
                    "user_id" => $contract->client_id,
                    "title" => 'Contract Completion Request!',
                    "description" => 'Your lawyer ' . $contract->lawyer->first_name . ' ' . $contract->lawyer->last_name . " has initiated a request to complete an ongoing contract.",
                    "url" => "/dashboard/contract-details/$contract->id",
                ]);

                return response()->json(['res' => 'success', 'message' => 'Successfully request sent!']);
            }
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }
}
