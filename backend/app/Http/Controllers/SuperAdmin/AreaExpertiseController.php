<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AreaExpertise;
use App\Models\AreaExpertiseOfUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AreaExpertiseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $area_expertises = AreaExpertise::orderBy("created_at", "DESC")->get();
        if (!empty($area_expertises)) {
            return response()->json(["res" => "success", "message" => "Areas Of Expertise Data List", "data" => $area_expertises]);
        } else {
            return response()->json(["res" => "error", "message" => "Areas Of Expertise Data Not Found!"]);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => 'required|min:2',
            "status" => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $area_expertise = AreaExpertise::create([
                "name" => $request->name,
                "status" => $request->status
            ]);
            if (!empty($area_expertise)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Area Of Expertise Added Successfully!",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Can Not Add Area Of Expertise!",
                ]);
            }
        }
    }
    public function show(string $id)
    {
        $area_expertise = AreaExpertise::find($id);

        if (!empty($area_expertise)) {
            return response()->json([
                "res" => "success",
                "message" => "Area Of Expertise Found!",
                "detail" => $area_expertise
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Area Of Expertise Not Found!",
            ]);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            "name" => 'required|min:2',
            "status" => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $area_expertise = AreaExpertise::where('id', $id)->update([
                "name" => $request->name,
                "status" => $request->status
            ]);
            if (!empty($area_expertise)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Area Of Expertise Updated Successfully!",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Can Not Update Area Of Expertise!",
                ]);
            }
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            AreaExpertiseOfUsers::where('area_expertise_id', $id)->delete();
            AreaExpertise::destroy($id);
            return response()->json([
                "res" => "success",
                "message" => "Area Of Expertise Deleted Successfully!",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "res" => "error",
                "message" => "There is an error while destroing the data",
                "error" => $e->getMessage()
            ]);
        }
    }
}
