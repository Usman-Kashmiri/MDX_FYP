<?php

namespace App\Http\Controllers\Lawyer;

use App\Http\Controllers\Controller;
use App\Models\LawyersAvailability;
use App\Models\UserTimeSlots;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TimeSlotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        // Current date
        $currentDate = Carbon::now()->format('Y-m-d');

        $updatetimeslot = UserTimeSlots::where('user_id', $user->id)->where('slot_date', '<', Carbon::now()->format('Y-m-d'))->update([
            'status' => 0
        ]);

        // Fetch time slots for the current day
        $timeSlotsCurrentDay = UserTimeSlots::where('user_id', $user->id)
            ->where('slot_date', $currentDate)
            ->get();


        // Fetch time slots for the complete ongoing month
        $startDateOfMonth = Carbon::now()->startOfMonth()->format('Y-m-d');
        $endDateOfMonth = Carbon::now()->endOfMonth()->format('Y-m-d');

        $timeSlotsMonth = UserTimeSlots::where('user_id', $user->id)
            ->whereBetween('slot_date', [$startDateOfMonth, $endDateOfMonth])
            ->get();

        if (count($timeSlotsCurrentDay) > 0 || count($timeSlotsMonth) > 0) {

            return response()->json([
                "res" => "success",
                "message" => "Time Slot Data List",
                "data" => [
                    "current_day" => $timeSlotsCurrentDay,
                    "current_month" => $timeSlotsMonth,
                ],
            ]);
        } else {
            return response()->json(["res" => "error", "message" => "Time Slots Not Found!"]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'slot_type' => 'required',
            "status" => "required"
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $timeslot = null;
            $user = auth()->user();
            if ($request->slot_type == "month") {
                $dates = $request->input("dates");
                for ($i = 0; $i < sizeof($dates); $i++) {
                    $date = $dates[$i];
                    $timeslot = UserTimeSlots::create([
                        "status" => $request->status,
                        "slot_date" => $date,
                        "start_time" => $request->start_time,
                        "end_time" => $request->end_time,
                        "user_id" => $user->id,
                    ]);
                }
                if (!empty($timeslot)) {
                    return response()->json([
                        "res" => "success",
                        "message" => "Time Slot Added Successfully!",
                    ]);
                } else {
                    return response()->json([
                        "res" => "error",
                        "message" => "Can Not Add Time Slot!",
                    ]);
                }
            } elseif ($request->slot_type == "date") {
                $times = $request->input("times");
                for ($i = 0; $i < sizeof($times); $i++) {
                    $time = $times[$i];
                    $start_time = "0" . ($time - 1) . ":00:00";
                    $end_time = "0$time:00:00";
                    $timeslot = UserTimeSlots::create([
                        "status" => $request->status,
                        "slot_date" => $request->date,
                        "start_time" => $start_time,
                        "end_time" => $end_time,
                        "user_id" => $user->id,
                    ]);
                }
                if (!empty($timeslot)) {
                    return response()->json([
                        "res" => "success",
                        "message" => "Time Slot Added Successfully!",
                    ]);
                } else {
                    return response()->json([
                        "res" => "error",
                        "message" => "Can Not Add Time Slot!",
                    ]);
                }
            }
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        UserTimeSlots::destroy($id);
        return response()->json([
            "res" => "success",
            "message" => "Time Slot Deleted Successfully!",
        ]);
    }

    public function generateTimeSlots()
    {
        $id = auth()->user()->id;
        $lawyersAvailability = LawyersAvailability::where('user_id', $id)->get();

        if ($lawyersAvailability->isEmpty()) {
            return response()->json([
                "res" => "error",
                "message" => "Please set working hours and working days before generating time slots!",
            ]);
        }

        // Current date
        $currentDate = Carbon::now();
        $startDate = $currentDate->copy()->startOfMonth();
        $endDate = $currentDate->copy()->endOfMonth();

        $workingDays = [];
        $startTime = [];
        $endTime = [];
        $timeSlotDuration = 60; // 1 hour in minutes

        foreach ($lawyersAvailability as $availability) {
            $workingDays[] = $availability->day;
            $startTime[] = $availability->start_time;
            $endTime[] = $availability->end_time;
        }

        while ($currentDate->lte($endDate)) {
            // Check if the day is a working day (Monday to Friday)
            if (in_array($currentDate->format('D'), $workingDays)) {
                // Generate time slots for the working day
                $currentStartTime = Carbon::createFromFormat('H:i:s', $startTime[array_search($currentDate->format('D'), $workingDays)]);
                $currentEndTime = Carbon::createFromFormat('H:i:s', $endTime[array_search($currentDate->format('D'), $workingDays)]);

                $currentTime = $currentStartTime->copy();
                while ($currentTime->lte($currentEndTime)) {
                    $slotDate = $currentDate->format('Y-m-d');
                    $generatedStartTime = $currentTime->format('H:i:s'); // Use a different variable here
                    $generatedEndTime = $currentTime->addMinutes($timeSlotDuration)->format('H:i:s'); // Use a different variable here

                    // Check if a record with the same slot_date, start_time, and end_time exists
                    $existingSlot = UserTimeSlots::where([
                        'slot_date' => $slotDate,
                        'start_time' => $generatedStartTime,
                        'end_time' => $generatedEndTime,
                        'user_id' => auth()->user()->id,
                    ])->first();

                    if (!$existingSlot) {
                        // Create or update the record
                        UserTimeSlots::create([
                            'slot_date' => $slotDate,
                            'start_time' => $generatedStartTime,
                            'end_time' => $generatedEndTime,
                            'user_id' => auth()->user()->id,
                        ]);
                    }

                    $currentTime->addMinutes($timeSlotDuration); // Move to the next time slot
                }
            }

            // Move to the next day
            $currentDate->addDay();
        }

        // Return the generated time slots
        return response()->json([
            "res" => "success",
            "message" => "Time Slots Generated Successfully!"
        ]);
    }
}
