<?php

namespace App\Http\Controllers\client;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContractResource;
use App\Mail\ContractAccepted;
use App\Mail\ContractCompleted;
use App\Models\Contract;
use App\Models\LawyerRating;
use App\Models\Notification;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Pusher\Pusher;

class ContractController extends Controller
{
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

    public function acceptContrant(Request $request)
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

            $client = auth()->user();
            $client_id = $client->id;
            $contract_id = $request->contract_id;
            $payment_intent = $request->paymentIntent;
            $payment_intent_client_secret = $request->paymentIntentClientSecret;
            $redirect_status = $request->redirectStatus;
            $websiteSetting = WebsiteSetting::find(1);
            $adminCommission_percent = intval($websiteSetting->admin_commission_percent);
            $platform_fees_percent = $adminCommission_percent / 100;

            if ($redirect_status == 'succeeded') {

                Contract::where('id', $contract_id)->where('client_id', $client_id)->update([
                    'status' => 'in-progress',
                    'payment_details' => '{paymentIntent:' . $payment_intent . ',paymentIntentClientSecret:' . $payment_intent_client_secret . ',redirectStatus:' . $redirect_status . '}',
                ]);

                $contract = Contract::find($contract_id);
                $platformAmount = floatval($platform_fees_percent) * floatval($contract->fees_amount);
                $lawyerAmount = intval($contract->fees_amount) - intval($platformAmount);

                $lawyerPusherData = [
                    [
                        'sender_image' => $client->image,
                        'attach_type' => '',
                        'message_type' => 'contract_complete',
                        'sender_name' => $client->first_name . ' ' . $client->last_name,
                        'sender_email' => $client->email,
                        'sender_id' => $client->id,
                        'message' => 'A new contract has been signed!',
                    ]
                ];

                $clientPusherData = [
                    [
                        'sender_image' => $contract->lawyer->image,
                        'attach_type' => '',
                        'message_type' => 'contract_complete',
                        'sender_name' => $contract->lawyer->first_name . ' ' . $contract->lawyer->last_name,
                        'sender_email' => $contract->lawyer->email,
                        'sender_id' => $contract->lawyer->id,
                        'message' => 'A new contract has been signed!',
                    ]
                ];

                Notification::create([
                    "user_id" => $contract->lawyer_id,
                    "title" => 'Congratulation, Your Client Has Signed the Client!',
                    "description" => 'Your client ' . $contract->client->first_name . ' ' . $contract->client->last_name . ' has signed the contract you submitted!',
                    "url" => "/dashboard/contract-details/$contract->id",
                ]);

                Notification::create([
                    "user_id" => $contract->client_id,
                    "title" => 'You Have Signed A New Contract!',
                    "description" => 'A new contract with your lawyer ' . $contract->lawyer->first_name . ' ' . $contract->lawyer->last_name . ' has been successfully signed!',
                    "url" => "/dashboard/contract-details/$contract->id",
                ]);

                $mail = [
                    'contract' => $contract,
                    'platform_fees' => $platformAmount,
                    'lawyer_fees' => $lawyerAmount,
                ];

                Mail::to($contract->client->email)->send(new ContractAccepted($mail));
                Mail::to($contract->lawyer->email)->send(new ContractAccepted($mail));

                $pusher->trigger('all-message-channel.' . $contract->lawyer->id, 'all-message-event.' . $contract->lawyer->id, ['data' => $lawyerPusherData]);
                $pusher->trigger('all-message-channel.' . $client->id, 'all-message-event.' . $contract->lawyer->id, ['data' => $clientPusherData]);

                return response()->json(['res' => 'success', 'message' => 'Contract Accepted Successfully']);
            }

            return response()->json(['res' => 'warning', 'message' => 'Something wrong while, Try again']);
        } catch (\Throwable $th) {
            return response()->json(['res' => 'warning', 'message' => 'Something wrong while retrieving contract']);
        }
    }

    public function completeRequestsList()
    {

        try {
            $client = auth()->user();
            $client_id = $client->id;
            $contracts = Contract::where('client_id', $client_id)->where('status', "in-progress")->where('lawyer_complete_request', 1)->orderBy('id', 'desc')->get();

            if (count($contracts) > 0) {
                $contracts = ContractResource::collection($contracts);

                return response()->json(['res' => 'success', 'message' => 'Contract Retrieved successfully', 'contracts' => $contracts]);
            }
        } catch (\Throwable $th) {
            return response()->json(['res' => 'warning', 'message' => 'Something wrong while retrieving contract', 'error' => $th]);
        }
    }

    public function acceptCompleteRequest(Request $request)
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

            $contract_id = $request->contract_id;
            $feedback = $request->feedback;
            $rating = $request->rating;
            $websiteSetting = WebsiteSetting::find(1);
            $adminCommission_percent = intval($websiteSetting->admin_commission_percent);
            $platform_fees_percent = $adminCommission_percent / 100;
            $client = auth()->user();

            $contract = Contract::where('id', $contract_id)
                ->where('client_id', $client->id)
                ->where('status', 'in-progress')
                ->where('lawyer_complete_request', 1)
                ->first();

            if (!$contract) {
                return response()->json(['res' => 'error', 'message' => 'Contract not found or not eligible for completion']);
            }
            $user = User::where('id', $contract->lawyer_id);
            $platformAmount = floatval($platform_fees_percent) * floatval($contract->fees_amount);
            $lawyerAmount = intval($contract->fees_amount) - intval($platformAmount);

            Contract::where('id', $contract->id)->update([
                'status' => 'complete'
            ]);

            // User::where('id', $contract->lawyer_id)->update([
            //     'balance' => intval($contract->lawyer->balance) + intval($lawyerAmount),
            // ]);
            $user->balance = intval($contract->lawyer->balance) + intval($lawyerAmount);
            $user->save();

            $rating = LawyerRating::create([
                'client_id' => $client->id,
                'lawyer_id' => $contract->lawyer->id,
                'rating' => $rating,
                'feedback' => $feedback,
            ]);

            $mail = [
                'contract' => $contract,
                'platform_fees' => $platformAmount,
                'lawyer_fees' => $lawyerAmount,
                'rating' => $rating,
            ];

            $lawyerPusherData = [
                [
                    'sender_image' => $client->image,
                    'attach_type' => '',
                    'message_type' => 'contract_complete',
                    'sender_name' => $client->first_name . ' ' . $client->last_name,
                    'sender_email' => $client->email,
                    'sender_id' => $client->id,
                    'message' => 'Contract Completed: ' . $contract->title . ', Rating: ' . $rating . ', Feedback: ' . $feedback,
                ]
            ];

            $clientPusherData = [
                [
                    'sender_image' => $contract->lawyer->image,
                    'attach_type' => '',
                    'message_type' => 'contract_complete',
                    'sender_name' => $contract->lawyer->first_name . ' ' . $contract->lawyer->last_name,
                    'sender_email' => $contract->lawyer->email,
                    'sender_id' => $contract->lawyer->id,
                    'message' => 'Contract Completed: ' . $contract->title . ', Rating: ' . $rating . ', Feedback: ' . $feedback,
                ]
            ];

            Notification::create([
                "user_id" => $contract->lawyer_id,
                "title" => 'Congratulation, Your Contract Completion Requestion Was Accepted!',
                "description" => 'Your client ' . $contract->client->first_name . ' ' . $contract->client->last_name . ' has accepted the contract completion request!',
                "url" => "/dashboard/contract-details/$contract->id",
            ]);

            Notification::create([
                "user_id" => $contract->client_id,
                "title" => 'Congratulation, You Have Successfully Completed A Contract!',
                "description" => 'Your contract with your lawyer ' . $contract->lawyer->first_name . ' ' . $contract->lawyer->last_name . ' has been successfully completed!',
                "url" => "/dashboard/contract-details/$contract->id",
            ]);

            Mail::to($contract->client->email)->send(new ContractCompleted($mail));
            Mail::to($contract->lawyer->email)->send(new ContractCompleted($mail));

            $pusher->trigger('all-message-channel.' . $contract->lawyer->id, 'all-message-event.' . $contract->lawyer->id, ['data' => $lawyerPusherData]);
            $pusher->trigger('all-message-channel.' . $client->id, 'all-message-event.' . $contract->lawyer->id, ['data' => $clientPusherData]);

            return response()->json(['res' => 'success', 'message' => 'Congratulations, the contract has been successfully completed']);
        } catch (\Throwable $th) {
            $contract_id = $request->contract_id;
            Contract::where('id', $contract->id)->update([
                'status' => 'in-progress'
            ]);
            return response()->json(['res' => 'error', 'message' => 'Something went wrong while completing the contract', 'error' => $th->getMessage()]);
        }
    }
}
