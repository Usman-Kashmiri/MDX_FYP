<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Auth\AllAuthController;
use App\Http\Controllers\Controller;
use App\Http\Resources\LawyerResource;
use App\Models\AreaExpertiseOfUsers;
use App\Models\LawyersJurisdiction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LawyerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $perPage = $request->query('per_page');

        try {
            $lawyers = User::with('lawyer_expertise', 'lawyer_ratings')->orderBy('created_at', 'desc')->where('role_id', 3)->paginate($perPage, ['*'], 'page', $page);

            if ($lawyers) {
                $lawyers = LawyerResource::collection($lawyers);

                $totalPages = $lawyers->lastPage();
                $totalRecords = $lawyers->total();

                return response()->json([
                    "res" => "success",
                    "message" => "Lawyers List!",
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    "data" => $lawyers,
                ]);
            }

            return response()->json(["res" => "error", "message" => "Lawyer Data Not Found!"]);
        } catch (\Throwable $th) {
            //throw $th;
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
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['res' => 'error', 'message' => $validator->errors()]);
        }

        try {
            $lawyer = User::create([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
                "phone_number" => $request->phone_number,
                "bar_membership_numer" => $request->bar_membership_number,
                // "jurisdiction_id" => $request->jurisdiction_id,
                "dob" => $request->dob,
                // "short_bio" => base64_encode($request->short_bio) ?? null,
                "country_id" => $request->country_id,
                "state_id" => $request->state_id,
                "zip_code" => $request->zip_code,
                "city" => $request->city,
                "address" => $request->address,
                "role_id" => 3,
                "terms_of_service" => 1,
                "status" => $request->status,
                "iban" => null,
                "balance" => null,
            ]);

            $user = $lawyer;

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

            $allAuthController = new AllAuthController;
            $allAuthController->mail("Account Created & Your Login Details Here!", $request->first_name . " " . $request->last_name, $request->email, "Your Login Email and Password Here:<br> Email Address:" . $request->email . "<br> Password:" . $request->password);

            if (!empty($lawyer)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Lawyer Added Successfully!",
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Can Not Add Lawyer!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function show(string $id)
    {
        try {
            $lawyer = User::find($id);

            if (!empty($lawyer)) {

                $lawyer = new LawyerResource($lawyer);

                return response()->json([
                    "res" => "success",
                    "message" => "Client Found!",
                    "detail" => $lawyer
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Lawyer Not Found!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                "first_name" => 'required|min:2',
                "last_name" => 'required|min:2',
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
                'status' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            if ($request->password != "") {
                User::where('id', $id)->update([
                    "password" => Hash::make($request->password),
                ]);
            }

            $lawyer = User::find($id);

            if ($lawyer) {
                User::where('id', $id)->update([
                    "first_name" => $request->first_name,
                    "last_name" => $request->last_name,
                    "phone_number" => $request->phone_number,
                    "bar_membership_numer" => $request->bar_membership_number,
                    // "jurisdiction_id" => $request->jurisdiction_id,
                    "dob" => $request->dob,
                    // "short_bio" => base64_encode($request->short_bio) ?? null,
                    "country_id" => $request->country_id,
                    "state_id" => $request->state_id,
                    "zip_code" => $request->zip_code,
                    "city" => $request->city,
                    "address" => $request->address,
                    "status" => $request->status,
                ]);

                $area_expertise_id = $request->input("area_expertise_id");
                if (count($area_expertise_id) > 0) {
                    foreach ($area_expertise_id as $experty) {
                        AreaExpertiseOfUsers::where('user_id', '=', $lawyer->id)->where('area_expertise_id', '!=', $experty)->delete();
                    }

                    $areaExpertiseOfUsers = new AreaExpertiseOfUsers();  // Create an instance of the model

                    $areaExpertiseOfUsers->createMany(array_map(function ($value) use ($lawyer) {
                        return [
                            "user_id" => $lawyer->id,
                            "area_expertise_id" => $value
                        ];
                    }, $request->area_expertise_id ?? []));
                }

                $jurisdiction_id = $request->input("jurisdiction_id");
                if (count($jurisdiction_id) > 0) {
                    foreach ($jurisdiction_id as $jury) {
                        LawyersJurisdiction::where('lawyer_id', '=', $lawyer->id)->where('jurisdiction_id', '!=', $jury)->delete();
                    }

                    $lawyersJurisdiction = new LawyersJurisdiction();

                    $lawyersJurisdiction->createMany(array_map(function ($value) use ($lawyer) {
                        return [
                            "lawyer_id" => $lawyer->id,
                            "jurisdiction_id" => $value
                        ];
                    }, $request->jurisdiction_id ?? []));
                }
                return response()->json([
                    "res" => "success",
                    "message" => "Lawyer Updated Successfully!",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Can Not Update Lawyer!",
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                "res" => "error",
                "message" => "Can Not Update Lawyer!",
                'error' => $e->getMessage()
            ]);
        }
    }

    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                "res" => "success",
                "message" => "Lawyer Deleted Successfully!",
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "res" => "error",
                "message" => $th->getMessage(),
            ]);
        }
    }
}
