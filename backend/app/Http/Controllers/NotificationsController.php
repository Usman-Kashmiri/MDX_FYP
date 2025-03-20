<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationsController extends Controller
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
            $user = auth()->user();
            $status = $request->status;

            $query = Notification::where("user_id", $user->id);

            if ($status === "unread") {
                $query->where("read", 0);
            } elseif ($status === "latest") {
                $query->orderBy("created_at", "desc");
            } elseif ($status === "oldest") {
                $query->orderBy("created_at", "asc");
            }

            $notifications = $query->paginate($perPage, ['*'], 'page', $page);

            if ($notifications->isNotEmpty()) {
                return self::successResponse("Notifications retrieved successfully!", $notifications);
            }

            return self::failureResponse("Notifications not found!", 404);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $notification = Notification::find($id);

            if (!$notification) {
                return self::failureResponse("Notification not found!");
            }

            $notification->delete();


            return self::successResponse("Notification deleted successfully!");

        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }
    public function mark_as_read($id)
    {
        try {
            $notification = Notification::find($id);

            if (!$notification) {
                return self::failureResponse("Notification not found!");
            }

            $notification->read = 1;
            $notification->save();

            return self::successResponse("Notification read successfully!");

        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }
    public function unread_notification_count()
    {
        try {
            $user = auth()->user();
            $notificationCout = Notification::where('read', 0)->where('user_id', $user->id)->count();


            return self::successResponse("Notification read successfully!", $notificationCout);

        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }
}
