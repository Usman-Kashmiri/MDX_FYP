<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LawyerResource;
use App\Http\Resources\WithdrawRequestResource;
use App\Models\AreaExpertise;
use App\Models\Cases;
use App\Models\Countries;
use App\Models\LawyersCase;
use App\Models\User;
use App\Models\WebsiteSetting;
use App\Models\WithdrawRequest;
use App\Notifications\VerifyEmailNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Stripe\Stripe;
use Stripe\Payout;
use Stripe\StripeClient;

class DashboardController extends Controller
{
    public function index()
    {
        // Current date
        $currentDate = Carbon::now();

        // Get the start and end dates of the ongoing week
        $startOfWeek = $currentDate->copy()->startOfWeek();
        $endOfWeek = $currentDate->copy()->endOfWeek();

        // Get the start and end dates of the ongoing month
        $startOfMonth = $currentDate->copy()->startOfMonth();
        $endOfMonth = $currentDate->copy()->endOfMonth();

        // Get the start and end dates of the ongoing year
        $startOfYear = $currentDate->copy()->startOfYear();
        $endOfYear = $currentDate->copy()->endOfYear();

        // Users count:
        $users = User::with('lawyer_expertise', 'lawyer_ratings')->get();

        // Admin / Moderators count:
        $admins = $users->where('role_id', 2)->count();

        // Lawyers count:
        $totalLawyers = $users->where('role_id', 3)->count();
        $lawyers = $users->whereBetween('created_at', [$startOfMonth, $endOfMonth])->where('role_id', 3);
        $newLawyers = [];

        if ($lawyers->count() > 0) {

            foreach ($lawyers as $lawyer) {

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

                $newLawyers[] = $lawyer;
            }
        }

        // Weekly
        $newLawyersThisWeek = $users->where('role_id', 3)->whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
        // Monthly
        $newLawyersThisMonth = $users->where('role_id', 3)->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        // Yearly
        $newLawyersThisYear = $users->where('role_id', 3)->whereBetween('created_at', [$startOfYear, $endOfYear])->count();

        // Clients count:
        $totalClients = $users->where('role_id', 4)->count();
        $clients = $users->whereBetween('created_at', [$startOfMonth, $endOfMonth])->where('role_id', 4);
        $newClients = [];

        if ($clients->count() > 0) {

            foreach ($clients as $client) {

                $client = [
                    "id" => $client->id,
                    "first_name" => $client->first_name,
                    "last_name" => $client->last_name,
                    "email" => $client->email,
                    "image" => $client?->image,
                    "phone_number" => $client->phone_number,
                    "address" => $client->address,
                    "country" => $client?->country?->name,
                    "country_id" => $client?->country_id,
                    "state" => $client?->state?->name,
                    "state_id" => $client?->state_id,
                    "city" => $client->city,
                    "zip_code" => $client->zip_code,
                    "terms_of_service" => $client->terms_of_service,
                    "role" => $client?->role?->name,
                ];

                $newClients[] = $client;
            }
        }

        // Weekly
        $newClientsThisWeek = $users->where('role_id', 4)->whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();
        // Monthly
        $newClientsThisMonth = $users->where('role_id', 4)->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        // Yearly
        $newClientsThisYear = $users->where('role_id', 4)->whereBetween('created_at', [$startOfYear, $endOfYear])->count();

        // Cases:
        $cases = LawyersCase::all();

        // Count cases based on their status
        $totalCases = count($cases);

        $pendingCases = LawyersCase::whereHas('case', function ($query) {
            $query->where('status', 0);
        })->count();

        $approvedCases = LawyersCase::whereHas('case', function ($query) {
            $query->where('status', 1);
        })->count();

        $rejectedCases = LawyersCase::whereHas('case', function ($query) {
            $query->where('status', 2);
        })->count();

        $completedCases = LawyersCase::whereHas('case', function ($query) {
            $query->where('status', 3);
        })->count();

        $cancelledCases = LawyersCase::whereHas('case', function ($query) {
            $query->where('status', 4);
        })->count();


        // Weekly
        $newCasesThisWeek = $cases->whereBetween('created_at', [$startOfWeek, $endOfWeek])->count();

        // Monthly
        $newCasesThisMonth = $cases->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();

        // Yearly
        $newCasesThisYear = $cases->whereBetween('created_at', [$startOfYear, $endOfYear])->count();

        return response()->json([
            "res" => "success",
            "message" => "Reports!",
            "data" => [
                "total_admins" => $admins,
                "lawyers" => [
                    "total_lawyers" => $totalLawyers,
                    "new_lawyers_this_week" => $newLawyersThisWeek,
                    "new_lawyers_this_month" => $newLawyersThisMonth,
                    "new_lawyers_this_year" => $newLawyersThisYear,
                    "new_lawyers" => $newLawyers
                ],
                "clients" => [
                    "total_clients" => $totalClients,
                    "new_clients_this_week" => $newClientsThisWeek,
                    "new_clients_this_month" => $newClientsThisMonth,
                    "new_clients_this_year" => $newClientsThisYear,
                    "new_clients" => $newClients
                ],
                "cases" => [
                    "total_cases" => $totalCases,
                    "pending_cases" => $pendingCases,
                    "approved_cases" => $approvedCases,
                    "rejected_cases" => $rejectedCases,
                    "completed_cases" => $completedCases,
                    "cancelled_cases" => $cancelledCases,
                    "new_cases_this_week" => $newCasesThisWeek,
                    "new_cases_this_month" => $newCasesThisMonth,
                    "new_cases_this_year" => $newCasesThisYear,
                ],
            ]
        ]);
    }

    public function chart_data()
    {
        try {
            $startDate = now()->startOfYear(); // ? Start date of year
            $endDate = now()->endOfYear(); // ? End date of year
            $cases = Cases::whereBetween('created_at', [$startDate, $endDate])->get();

            $monthlyCases = [];

            if ($cases->isNotEmpty()) {
                for ($month = 1; $month <= 12; $month++) {
                    $casesCount = $cases->whereBetween('created_at', [
                        now()->month($month)->startOfMonth(),
                        now()->month($month)->endOfMonth()
                    ])->count();
                    $monthlyCases[] = $casesCount;
                }

                return response()->json(["res" => "success", "message" => "chart data retreived successfully!", "data" => $monthlyCases]);
            }

            return response()->json(["res" => "error", "message" => "Couldn't fetch chart data!"]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function profileimage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "image" => 'required|image|mimes:jpeg,png,gif,jpg,svg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $user = auth()->user();
            $uploadedImage = self::uploadWEBPImageOnS3($request, 'image', $user, 'admins', "public");

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

    // ! Useless for superadmin
    public function personal_info(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                "first_name" => 'required|min:2',
                "last_name" => 'required|min:2',
                "email" => 'required|email',
                "phone_number" => "required",
                "dob" => "required",
            ]);

            if ($validator->fails()) {
                return response()->json(['res' => 'error', 'message' => $validator->errors()]);
            }

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
        } catch (\Exception $e) {
            return self::exceptionResponse($e->getMessage());
        }
    }

    // ! Useless for superadmin
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
        }

        try {
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
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $admin = User::where('id', $id)->update([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
            ]);

            $user = User::where('id', $id)->first();

            $user = [
                "id" => $user->id,
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "email" => $user->email,
                "image" => $user?->image,
                "role" => $user->role->name,
            ];

            if (!empty($admin)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Profile Updated Successfully!",
                    "data" => $user,
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Unable to Update Profile!",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
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
        }

        try {
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
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function countries()
    {

        $countries = Countries::orderBy('status', 'desc')->get();

        if (count($countries) > 0) {
            return response()->json(["res" => "success", "message" => "Countries List Found!", "data" => $countries]);
        }

        return response()->json(["res" => "success", "message" => "Countries Not Found!"]);
    }

    public function update_country_status(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "status" => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        $isUpdated = Countries::where('id', $id)->update([
            "status" => $request->status,
        ]);

        if ($isUpdated) {
            return response()->json([
                "res" => "success",
                "message" => "Country's Status Successfully!",
            ]);
        }

        return response()->json([
            "res" => "error",
            "message" => "Couldn't Update Country Status!",
        ]);
    }

    public function withdraw_request_list(Request $request)
    {
        self::validatePagination($request);

        // ? pagination parameters
        $page = $request->query('page');
        $status = $request->query('status');
        $perPage = $request->query('per_page');

        try {
            $query = WithdrawRequest::query();

            if (isset($request->start_date) && isset($request->end_date)) {
                $query = WithdrawRequest::whereBetween('created_at', [$request->start_date, $request->end_date]);
            }

            if ($status && $status !== "") {
                $query = $query->where('status', $status);
            }

            $transactions = $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);

            $transactions = WithdrawRequestResource::collection($transactions);

            if (count($transactions) > 0) {

                $totalPages = $transactions->lastPage();
                $totalRecords = $transactions->total();

                return response()->json([
                    "res" => "success",
                    "message" => "Transactions History Found Successfully",
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    "data" => $transactions,
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Transactions History Not Found",
            ]);
        } catch (\Exception $exp) {
            return self::exceptionResponse($exp->getMessage());
        }
    }

    public function withdraw_request_update_status(Request $request)
    {
        try {
            $website = WebsiteSetting::find(1);
            Stripe::setApiKey($website->stripe_sk);

            if (isset($request->id) && isset($request->status)) {
                $withdrawRequest = WithdrawRequest::with(['user'])->where('id', $request->id)->first();
                $user = $withdrawRequest->user;

                if ($request->status == 'approved') {
                    if ($user->balance < $withdrawRequest->amount) {
                        return response()->json([
                            "res" => "warning",
                            "message" => "insufficient balance",
                        ]);
                    }

                    $payout = Payout::create([
                        'amount' => $withdrawRequest->amount * 100,
                        'currency' => 'usd',
                        'method' => 'standard',
                        'destination' => [
                            'iban' => $user->iban,
                        ],
                    ]);

                    if ($payout) {
                        // Deduct the balance
                        $user->balance = intval($user->balance - $withdrawRequest->amount);
                        $user->save();
                    }
                }

                $isUpdated = WithdrawRequest::where('id', $request->id)->update([
                    "status" => $request->status,
                ]);

                if ($isUpdated) {
                    $this->mail("Withdraw Request", $user->first_name . " " . $user->last_name, $user->email, "Your withdraw request for amount: $withdrawRequest->amount has been $request->status");

                    return response()->json([
                        "res" => "success",
                        "message" => "Withdraw request $request->status",
                    ]);
                }

                return response()->json([
                    "res" => "error",
                    "message" => "Failed to $request->status",
                ]);
            }
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return response()->json([
                "res" => "error",
                "message" => "Failed to payout amount",
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $ee) {
            return response()->json([
                "res" => "error",
                "message" => "An unexpected error occurred",
                'error' => $ee->getMessage()
            ]);
        }
    }

    public function user_complete_stats(Request $request, string $id)
    {
        try {

            $date = $request->date;
            $parsedDate = $date ? Carbon::createFromFormat('M Y', $date) : Carbon::now();
            $month = $parsedDate->month;
            $year = $parsedDate->year;

            $user = User::with([
                'lawyer_ratings' => $this->getQueryByDate('created_at', $month, $year),
                'withdraw_requests' => $this->getQueryByDate('created_at', $month, $year),
                'lawyers_cases' => $this->getQueryByDate('created_at', $month, $year),
                'users_cases' => $this->getQueryByDate('created_at', $month, $year),
                'contracts' => $this->getQueryByDate('created_at', $month, $year),
                'transactions_history' => $this->getQueryByDate('created_at', $month, $year),
                'lawyer_appointments' => function ($query) use ($month, $year) {
                    $query->where('status', 1)
                        ->whereMonth('created_at', $month)->whereYear('created_at', $year)
                        ->orderByDesc('created_at');
                },
            ])->where('id', $id)->first();

            if ($user) {
                // User found, proceed with processing
                // options
                $reviews = true;
                $withdrawRequests = true;
                $cases = true;
                $contracts = true;
                $transactionsHistory = true;
                $appointments = true;

                // resource
                $userResource = new LawyerResource($user, $reviews, $withdrawRequests, $cases, $contracts, $transactionsHistory, $appointments);

                return response()->json([
                    "res" => "success",
                    "message" => "User's Stats Found Successfully",
                    "data" => $userResource,
                ]);
            } else {
                // User not found, return an error response
                return response()->json([
                    "res" => "error",
                    "message" => "User not found",
                ], 404); // 404 Not Found status code
            }
            //code...
        } catch (\Throwable $th) {
            return response()->json([
                "res" => "error",
                "message" => $th->getMessage(),
                'error' => $th->getMessage(),
                'line' => $th->getLine()
            ], $th->getCode() ?: 500);
        }
    }

    private function getQueryByDate($column, $month, $year)
    {
        return function ($query) use ($column, $month, $year) {
            $query->whereMonth($column, $month)->whereYear($column, $year)->orderBy('created_at', "DESC");
        };
    }

    // Mail Function for sending mails
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
