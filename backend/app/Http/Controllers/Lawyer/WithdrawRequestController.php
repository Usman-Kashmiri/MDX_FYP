<?php

namespace App\Http\Controllers\Lawyer;

use App\Http\Controllers\Controller;
use App\Http\Resources\WithdrawRequestResource;
use App\Models\User;
use App\Models\WithdrawRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WithdrawRequestController extends Controller
{

    public function update_iban(Request $request)
    {
        try {
            $lawyer = auth()->user();
            $validator = Validator::make($request->all(), [
                'iban' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'res' => 'error',
                    'message' => 'Invalid input',
                    'errors' => $validator->errors()->first(),
                ]);
            }

            $user = User::find($lawyer->id);
            $user->iban = $request->iban;
            $updatedUser = $user->save();

            if ($updatedUser) {
                return response()->json(['res' => 'success', 'message' => 'IBAN updated successfully', "iban" => $request->iban]);
            }
        } catch (\Exception $e) {
            return response()->json(['res' => 'error', 'message' => 'Something went wrong while updating iban number', 'error' => $e->getMessage()]);
        }
    }

    public function withdraw_request(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|gt:99',
            ], [
                'amount.gt' => 'The amount must be greater than 100.',
                'amount.required' => 'Invalid input',
                'amount.numeric' => 'The amount must be integer type',
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
            }

            $lawyer = auth()->user();
            $lawyer_id = $lawyer->id;
            $amount = $request->amount;

            if ($lawyer->iban == '') {
                return response()->json(['status' => 'warning', 'message' => 'Add your iban number'], 400);
            }

            if ($lawyer->balance < intval($amount)) {
                return response()->json(['status' => 'warning', 'message' => 'Insufficient balance for your withdrawal amount'], 400);
            }

            WithdrawRequest::create([
                'user_id' => $lawyer_id,
                'iban' => $lawyer->iban,
                'amount' => $amount
            ]);

            return response()->json(['status' => 'success', 'message' => 'Withdraw request sent successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Something went wrong while sending the withdraw request', 'error' => $e->getMessage()]);
        }
    }

    public function withdraw_request_list()
    {
        try {
            $lawyer = auth()->user();

            $withRequest = WithdrawRequest::where('user_id', $lawyer->id)->get();

            $withRequest = WithdrawRequestResource::collection($withRequest);
            $iban = '';
            $current_balance = 0;
            if ($lawyer->iban) {
                $iban = $lawyer->iban;
            }
          
            if ($lawyer->balance) {
                $current_balance = $lawyer->balance;
            }

            if (count($withRequest) > 0) {
                return response()->json(['status' => 'success', 'message' => 'Withdraw request found successfully', 'iban' => $iban, 'current_balance' => $current_balance, 'data' => $withRequest], 200);
            } else {
                return response()->json(['status' => 'success', 'message' => 'Withdraw request found successfully', 'iban' => $iban, 'current_balance' => $current_balance, 'data' => []], 200);
                // return response()->json(['status' => 'error', 'message' => 'Data not found']);
            }
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Something went wrong while retrieving withdraw request', 'error' => $e->getMessage()], 500);
        }
    }
}
