<?php

namespace App\Http\Controllers\Lawyer;

use App\Http\Controllers\Controller;
use App\Models\AreaExpertiseOfUsers;
use App\Models\Jurisdiction;
use App\Models\LawyersJurisdiction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
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
        try {
            //code...

            $validator = Validator::make($request->all(), [
                "first_name" => 'required|min:2',
                "last_name" => 'required|min:2',
                "email" => 'required|email',
                "phone_number" => "required",
                // "short_bio" => "required",
                "dob" => "required",
                "bar_membership_number" => "required",
                "jurisdiction_id" => "required",
                "area_expertise_id" => "required",
                "country_id" => "required",
                "state_id" => "required",
                "zip_code" => "required",
                "city" => "required",
                "address" => "required",
            ]);
            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            } else {
                $user = auth()->user();
                $user = User::find($user->id);
                $user->first_name = $request->first_name;
                $user->last_name = $request->last_name;
                $user->email = $request->email;
                $user->phone_number = $request->phone_number;
                $user->bar_membership_numer = $request->bar_membership_number;
                // "jurisdiction_id = $request->jurisdiction_id;
                $user->dob = $request->dob;
                // "short_bio = base64_encode($request->short_bio) ?? null;
                $user->country_id = $request->country_id;
                $user->state_id = $request->state_id;
                $user->zip_code = $request->zip_code;
                $user->city = $request->city;

                $user->address = $request->address;
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
                    "message" => "Personal Information Updated Successfully!",
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json(['status' => 'error', 'message' => 'Something went wrong while retrieving withdraw request', 'error' => $e->getMessage()], 500);

        }
    }

    // ? For the time being this API is useless due to change of flow of setting jurisdiction.
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
