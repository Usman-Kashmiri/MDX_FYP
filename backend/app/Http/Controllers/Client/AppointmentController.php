<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\LawyersAvailability;
use App\Models\Notification;
use App\Models\User;
use App\Models\UserTimeSlots;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Pusher\Pusher;

class AppointmentController extends Controller
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

        $validator = Validator::make($request->all(), [
            "status" => "sometimes|in:all,0,1,2,3",
        ]);

        if ($validator->fails()) {
            return self::failureResponse($validator->errors()->first(), 400);
        }

        try {
            $user = auth()->user();
            $date = $request->date;
            $status = $request->status;

            $query = Appointment::with('lawyer');

            if ($user->role_id == 3) {
                $query = $query->where("lawyer_id", $user->id);
            } else {
                $query = $query->where("user_id", $user->id);
            }

            if ($status != "all" && $status != 3) {
                $query = $query->where("status", $status);
            }

            if ($status == 3) {
                $query = $query->where(function ($query) {
                    $today = Carbon::today()->toDateString();
                    $nowTime = Carbon::now()->format('H:i:s');

                    $query->whereRaw("appointment_date < ?", [$today])
                        ->orWhere(function ($query) use ($today, $nowTime) {
                            $query->where('appointment_date', '=', $today)
                                ->whereRaw("appointment_end_time < ?", [$nowTime]);
                        });
                });
            }

            if ($date !== null && $date !== "") {
                $validator = Validator::make([$request->all()], [
                    "date" => "sometimes|date_format:Y-m-d",
                ]);

                if ($validator->fails()) {
                    return self::failureResponse($validator->errors()->first(), 400);
                }

                $query = $query->where("appointment_date", $date);
            }

            $appointments = $query->orderBy('appointment_date', 'DESC')->paginate($perPage, ['*'], 'page', $page);

            if ($appointments->count() > 0) {

                $appointments = AppointmentResource::collection($appointments);

                $totalPages = $appointments->lastPage();
                $totalRecords = $appointments->total();

                return response()->json([
                    "res" => "success",
                    "message" => "Appointments list",
                    "total_pages" => $totalPages,
                    "total_records" => $totalRecords,
                    "data" => $appointments,
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Appointments not found",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

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
            $client = auth()->user();
            $validator = Validator::make(
                $request->all(),
                [
                    "client_id" => 'required',
                    "lawyer_id" => 'required',
                    "title" => 'required',
                    "description" => 'required',
                    "appointment_date" => 'required|date|after_or_equal:today',
                    "appointment_start_time" => 'required|date_format:H:i:s',
                    "appointment_end_time" => 'required|date_format:H:i:s|after:appointment_start_time',
                ],
                [
                    'appointment_date.after_or_equal' => 'Appointment date should be today or in the future.',
                ]
            );

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            $appointment = Appointment::create([
                "user_id" => $request->client_id,
                "lawyer_id" => $request->lawyer_id,
                "title" => $request->title,
                "description" => $request->description,
                "appointment_date" => $request->appointment_date,
                "appointment_start_time" => $request->appointment_start_time,
                "appointment_end_time" => $request->appointment_end_time,
                "status" => 0,
            ]);

            $lawyer = User::where('id', $request->lawyer_id)->first();
            Notification::create([
                "user_id" => $lawyer->id,
                "title" => $client->first_name . ' ' . $client->last_name . ' created  an appointment ',
                "description" => $request->description,
                "url" => "/lawyer/appointments#" . $appointment->id,
            ]);

            $lawyerPusherData = [
                [
                    'sender_image' => $client->image,
                    'attach_type' => '',
                    'message_type' => 'appointment_request',
                    'sender_name' => $client->first_name . ' ' . $client->last_name,
                    'sender_email' => $client->email,
                    'sender_id' => $client->id,
                    'message' => $client->first_name . ' ' . $client->last_name . ' created  an appointment ',
                ]
            ];
            $pusher->trigger('all-message-channel.' . $lawyer->id, 'all-message-event.' . $lawyer->id, ['data' => $lawyerPusherData]);

            return response()->json([
                "res" => "success",
                "message" => "Appointment Requested Successfully"
            ]);


        } catch (\Throwable $th) {
            return response()->json([
                "res" => "error",
                "message" => $th->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function fetch_time_slots(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                "lawyer_id" => 'required',
                "appointment_date" => 'required|date|after_or_equal:today',
            ],
            [
                'appointment_date.after_or_equal' => 'Appointment date should be today or in the future.',
            ]
        );

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        $appointmentDate = Carbon::parse($request->appointment_date);

        $availability = LawyersAvailability::with('appointments')
            ->where('user_id', $request->lawyer_id)
            ->where('day', $appointmentDate->format('D'))
            ->first();

        if (!$availability) {
            return response()->json([
                "res" => "error",
                "message" => "Lawyer's availability not found for the specified date",
            ]);
        }

        $appointments = $availability->appointments->pluck('appointment_start_time')->toArray();

        $timeSlots = [];
        $startTime = Carbon::createFromTimeString($availability->start_time);
        $endTime = Carbon::createFromTimeString($availability->end_time);

        while ($startTime < $endTime) {
            $start_time = $startTime->format('H:i:s');
            $startTime->addHour();
            $end_time = $startTime->format('H:i:s');

            if (!in_array($start_time, $appointments) && $startTime <= $endTime) {
                $timeSlots[] = [
                    'start_time' => $start_time,
                    'end_time' => $end_time
                ];
            }
        }

        return response()->json([
            "res" => "success",
            "message" => "Time Slots Found",
            "data" => $timeSlots,
        ]);
    }
}
