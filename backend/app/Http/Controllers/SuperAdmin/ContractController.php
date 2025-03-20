<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContractResource;
use App\Models\Contract;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function list(Request $request, $status)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $perPage = $request->query('per_page');

        try {
            $response = [];
            $query = Contract::orderBy('created_at', 'DESC');

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
            return response()->json(['status' => 'warning', 'Contracts not found', 'contracts' => [], "error" => $th]);
        }
    }

    public function show($id)
    {
        try {
            $contract = Contract::where('id', $id)->first();

            // ? Client's Image
            $clientProfile = $contract->client->image;

            // ? Lawyer's Image
            $profile = $contract->lawyer->image;

            $response = [
                "id" => $contract->id,
                "contract_type" => $contract->type,
                "contract_title" => $contract->title,
                "start_date" => $contract->start_date,
                "end_date" => $contract->end_date,
                "fees_amount" => $contract->fees_amount,
                "additional_note" => $contract->additional_note,
                "clauses" => $contract->clauses,
                "status" => $contract->status,
                "lawyer_complete_request" => $contract->lawyer_complete_request,
                "document" => $contract->document != '' ? self::getPrivateS3File($contract->document) : '',
                'lawyer' => [
                    'id' => $contract->lawyer->id,
                    'first_name' => $contract->lawyer->first_name,
                    'last_name' => $contract->lawyer->last_name,
                    'email' => $contract->lawyer->email,
                    'profile' => $profile,
                    'image' => $profile,
                ],
                'client' => [
                    'id' => $contract->client->id,
                    'first_name' => $contract->client->first_name,
                    'last_name' => $contract->client->last_name,
                    'email' => $contract->client->email,
                    'phone_number' => $contract->client->phone_number,
                    'profile' => $clientProfile,
                    'image' => $clientProfile,
                ]
            ];

            return response()->json(['res' => 'success', 'message' => 'Contract Retrieved successfully', 'contracts' => $response]);
        } catch (\Throwable $th) {
            return response()->json(['res' => 'warning', 'message' => 'Something wrong while retrieving contract', 'error' => $th]);
        }
    }
}
