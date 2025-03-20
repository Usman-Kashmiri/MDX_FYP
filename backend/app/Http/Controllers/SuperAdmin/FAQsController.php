<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\FAQ;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FAQsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()?->user();

        if ($user?->role?->name === "SuperAdmin" || $user?->role?->name === "Admin") {
            $FAQs = FAQ::orderBy('order')->get();
        } else {
            $FAQs = FAQ::where('is_published', 1)->orderBy('order')->get();
        }

        if (count($FAQs) > 0) {
            return response()->json([
                "res" => "success",
                "message" => "FAQs Found Successfully",
                "data" => $FAQs
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "FAQs Not Found",
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "question" => 'required',
            "answer" => 'required',
            "is_published" => 'required|boolean',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $entry = FAQ::create([
                "question" => $request->question,
                "answer" => $request->answer,
                "order" => $request->order,
                "is_published" => $request->is_published,
            ]);

            if (!empty($entry)) {
                return response()->json([
                    "res" => "success",
                    "message" => "FAQ Successfully Added",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Add FAQ",
                ]);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $FAQ = FAQ::where('id', $id)->first();

        if (!empty($FAQ)) {
            return response()->json([
                "res" => "success",
                "message" => "FAQ Found Successfully",
                "data" => $FAQ
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Find FAQ",
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            "question" => 'required',
            "answer" => 'required',
            "is_published" => 'required|boolean',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $entry = FAQ::where('id', $id)->update([
                "question" => $request->question,
                "answer" => $request->answer,
                "order" => $request->order,
                "is_published" => $request->is_published,
            ]);

            if (!empty($entry)) {
                return response()->json([
                    "res" => "success",
                    "message" => "FAQ Updated Succcessfully",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Update FAQ",
                ]);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $FAQ = FAQ::destroy($id);

        if ($FAQ) {
            return response()->json([
                "res" => "success",
                "message" => "FAQ Deleted Successfully",
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Delete FAQ",
            ]);
        }
    }

    public function update_order(Request $request)
    {
        $newOrder = $request->input('order');

        $isUpdated = 0;

        foreach ($newOrder as $orderData) {
            $FAQ = FAQ::find($orderData['id']);
            if (!empty($FAQ)) {
                $FAQ->order = $orderData['order'];
                $FAQ->save();
                $isUpdated = $isUpdated + 1;
            }
        }

        if ($isUpdated > 0) {
            return response()->json(['res' => "success", 'message' => 'FAQs order updated successfully']);
        } else {
            return response()->json(["res" => "error", 'message' => "Couldn't update FAQs order"]);
        }
    }
}
