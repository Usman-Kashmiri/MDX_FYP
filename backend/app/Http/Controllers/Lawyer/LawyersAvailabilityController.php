<?php

namespace App\Http\Controllers\Lawyer;

use App\Http\Controllers\Controller;
use App\Models\LawyersAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LawyersAvailabilityController extends Controller
{
    public function index($id)
    {
        try {
            if (auth()->user()->role->name === "Lawyer") {
                $id = auth()->user()->id;
            }

            $lawyersAvailability = LawyersAvailability::where('user_id', $id)->get();

            return response()->json(["res" => "success", "message" => "Lawyer's Availability Found", "data" => $lawyersAvailability]);
        } catch (\Throwable $th) {
            return response()->json(["res" => "error", "message" => $th->getMessage()]);
        }
    }

    public function store(Request $request)
    {
        try {

            // Validate the input and create a new lawyers availability record
            $validator = Validator::make($request->all(), [
                '*.day' => 'required',
                '*.start_time' => 'required|date_format:H:i:s',
                '*.end_time' => 'required|date_format:H:i:s|after:start_time',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            } else {
                $id = auth()->user()->id;
                $availabilities = [];
                $deleteOldRecords = LawyersAvailability::where('user_id', $id)->delete();

                foreach ($request->all() as $req) {
                    $availability = LawyersAvailability::create([
                        "user_id" => $id,
                        "day" => $req['day'],
                        "start_time" => $req['start_time'],
                        "end_time" => $req['end_time'],
                    ]);
                    $availabilities[] = $availability;
                }


                return response()->json(['res' => 'success', 'message' => 'Lawyer availability added successfully', 'data' => $availabilities]);
            }
            //code...
        } catch (\Throwable $th) {
            return response()->json(['res' => 'error', 'message' => $th->getMessage()]);
        }
    }

    public function show($id)
    {
        // Fetch a specific lawyers availability record and return as JSON response
        $lawyersAvailability = LawyersAvailability::find($id);
        if (!empty($lawyersAvailability)) {
            return response()->json([
                'res' => 'success',
                'message' => 'Lawyer Availability Found',
                'data' => $lawyersAvailability,
            ]);
        } else {
            return response()->json(["res" => "error", "message" => "Lawyer Availability Not Found!"]);
        }
    }

    public function update(Request $request, $id)
    {
        // Validate the input and create a new lawyers availability record
        $validator = Validator::make($request->all(), [
            'day' => 'required',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s|after:start_time',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $availability = LawyersAvailability::where('id', $id)->update([
                "day" => $request->day,
                "start_time" => $request->start_time,
                "end_time" => $request->end_time,
            ]);

            if (!empty($availability)) {
                // Return success response as JSON
                return response()->json(['res' => 'success', 'message' => 'Lawyer availability updated successfully']);
            } else {
                return response()->json(['res' => 'error', 'message' => 'Can not update Lawyer availability']);
            }
        }
    }
    public function destroy($id)
    {
        // Delete a specific lawyers availability record
        $lawyersAvailability = LawyersAvailability::find($id);
        if (!empty($lawyersAvailability)) {
            $lawyersAvailability->delete();
            return response()->json(["res" => "success", "message" => "Lawyer Availability Deleted Successfully!"]);
        } else {
            return response()->json(["res" => "error", "message" => "Can not Delete Lawyer Availability!"]);
        }
    }
}
