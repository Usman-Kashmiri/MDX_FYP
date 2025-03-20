<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionHistoryResource;
use App\Models\TransactionsHistory;
use Illuminate\Http\Request;

class TransactionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = auth()->user()->id;

        if ($userId) {

            if (isset($request->start_date) && isset($request->end_date)) {
                $transactions = TransactionsHistory::where('user_id', $userId)->whereBetween('created_at', [$request->start_date, $request->end_date])->orderBy('created_at', 'desc')->get();
            } else {
                $transactions = TransactionsHistory::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
            }

            if (count($transactions) > 0) {

                $transactions = TransactionHistoryResource::collection($transactions);

                return response()->json([
                    "res" => "success",
                    "message" => "Transactions History Found Successfully",
                    "data" => $transactions,
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Transactions History Not Found",
                ]);
            }
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
        $userId = auth()->user()->id;

        if ($userId) {
            $transaction = TransactionsHistory::where('id', $id)->where('user_id', $userId)->first();

            if (!empty($transaction)) {

                $transaction = new TransactionHistoryResource($transaction);

                return response()->json([
                    "res" => "success",
                    "message" => "Transactions History Found Successfully",
                    "data" => $transaction,
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Transaction History Not Found",
                ]);
            }
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
