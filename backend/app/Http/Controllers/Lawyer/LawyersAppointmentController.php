<?php

namespace App\Http\Controllers\Lawyer;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\UserTimeSlots;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Pusher\Pusher;

class LawyersAppointmentController extends Controller
{
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
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
            $validator = Validator::make(
                $request->all(),
                [
                    "appointment_id" => 'required',
                    "status" => 'required',
                ],
            );

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            $appointment = Appointment::with(['client', 'lawyer'])->where('id', $request->appointment_id)->first();
            // $id = auth()->user()->id;

            if (!empty($appointment)) {
                // $timeSlot = UserTimeSlots::where('user_id', $id)
                //     ->where('slot_date', $appointment->appointment_date)
                //     ->where("start_time", $appointment->appointment_start_time)
                //     ->where("end_time", $appointment->appointment_end_time)
                //     ->update([
                //         "status" => $request->status,
                //     ]);

                // if ($timeSlot > 0) {
                $updateAppointment = $appointment->update([
                    "status" => $request->status,
                ]);
                $messageForNoti = [
                    1 => "approved your appointment",
                    2 => "rejected your appointment",
                    3 => "add appointment for past"
                ];

                if ($request->status != 0) {

                    Notification::create([
                        "user_id" => $appointment->client->id,
                        "title" => $appointment->client->first_name . ' ' . $appointment->client->last_name . $messageForNoti[$request->status],
                        "description" => $appointment->description,
                        "url" => "/client/appointments#" . $appointment->id,
                    ]);

                    $lawyerPusherData = [
                        [
                            'sender_image' => $appointment->client->image,
                            'attach_type' => '',
                            'message_type' => 'appointment_request',
                            'sender_name' => $appointment->client->first_name . ' ' . $appointment->client->last_name,
                            'sender_email' => $appointment->client->email,
                            'sender_id' => $appointment->client->id,
                            'message' => $appointment->client->first_name . ' ' . $appointment->client->last_name . $messageForNoti[$request->status],
                        ]
                    ];
                    $pusher->trigger('all-message-channel.' . $appointment->client->id, 'all-message-event.' . $appointment->client->id, ['data' => $lawyerPusherData]);

                }
                if ($updateAppointment) {
                    return response()->json([
                        "res" => "success",
                        "message" => "Appointment Status Updated Successfully",
                    ]);
                }
                // }
            }

            return response()->json([
                "res" => "error",
                "message" => "Cannot Update Appointment Status",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
