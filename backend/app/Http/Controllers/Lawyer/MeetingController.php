<?php

namespace App\Http\Controllers\lawyer;

use App\Http\Controllers\Controller;
use App\Models\Meeting;

class MeetingController extends Controller
{

    public function check_meeting($id)
    {
        try {
            $user = auth()->user();
            $user_id = $user->id;

            $meeting = Meeting::with(['sender_detail', 'recevier_detail'])
                ->where(function ($query) use ($user_id, $id) {
                    $query->where('meeting_id', $id)
                        ->where('recevier_id', $user_id);
                })
                ->orWhere(function ($query) use ($user_id, $id) {
                    $query->where('meeting_id', $id)
                        ->where('sender_id', $user_id);
                })
                ->first();


            if (empty($meeting)) {
                return response()->json(['res' => 'warning', 'type' => 'unauthorized', 'message' => 'Meeting not found']);
            }

            $timestamp = $meeting->created_at;
            $currentTimestamp = now();

            // Parse the timestamp into a Carbon instance
            $carbonTimestamp = \Carbon\Carbon::parse($timestamp);

            // Add one hour to the timestamp
            $timestampOneHourLater = $carbonTimestamp->addHour();

            if ($currentTimestamp >= $timestampOneHourLater) {
                $data = [
                    'room_name' => $meeting->room_name,
                    'meeting_id' => $meeting->meeting_id,
                    'meeting_type' => $meeting->meeting_type,
                    'expire_time' => $timestampOneHourLater,
                    'start_time' => $meeting->created_at,
                    'sender_id' => $meeting->sender_id,
                ];
                $meeting::update([
                    'meeting_status' => 'end',
                ]);
                return response()->json(['res' => 'warning', 'type' => 'expired', 'message' => 'Meeting Expired', 'data' => $data]);
            }

            $participent = [];

            if ($user->id != $meeting->sender_id) {
                $participent_detail = $meeting->sender_detail;
            } else {
                $participent_detail = $meeting->recevier_detail;
            }

            $participent = [
                'id' => $participent_detail->id,
                'first_name' => $participent_detail->first_name,
                'last_name' => $participent_detail->last_name,
                'email' => $participent_detail->email,
                'image' => $participent_detail->image,
                'role_id' => $participent_detail->role_id
            ];

            $data = [
                'id' => $meeting->id,
                'room_name' => $meeting->room_name,
                'meeting_id' => $meeting->meeting_id,
                'meeting_type' => $meeting->meeting_type,
                'expire_time' => $timestampOneHourLater,
                'start_time' => $meeting->created_at,
                'perticipent' => $participent,
                'sender_id' => $meeting->sender_id,
            ];

            return response()->json(['res' => 'success', 'type' => 'success', 'message' => 'Joining...', 'data' => $data]);
        } catch (\Exception $e) {
            return response()->json(['res' => 'error', 'type' => 'error', 'message' => 'Something error while retrieving the data', "error" => $e->getMessage()]);
        }
    }


    public function endMeeting($id)
    {
        try {
            $user = auth()->user();
            $user_id = $user->id;

            $meeting = Meeting::where('sender_id', $user_id)->where('meeting_id', $id)->first();
            if (!empty($meeting)) {
                $meeting->update([
                    'meeting_status' => 'end',
                ]);
                return response()->json(['res' => 'success', 'type' => 'success', 'message' => 'Ended...']);
            } else {
                return response()->json(['res' => 'warning', 'type' => 'warning', 'message' => 'Access denied to end meeting']);
            }

        } catch (\Throwable $th) {
            return response()->json(['res' => 'error', 'type' => 'error', 'message' => 'Something error while retrieving the data', "error" => $th->getMessage()]);
        }
    }
}
