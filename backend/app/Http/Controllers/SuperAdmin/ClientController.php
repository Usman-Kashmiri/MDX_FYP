<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Auth\AllAuthController;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{

    public function index(Request $request)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $perPage = $request->query('per_page');

        try {
            $clients = User::where('role_id', 4)->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

            if (count($clients) > 0) {
                $clients =  ClientResource::collection($clients);

                $totalPages = $clients->lastPage();
                $totalRecords = $clients->total();

                return response()->json([
                    "res" => "success",
                    "message" => "Client Data List",
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    "data" => $clients
                ]);
            }

            return response()->json(["res" => "error", "message" => "Client Data Not Found!"]);
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
            "phone_number" => "required",
            "country_id" => "required",
            "state_id" => "required",
            "zip_code" => "required",
            "city" => "required",
            "address" => "required",
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['res' => 'error', 'message' => $validator->errors()]);
        }

        try {
            $client = User::create([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
                "phone_number" => $request->phone_number,
                "country_id" => $request->country_id,
                "state_id" => $request->state_id,
                "zip_code" => $request->zip_code,
                "city" => $request->city,
                "address" => $request->address,
                "role_id" => 4,
                "terms_of_service" => 1,
                "status" => $request->status,
                "iban" => null,
                "balance" => null,
            ]);

            $allAuthController = new AllAuthController;
            $allAuthController->mail("Account Created & Your Login Details Here!", $request->first_name . " " . $request->last_name, $request->email, "Your Login Email and Password Here:<br> Email Address:" . $request->email . "<br> Password:" . $request->password);

            if (!empty($client)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Client Added Successfully!",
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Can Not Add Client!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function show(string $id)
    {
        try {
            $client = User::find($id);

            $client =  new ClientResource($client);

            if (!empty($client)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Client Found!",
                    "detail" => $client
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Client Not Found!",
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
            "phone_number" => "required",
            'status' => 'required',
            "country_id" => "required",
            "state_id" => "required",
            "zip_code" => "required",
            "city" => "required",
            "address" => "required",
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

            $client = User::where('id', $id)->update([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "status" => $request->status,
                "phone_number" => $request->phone_number,
                "country_id" => $request->country_id,
                "state_id" => $request->state_id,
                "zip_code" => $request->zip_code,
                "city" => $request->city,
                "address" => $request->address,
                "status" => $request->status,
            ]);

            if (!empty($client)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Client Updated Successfully!",
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Can Not Update Client!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            $isDeleted = User::destroy($id);

            if ($isDeleted) {
                return response()->json([
                    "res" => "success",
                    "message" => "Client Deleted Successfully!",
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Couldn't Delete Client!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }
}
