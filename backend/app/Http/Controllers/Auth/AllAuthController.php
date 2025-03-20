<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserLoggedIn;
use App\Events\UserLoggedOut;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Http\Resources\LawyerResource;
use App\Mail\VerificationMail;
use App\Models\AreaExpertiseOfUsers;
use App\Models\LawyersJurisdiction;
use App\Models\PasswordResets;
use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Pusher\Pusher;
use Tymon\JWTAuth\Facades\JWTAuth;

class AllAuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'register_with', 'login_with', 'logout', 'verify_email', 'resend_verify_email', 'reset_password', 'forgot_password']]);
    }

    public function connect(Request $request)
    {
        $user = auth()->user();
        $user_id = $user->id;

        $redis = Redis::connection();

        // Add the user to the list of online users in Redis
        $redis->sadd('online_users', $user_id);

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

        // Get the updated list of online users from Redis
        $onlineUsers = $redis->smembers('online_users');

        // Trigger the event with the updated list of online users
        $pusher->trigger('my-channel', 'onlineUser', ['data' => $onlineUsers]);

        return response()->json(['message' => 'Connected successfully']);
    }

    public function disconnect(Request $request)
    {
        $user = auth()->user();
        $user_id = $user->id;

        $redis = Redis::connection();

        // Remove the user from the list of online users in Redis
        $redis->srem('online_users', $user_id);

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

        // Get the updated list of online users from Redis
        $onlineUsers = $redis->smembers('online_users');

        // Trigger the event with the updated list of online users
        $pusher->trigger('my-channel', 'onlineUser', ['data' => $onlineUsers]);

        return response()->json(['message' => 'Disconnected successfully']);
    }

    public function register(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                "first_name" => 'required|min:2',
                "last_name" => 'required|min:2',
                "email" => 'required|email|unique:users',
                "password" => 'required|same:password_confirmation|min:6',
                "password_confirmation" => 'required',
                'terms_of_service' => 'required',
                "role_id" => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            } else {
                $user = User::create([
                    "first_name" => $request->first_name,
                    "last_name" => $request->last_name,
                    "email" => $request->email,
                    "password" => Hash::make($request->password),
                    "role_id" => $request->role_id,
                    "terms_of_service" => $request->terms_of_service,
                    "iban" => '0',
                    "balance" => '0',
                ]);
                $verification_code = $this->code(8, 15);
                User::where('id', $user->id)->update([
                    "verification_code" => $verification_code
                ]);
                $mailData = [
                    "first_name" => $request->first_name,
                    "last_name" => $request->last_name,
                    "email" => $request->email,
                    "verification_code" => $verification_code,
                    "verification_link" => "https://nbundl.com/verify-email/" . $verification_code,
                ];
                Mail::to($request->email)->send(new VerificationMail($mailData));
                return response()->json([
                    "res" => "success",
                    "message" => "Your account has been created successfully! Please check your email inbox to verify your account. Do not forget to check your spam folder as well.",
                    "users" => $this->user_detail($user->id),
                ]);
            }
            //code...
        } catch (\Throwable $th) {
            return response()->json([
                "res" => "warning",
                "message" => "Something wrong",
                "error" => $th->getMessage(),
            ]);
        }
    }

    public function register_with(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "first_name" => 'required|min:2',
            "last_name" => 'required|min:2',
            "email" => 'required|email|unique:users',
            "photoUrl" => 'required',
            'terms_of_service' => 'required',
            "role_id" => 'required',
            "provider" => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = User::create([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "password" => Hash::make($request->first_name . '@123'),
                "image" => $request->photoUrl,
                "terms_of_service" => $request->terms_of_service,
                "role_id" => $request->role_id,
                "email_verified_at" => now(),
                "phone_number" => $request->phoneNumber,
                "provider" => $request->provider,
                "status" => '1',
                "iban" => null,
                "balance" => null,
            ]);

            return response()->json([
                "res" => "success",
                "message" => "Your account has been created successfully!",
                "data" => $this->user_detail($user['id']),
            ]);
        }
    }

    public function login_with(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => 'required|email',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json(["message" => "User not found!", "res" => "error"]);
            }

            $token = JWTAuth::fromUser($user);

            if ($token) {
                // User::where('id', $user->id)->update([
                //     "is_online" => "1"
                // ]);


                return response()->json([
                    "res" => "success",
                    "message" => "Login Successfully!",
                    "role_id" => $user->role_id,
                    "token" => $this->respondWithToken($token),
                    "user" => $this->user_detail($user['id'])
                ]);
            } else {
                return response()->json(["message" => "Incorrect Password!", "res" => "warning"]);
            }
        }
    }

    public function update_client(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "first_name" => 'required|min:2',
            "last_name" => 'required|min:2',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = auth()->user();
            $uploadedImage = self::uploadWEBPImageOnS3($request, 'image', $user, 'users', "public");
            $user = User::where('id', $user()->id)->update([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "country_id" => $request->country_id ?? 0,
                "state_id" => $request->state_id ?? 0,
                "phone_number" => $request->phone_number ?? null,
                "address" => $request->address ?? null,
                "city" => $request->city ?? null,
                "zip_code" => $request->zip_code ?? null,
                "image" => $uploadedImage ?? null
            ]);
            return response()->json([
                "res" => "success",
                "message" => "Your profile account all details update successfully!",
                "users" => $this->user_detail(auth()->user()->id),
            ]);
        }
    }

    public function update_lawyer(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                "first_name" => 'required|min:2',
                "last_name" => 'required|min:2',
                "country_id" => 'required',
                "state_id" => 'required',
                "phone_number" => 'required|min:10',
                "address" => 'required',
                "city" => 'required',
                "zip_code" => 'required',
                "image" => 'required|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
                // "short_bio" => 'max:500',
                "bar_membership_number" => 'required',
                "jurisdiction_id" => 'required',
                "area_expertise_id" => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            } else {

                $user = auth()->user();
                $uploadedImage = self::uploadWEBPImageOnS3($request, 'image', $user, 'users', "public");
                
                $user = User::find($user->id);
                $user->first_name = $request->first_name;
                $user->last_name = $request->last_name;
                $user->country_id = $request->country_id ?? 0;
                $user->state_id = $request->state_id ?? 0;
                $user->phone_number = $request->phone_number ?? null;
                $user->address = $request->address ?? null;
                $user->city = $request->city ?? null;
                $user->zip_code = $request->zip_code ?? null;
                $user->image = $uploadedImage ?? null; 
                // $user->short_bio = base64_encode($request->short_bio) ?? null;
                $user->bar_membership_number = $request->bar_membership_number;
                // $user->jurisdiction_id = $request->jurisdiction_id;

                $user->save();

                $area_expertise_id = $request->input("area_expertise_id");
                if (count($area_expertise_id) > 0) {
                    foreach ($area_expertise_id as $experty) {
                        AreaExpertiseOfUsers::where('user_id', '=', $user->id)->where('area_expertise_id', '!=', $experty)->delete();
                    }

                    $areaExpertiseOfUsers = new AreaExpertiseOfUsers();  // Create an instance of the model

                    $areaExpertiseOfUsers->createMany(array_map(function ($value) use ($user) {
                        return [
                            "user_id" => $user->id,
                            "area_expertise_id" => $value
                        ];
                    }, $request->area_expertise_id ?? []));
                }

                $jurisdiction_id = $request->input("jurisdiction_id");
                if (count($jurisdiction_id) > 0) {
                    foreach ($jurisdiction_id as $jury) {
                        LawyersJurisdiction::where('lawyer_id', '=', $user->id)->where('jurisdiction_id', '!=', $jury)->delete();
                    }

                    $lawyersJurisdiction = new LawyersJurisdiction();

                    $lawyersJurisdiction->createMany(array_map(function ($value) use ($user) {
                        return [
                            "lawyer_id" => $user->id,
                            "jurisdiction_id" => $value
                        ];
                    }, $request->jurisdiction_id ?? []));
                }

                return response()->json([
                    "res" => "success",
                    "message" => "Your profile account all details update successfully!",
                    "users" => $this->user_detail(auth()->user()->id),
                ]);
            }

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Something went wrong!', 'error' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => 'required|email',
            "password" => 'required|min:6'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = User::where('email', $request->email)->first();
            if (!empty($user) && $user->status == 0) {
                return response()->json(["res" => "error", "message" => "login failed because your account is not verified! Please check Your mail inbox!"]);
            }
            $token = Auth::attempt(['email' => $request->email, 'password' => $request->password, "status" => "1"]);

            if ($token) {
                // User::where('id', auth()->user()->id)->update([
                //     "is_online" => "1"
                // ]);


                return response()->json([
                    "res" => "success",
                    "message" => "Login Successfully!",
                    "role_id" => auth()->user()->role_id,
                    "token" => $this->respondWithToken($token),
                    "user" => $this->user_detail(auth()->user()->id)
                ]);
            } else {
                return response()->json(["message" => "Incorrect Email or Password!", "res" => "warning"]);
            }
        }
    }

    protected function respondWithToken($token)
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ];
    }

    public function refresh()
    {
        return response()->json([
            "res" => "success",
            "message" => "Refresh Token Create Successfully!",
            "token" => $this->respondWithToken(auth()->refresh())
        ]);
    }

    public function logout()
    {
        User::find(auth()->user()->id);

        auth()->logout();

        return response()->json(["res" => "success", 'message' => 'User successfully signed out']);
    }

    public function verify_email(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "token" => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = User::where('verification_code', $request->token)->first();
            if (empty($user)) {
                return response()->json(["res" => "error", 'message' => 'This account activation token is invalid.']);
            }
            $time = Carbon::parse($user->updated_at)->addMinutes(10)->toDateTimeString();
            if (now()->toDateTimeString() >= $time) {
                return response()->json(["res" => "error", 'message' => 'Token valid timeout, Please generate new token.']);
            }
            if ($user->status == "1" and !empty($user->email_verified_at)) {
                return response()->json(["res" => "warning", 'message' => 'Your account already activated. Please do a login.']);
            }
            User::where('id', $user->id)->update([
                'status' => '1',
                'email_verified_at' => now()
            ]);

            $user = User::where('verification_code', $request->token)
                ->where('id', $user['id'])
                ->where('status', '1')
                ->first();

            if (empty($user)) {
                return response()->json(["res" => "error", 'message' => 'This account activation token is invalid.']);
            }

            // Generate the JWT token for the user
            $token = JWTAuth::fromUser($user);

            if ($token) {
                // User::where('id', $user['id'])->update([
                //     "is_online" => "1"
                // ]);
                return response()->json([
                    "res" => "success",
                    "message" => 'Your account is successfully activated.Login Successfully!',
                    "role_id" => $user['role_id'],
                    "token" => $this->respondWithToken($token), // Include the JWT token in the response
                    "user" => $this->user_detail($user['id'])
                ]);
            }
        }
    }

    public function resend_verify_email(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => 'required|email'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = User::where('email', $request->email)->first();
            $time = Carbon::parse($user->updated_at)->addMinutes(10)->toDateTimeString();
            if (empty($user)) {
                return response()->json(["res" => "error", 'message' => 'User Not Found!']);
            }
            if ($user->status == "1" and !empty($user->email_verified_at)) {
                return response()->json(["res" => "warning", 'message' => 'Your account already activated. Please do a login.']);
            }
            // Check if a token was sent within the last 10 minutes
            $lastTokenSentAt = $user->updated_at;
            $cooldownPeriod = Carbon::parse($lastTokenSentAt)->addMinute(1);
            if (Carbon::now()->lt($cooldownPeriod)) {
                $remainingTime = Carbon::now()->diffInSeconds($cooldownPeriod);
                return response()->json(["res" => "error", 'message' => 'A new verification token can only be sent after ' . $remainingTime . ' seconds.']);
            }
            // Generate a new verification token
            $verification_code = $this->code(8, 15);
            // A success response
            User::where('id', $user->id)->update([
                "verification_code" => $verification_code,
                "updated_at" => now()
            ]);
            $this->mail("Email Verification Token Again Sent!", $user->first_name . " " . $user->last_name, $request->email, 'If this was you, please provide the below token on the challenge page:' . $verification_code);
            return response()->json(["res" => "success", 'message' => 'New Verification Token Has Been Sent To Your Email Account!']);
        }
    }

    public function reset_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => 'required|email'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = User::where('email', $request->email)->first();
            if (empty($user)) {
                return response()->json(["res" => "error", 'message' => 'User Not Found!']);
            }
            // Generate a new verification token
            $verification_code = $this->code(8, 15);
            // A success response
            PasswordResets::unguard();
            PasswordResets::create([
                "email" => $request->email,
                "token" => $verification_code
            ]);
            PasswordResets::reguard();
            $this->mail("Reset Password Code Sent!", $user->first_name . " " . $user->last_name, $request->email, 'If this was you, please provide the below token on the challenge page:' . $verification_code);
            return response()->json(["res" => "success", 'message' => 'A reset password token has been sent to you, Please check your email inbox. Do not forget to check your spam folder as well.']);
        }
    }

    public function forgot_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "token" => 'required',
            'password' => 'required|same:password_confirmation|min:6',
            "password_confirmation" => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $resetpassword = PasswordResets::where('token', $request->token)->first();
            if ($resetpassword) {
                $user = User::where('email', $resetpassword->email)->first();
                if (empty($user)) {
                    return response()->json(["res" => "error", 'message' => 'User Not Found!']);
                }
                // A success response
                User::where('id', $user->id)->update([
                    'password' => Hash::make($request->password),
                    'updated_at' => now()
                ]);
                return response()->json(["res" => "success", 'message' => 'Password Change Successfully!']);
            } else {
                return response()->json(["res" => "error", 'message' => 'Reset Password Code Not Valid!']);
            }
        }
    }

    public function user_detail($id = null)
    {
        try {

            $data = [];
            if (!Auth::check()) {
                $user = User::find($id);
            } else {
                $user = User::find(auth()->user()->id);
            }
            if (!empty($user)) {
                if ($user->role_id == 3) {
                    $reviews = true;
                    $withdrawRequests = false;
                    $cases = false;
                    $contracts = false;
                    $transactionsHistory = false;
                    $appointments = false;

                    $data = new LawyerResource($user, $reviews, $withdrawRequests, $cases, $contracts, $transactionsHistory, $appointments);
                } elseif ($user->role_id == 4) {
                    $data = new ClientResource($user);
                } else {
                    $data = ["id" => $user->id, "first_name" => $user->first_name, "last_name" => $user->last_name, "role" => $user->role->name, "email" => $user->email, "image" => $user->image, "is_online" => $user->is_online, "status" => ($user->status == 1) ? "Active" : "Inactive", "provider" => $user->provider, "dob" => date_format(date_create($user->dob), "Y-m-d")];
                }
                return $data;
            }
            //code...
        } catch (\Throwable $e) {
        
            return response()->json(['status' => 'error', 'message' => 'Something went wrong while retrieving withdraw request', 'error' => $e->getMessage()], 500);
     
        }
    }

    public function mail($subject, $name, $email, $message)
    {
        $user = new User();
        $user->subject = $subject;
        $user->greeting = "Hello " . $name . ",";
        $user->email = $email;
        $user->verificationUrl = $message;
        $user->notify(new VerifyEmailNotification($user));
    }

    public function code($min, $max)
    {
        $length = mt_rand($min, $max); // Generate a random length between min and max
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters to use for generating the random string
        $randomString = Str::upper(Str::random($length)); // Generate a random string of the specified length and convert it to uppercase
        return $randomString;
    }

    // ? togggle is_online of a user
    public function updateOnlineStatus($status)
    {
        try {
            $user = auth()->user();

            if ($status !== "online" && $status !== "offline") {
                return response()->json(["success" => false, "message" => "Invalid status value"], 400);
            }

            User::where("id", $user->id)->update(["is_online" => $status === "online" ? "1" : "0"]);

            return response()->json(["success" => true, "message" => "Online status updated successfully"], 200);
        } catch (\Throwable $th) {
            return response()->json(["success" => false, "message" => "Something went wrong", "error" => $th->getMessage()], 500);
        }
    }

    public function email_notifications($status)
    {
        $validator = Validator::make(['status' => $status], [
            "status" => "required|in:0,1"
        ]);

        if ($validator->fails()) {
            return self::failureResponse($validator->errors()->first(), 400);
        }

        try {
            $user = User::find(auth()->user()->id);

            $user->email_notifications = $status;

            $user->save();

            $notificationStatus = $status == 1 ? "enabled" : "disabled";

            return self::successResponse("Email notification has been " . $notificationStatus . "!");
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    // ? deactivate account
    public function deactivate_account()
    {
        try {
            $user = User::find(auth()->user()->id);

            if (!$user) {
                return self::failureResponse("User doesn't exist!", 404);
            }

            $isDeactivated = $user->update([
                "status" => "0",
            ]);

            if ($isDeactivated) {
                return self::successResponse("Account has been deactivated!");
            }

            return self::failureResponse("Failed to deactivate your account!", 500);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }
}
