<?php

namespace App\Http\Controllers\Website;

use App\Http\Controllers\Controller;
use App\Http\Resources\JurisdictionResource;
use App\Http\Resources\LawyerResource;
use App\Http\Resources\WebsiteSettingsResource;
use App\Models\Appointment;
use App\Models\AreaExpertise;
use App\Models\Chat;
use App\Models\ContractReview;
use App\Models\Countries;
use App\Models\Jurisdiction;
use App\Models\LawyerRating;
use App\Models\States;
use App\Models\TransactionsHistory;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AllController extends Controller
{
    public function area_expertise()
    {
        $area_expertises = AreaExpertise::where('status', 1)->orderBy("created_at", "DESC")->get();
        if (!empty($area_expertises)) {
            return response()->json(["res" => "success", "message" => "All Area Of Expertise List Found!", "data" => $area_expertises]);
        } else {
            return response()->json(["res" => "success", "message" => "All Area Of Expertise List Not Found!"]);
        }
    }
    public function jurisdiction(Request $request)
    {
        if (isset($request->country_id)) {
            $jurisdictions = Jurisdiction::with('country')->where('status', 1)->where('country_id', $request->country_id)->orderBy("created_at", "DESC")->get();
            if (count($jurisdictions) > 0) {

                $jurisdictions = JurisdictionResource::collection($jurisdictions);

                return response()->json(["res" => "success", "message" => "All Jurisdiction List Found!", "data" => $jurisdictions]);
            } else {
                return response()->json(["res" => "error", "message" => "All Jurisdiction List Not Found!"]);
            }
        } else {
            return response()->json(["res" => "warning", "message" => "Please specify a valid country to fetch jurisdictions!"]);
        }
    }
    public function countries()
    {
        try {

            $countries = Countries::where('status', 1)->get();

            if (count($countries) > 0) {
                return response()->json(["res" => "success", "message" => "Countries List Found!", "data" => $countries]);
            } else {
                return response()->json(["res" => "warning", "message" => "Countries Not Found!", "data" => []]);
            }
            //code...
        } catch (\Throwable $th) {
            return response()->json(["res" => "error", "message" => "Something wrong in the database", "error" => $th->getMessage(), "data" => []]);
        }
    }
    public function state(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                "country_id" => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }
            $states = States::where('country_id', $request->country_id)->get();
            if (!empty($states)) {
                return response()->json(["res" => "success", "message" => "All State List Found!", "data" => $states]);
            } else {
                return response()->json(["res" => "warning", "message" => "All State List Not Found!", "data" => []]);
            }
            //code...
        } catch (\Throwable $th) {
            return response()->json(["res" => "error", "message" => "Something wrong in the database", "error" => $th->getMessage(), "data" => []]);
        }
    }
    public function lawyer($id)
    {
        $lawyer = User::where(["id" => $id, "role_id" => 3, 'status' => "1"])->first();

        if (!empty($lawyer)) {

            $lawyer = [
                "id" => $lawyer?->id,
                "first_name" => $lawyer?->first_name,
                "last_name" => $lawyer?->last_name,
                "email" => $lawyer?->email,
                "image" => $lawyer?->image,
                "phone_number" => $lawyer?->phone_number,
                "country" => $lawyer?->country?->name,
                "state" => $lawyer?->state?->name,
                "address" => $lawyer?->address,
                "zip_code" => $lawyer?->zip_code,
                // "short_bio" => base64_decode($lawyer?->short_bio) ?? null,
                "area_of_expertise" => $lawyer?->lawyer_expertise->map(function ($area_expertise) {
                    $expertise = AreaExpertise::find($area_expertise->area_expertise_id);
                    return [
                        "id" => $expertise->id,
                        "name" => $expertise->name,
                    ];
                }),
                "ratings" => $lawyer?->lawyer_ratings->avg('rating'),
                "reviews" => $lawyer?->lawyer_ratings?->map(function ($review) {
                    $review = LawyerRating::with('client')->where('client_id', $review?->client?->id)->first();

                    return [
                        "id" => $review?->id,
                        "rating" => $review?->rating,
                        "client_name" => $review?->client?->first_name . ' ' . $review?->client?->last_name,
                        "client_image" => $review?->client?->image,
                        "feedback" => $review?->feedback,
                        "created_at" => $review?->created_at,
                    ];
                }),
            ];

            return response()->json(["res" => "success", "message" => "Lawyer Data", "data" => $lawyer]);
        } else {
            return response()->json(["res" => "error", "message" => "Lawyer Data Not Found!"]);
        }
    }
    public function appointment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "lawyer_id" => 'required',
            "client_id" => 'required',
            "date" => 'required',
            "start_time" => 'required',
            "end_time" => 'required',
            "title" => "required"
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $appointment = Appointment::create([
                "user_id" => $request->client_id,
                "lawyer_id" => $request->lawyer_id,
                "title" => $request->title,
                "description" => $request->description,
                "appointment_date" => $request->date,
                "appointment_start_time" => $request->start_time,
                "appointment_end_time" => $request->end_time,
                "status" => 0,
            ]);
            Chat::create([
                "appointment_id" => $appointment->id,
                "sender_id" => $request->client_id,
                "recevier_id" => $request->lawyer_id
            ]);
            if (!empty($appointment)) {

                return response()->json([
                    "res" => "success",
                    "message" => "Appointment Create Successfully!",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Can Not Create Appointment!",
                ]);
            }
        }
    }

    public function featured_lawyers()
    {
        $featuredLawyers = User::where('role_id', 3)
            ->whereHas('lawyer_ratings', function ($query) {
                $query->select('lawyer_id')
                    ->groupBy('lawyer_id')
                    ->havingRaw('AVG(rating) >= 4')
                    ->havingRaw('COUNT(*) >= 5');
            })->get();

        if ($featuredLawyers->count() > 0) {

            $featuredLawyers->take(6);

            $data = array();

            foreach ($featuredLawyers as $lawyer) {

                $area_of_expertise = array();

                if ($lawyer->lawyer_expertise) {
                    foreach ($lawyer->lawyer_expertise as $area_expertise) {
                        $expertise = AreaExpertise::find($area_expertise->area_expertise_id);
                        if ($expertise) {
                            $area_of_expertise[] = [
                                "id" => $expertise->id,
                                "name" => $expertise->name,
                            ];
                        }
                    }
                }

                $lawyer = [
                    "id" => $lawyer->id,
                    "first_name" => $lawyer->first_name,
                    "last_name" => $lawyer->last_name,
                    "email" => $lawyer->email,
                    "image" => $lawyer?->image,
                    "phone_number" => $lawyer->phone_number,
                    "address" => $lawyer->address,
                    // "short_bio" => base64_decode($lawyer->short_bio),
                    "country" => $lawyer?->country?->name,
                    "country_id" => $lawyer?->country_id,
                    "state" => $lawyer?->state?->name,
                    "state_id" => $lawyer?->state_id,
                    "city" => $lawyer->city,
                    "zip_code" => $lawyer->zip_code,
                    "terms_of_service" => $lawyer->terms_of_service,
                    "bar_membership_number" => $lawyer->bar_membership_numer,
                    "jurisdictions" => $lawyer?->jurisdictions,
                    "role" => $lawyer?->role?->name,
                    "dob" => $lawyer->dob,
                    "area_of_expertise" => $area_of_expertise,
                    "ratings" => $lawyer?->lawyer_ratings?->avg('rating'),
                    "reviews" => $lawyer->lawyer_ratings,
                ];

                $data[] = $lawyer;
            }

            return response()->json([
                "res" => "success",
                "message" => "Featured Lawyers Found Successfully!",
                "data" => $data,
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Featured Lawyers Not Found!",
            ]);
        }
    }

    public function find_lawyer(Request $request)
    {
        try {

            $lawyers = User::with(['lawyer_expertise', 'lawyer_ratings'])
                ->where(['status' => "1", 'role_id' => 3])
                ->select('users.*')
                ->leftJoinSub(
                    function ($query) {
                        $query->select('lawyer_id', DB::raw('AVG(rating) as avg_rating'))
                            ->from('lawyer_ratings')
                            ->groupBy('lawyer_id');
                    },
                    'avg_ratings',
                    'users.id',
                    '=',
                    'avg_ratings.lawyer_id'
                )
                ->leftJoinSub(
                    function ($query) {
                        $query->select('lawyer_id', DB::raw('COUNT(id) as total_ratings'))
                            ->from('lawyer_ratings')
                            ->groupBy('lawyer_id');
                    },
                    'total_ratings',
                    'users.id',
                    '=',
                    'total_ratings.lawyer_id'
                )
                ->orderBy('avg_ratings.avg_rating')
                ->orderBy('total_ratings.total_ratings');

            $countLawyer = $lawyers->count();

            if (isset($request->area_expertise_id) and !empty($request->area_expertise_id)) {
                $area_expertise = $request->area_expertise_id;
                $lawyers = $lawyers->whereHas('lawyer_expertise', function ($query) use ($area_expertise) {
                    $query->where('area_expertise_id', $area_expertise);
                });
            } else if (isset($request->jurisdiction_id) and !empty($request->jurisdiction_id)) {
                $lawyers = $lawyers->whereHas('jurisdictions', function ($query) use ($request) {
                    $query->whereIn('jurisdiction_id', $request->jurisdiction_id);
                });
            }

            if (isset($request->area_expertise_id) && isset($request->jurisdiction_id)) {
                $area_expertise = $request->area_expertise_id;
                $lawyers = $lawyers->whereHas('lawyer_expertise', function ($query) use ($area_expertise) {
                    $query->where('area_expertise_id', $area_expertise);
                })->whereHas('jurisdictions', function ($query) use ($request) {
                    $query->where('jurisdiction_id', $request->jurisdiction_id);
                });
            }

            if (isset($request->rating) && $request->rating == 'top') {
                $lawyers = $lawyers->whereHas('lawyer_ratings', function ($query) {
                    $query->select('lawyer_id', DB::raw('AVG(rating) as avg_rating'), DB::raw('COUNT(*) as total_ratings'))
                        ->groupBy('lawyer_id')
                        ->havingRaw('AVG(rating) >= 4')
                        ->havingRaw('COUNT(*) >= 5');
                });
            }


            if (!isset($request->area_expertise_id) && !isset($request->jurisdiction_id)) {
                $pageSkip = $request->page;

                $lawyers = $lawyers->skip($pageSkip)->take(20)->get();
            } else {

                $lawyers = $lawyers->limit(10)->get();
            }

            if ($lawyers->count() > 0) {

                $lawyers = LawyerResource::collection($lawyers);

                return response()->json([
                    "res" => "success",
                    "message" => "Lawyers Found!",
                    'countLawyer' => intval($countLawyer / 20),
                    "data" => $lawyers,
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Lawyers Not Found!",
                ]);
            }
            //code...
        } catch (\Throwable $th) {
            return response()->json(["res" => "error", "message" => "Something wrong in the database", "error" => $th->getMessage(), "data" => []]);
        }
    }


    public function website_details()
    {
        $webDetails = WebsiteSetting::find(1);

        $webDetails = new WebsiteSettingsResource($webDetails);

        if (!empty($webDetails)) {
            return response()->json([
                "res" => "success",
                "message" => "Website found successfully",
                "data" => $webDetails
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Data not found",
            ]);
        }
    }




    // For development purpose only
    public function add_balance(Request $request, $id)
    {

        $user = User::find($id);

        $user->balance = $request->balance;
        $user->iban = $request->iban;
        $isUpdated = $user->save();


        if ($isUpdated) {
            return response()->json(['status' => 'success', 'message' => 'Kam 25 hai'], 200);
        } else {
            return response()->json(['status' => 'lul', 'message' => 'war gae!!!'], 500);
        }
    }

    public function create_transaction(Request $request, $id)
    {
        $isCreated = TransactionsHistory::create([
            "user_id" => $id,
            "amount" => $request->amount,
            "reason" => $request->reason,
            "type" => $request->type,
        ]);

        if ($isCreated) {
            return response()->json(['status' => 'success', 'message' => 'Kam 25 hai'], 200);
        } else {
            return response()->json(['status' => 'lul', 'message' => 'war gae!!!'], 500);
        }
    }

    public function get_user(Request $request)
    {
        $user = User::where('id', $request->id)->first();

        if (!empty($user)) {

            // options
            $reviews = true;
            $withdrawRequests = true;
            $cases = true;
            $contracts = true;
            $transactionsHistory = true;
            $appointments = true;

            // resource
            $user = new LawyerResource($user, $reviews, $withdrawRequests, $cases, $contracts, $transactionsHistory, $appointments);

            return response()->json(['status' => 'success', 'message' => 'Kam 25 hai', "data" => $user], 200);
        } else {
            return response()->json(['status' => 'lul', 'message' => 'war gae!!!'], 500);
        }
    }
}
