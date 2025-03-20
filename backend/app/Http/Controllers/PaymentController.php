<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        try {
            $client = auth()->user();
            $client_id = $client->id;
            $contract_id = $request->contract_id;
            $contract = Contract::where('id', $contract_id)->where('client_id', $client_id)->first();
            $website = WebsiteSetting::find(1);


            $stripe = new StripeClient($website->stripe_sk);

            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => intval($contract->fees_amount * 100),
                'currency' => 'usd',
                'payment_method_types' => ['card'],
                'metadata' => ['integration_check' => 'accept_a_payment'],
            ]);

            return response()->json(['res' => 'success', "message" => "Transaction Successful", 'client_secret' => $paymentIntent->client_secret, 'fees_amount' => $contract->fees_amount]);
        } catch (\Throwable $th) {
            return response()->json(['res' => 'warning', 'message' => 'Something wrong while creating client_secret', 'error' => $th]);
        }
    }


    private function calculateOrderAmount(array $items): int
    {
        // Replace this with your calculation logic
        return 1400;
    }
}
