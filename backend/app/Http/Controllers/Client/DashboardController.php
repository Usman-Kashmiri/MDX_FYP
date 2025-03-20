<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseResource;
use App\Models\LawyersCase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function index()
    {
        $id = auth()->user()->id;
        $lawyersCases = LawyersCase::with('lawyer')->where('client_id', $id)->get();

        if ($lawyersCases->isNotEmpty()) {
            $lawyersCases = CaseResource::collection($lawyersCases);

            return response()->json(["res" => "success", "message" => "Lawyers List", "data" => $lawyersCases]);
        } else {
            return response()->json(["res" => "error", "message" => "Lawyers Not Found"]);
        }
    }

    public function profileimage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "image" => 'required|image|mimes:jpeg,png,gif,jpg,webp,svg|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }
        try {

            $user = auth()->user();
            $uploadedImage = self::uploadWEBPImageOnS3($request, 'image', $user, 'users', "public");

            if ($uploadedImage != "" && $uploadedImage != null) {

                User::where('id', $user->id)->update([
                    "image" => $uploadedImage,
                ]);

                return response()->json([
                    "res" => "success",
                    "message" => "Profile Pic Updated Successfully!",
                ], 200);
            }
        } catch (\Throwable $th) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Failed to update profile picture!",
                    "error" => $th->getMessage(),
                ],
                500
            );
        }
    }

    public function personal_info(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "first_name" => 'required|min:2',
            "last_name" => 'required|min:2',
            "email" => 'required|email',
            "phone_number" => "required",
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = auth()->user();
            User::where("id", $user->id)->update([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "dob" => $request->dob,
                "phone_number" => $request->phone_number,
            ]);
            return response()->json([
                "res" => "success",
                "message" => "Personal Information Updated Successfully!",
            ]);
        }
    }
    public function address_info(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "country_id" => "required",
            "state_id" => "required",
            "zip_code" => "required",
            "city" => "required",
            "address" => "required"
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = auth()->user();
            User::where("id", $user->id)->update([
                "country_id" => $request->country_id,
                "state_id" => $request->state_id,
                "zip_code" => $request->zip_code,
                "city" => $request->city,
                "address" => $request->address
            ]);
            return response()->json([
                "res" => "success",
                "message" => "Address Detail Updated Successfully!",
            ]);
        }
    }
    public function update_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "password" => 'required|same:password_confirmation|min:6',
            "password_confirmation" => 'required',
            "current_password" => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $user = auth()->user();
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    "res" => "error",
                    "message" => "Invalid Current Password!",
                ]);
            }
            User::where("id", $user->id)->update([
                "password" => Hash::make($request->password),
            ]);
            return response()->json([
                "res" => "success",
                "message" => "Password Updated Successfully!",
            ]);
        }
    }
}
