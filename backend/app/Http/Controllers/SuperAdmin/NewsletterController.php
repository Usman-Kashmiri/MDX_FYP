<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subscribers = NewsletterSubscriber::all();

        if (count($subscribers) > 0) {
            return response()->json([
                "res" => "success",
                "message" => "Newsletter Subscribers Found Successfully",
                "data" => $subscribers
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Newsletter Subscribers Not Found",
            ]);
        }
    }

    // Subscribe Newsletters API
    public function subscribe(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                "email" => 'required|email|unique:newsletter_subscribers',
            ],
            [
                "email.unique" => "Newsletters already subscribe on this email address"
            ]
        );
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $subscribers = NewsletterSubscriber::create([
                "email" => $request->email,
            ]);

            if (!empty($subscribers)) {

                return response()->json([
                    "res" => "success",
                    "message" => "Newsletters has been successfully subscribed for the provided email address",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't subscribe newsletters",
                ]);
            }
        }
    }

    // Unsubscribe Newsletters API
    public function unsubscribe(string $email)
    {
        $validator = Validator::make(
            ['email' => $email],
            [
                "email" => 'required|email|exists:newsletter_subscribers,email',
            ],
            [
                "email.exists" => "This email is not subscribed to newsletters",
            ]
        );
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $subscriber = NewsletterSubscriber::where('email', $email)->first();

            if (!empty($subscriber)) {
                if ($subscriber->delete()) {
                    return response()->json([
                        "res" => "success",
                        "message" => "Newsletters has been successfully unsubscribed for the provided email address",
                    ]);
                } else {
                    return response()->json([
                        "res" => "success",
                        "message" => "Couldn't unsubscribed newsletters for the provided email address",
                    ]);
                }
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't unsubscribe newsletters",
                ]);
            }
        }
    }
}
