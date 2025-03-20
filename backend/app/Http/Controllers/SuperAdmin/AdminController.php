<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Auth\AllAuthController;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $perPage = $request->query('per_page');

        try {
            $admins = User::where('role_id', 2)->paginate($perPage, ['*'], 'page', $page);

            if (count($admins) > 0) {
                $totalPages = $admins->lastPage();
                $totalRecords = $admins->total();

                $data = $admins->items();

                return response()->json([
                    "res" => "success",
                    "message" => "Admin List",
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    "data" => $data,
                ]);
            }

            return response()->json(["res" => "error", "message" => "Admins Not Found!"]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "first_name" => 'required|min:2',
            "last_name" => 'required|min:2',
            "email" => 'required|email|unique:users',
            "password" => 'required|same:password_confirmation|min:6',
            "password_confirmation" => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $admin = User::create([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
                "role_id" => 2,
                "terms_of_service" => 1,
                "status" => $request->status,
                "iban" => null,
                "balance" => null,
            ]);

            $this->mail("Account Created & Your Login Details Here!", $request->first_name . " " . $request->last_name, $request->email, "Your Login Email and Password Here:<br> Email Address:" . $request->email . "<br> Password:" . $request->password);

            if (!empty($admin)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Admin Added Successfully!",
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Can Not Add Admin!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function show(string $id)
    {
        try {
            $admin = User::find($id);

            if (!empty($admin)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Admin Found!",
                    "detail" => $admin
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Admin Not Found!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }


    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            "first_name" => 'required|min:2',
            "last_name" => 'required|min:2',
            "email" => 'required|email',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            if ($request->password != "") {
                User::where('id', $id)->update([
                    "password" => Hash::make($request->password),
                ]);
            }

            $admin = User::where('id', $id)->update([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "status" => $request->status
            ]);

            if (!empty($admin)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Admin Updated Successfully!",
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Can Not Update Admin!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            User::destroy($id);

            return response()->json([
                "res" => "success",
                "message" => "Admin Deleted Successfully!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
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
}
