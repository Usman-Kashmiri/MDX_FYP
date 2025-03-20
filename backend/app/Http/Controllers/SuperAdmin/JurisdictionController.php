<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\JurisdictionResource;
use App\Models\Jurisdiction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JurisdictionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (isset($request->country_id)) {
            $jurisdictions = Jurisdiction::with('country')->where('country_id', $request->country_id)->orderBy("created_at", "DESC")->get();
        } else {
            $jurisdictions = Jurisdiction::with('country')->orderBy("created_at", "DESC")->get();
        }

        if (count($jurisdictions) > 0) {
            $jurisdictions = JurisdictionResource::collection($jurisdictions);

            return response()->json(["res" => "success", "message" => "Jurisdictions Data List", "data" => $jurisdictions]);
        } else {
            return response()->json(["res" => "error", "message" => "Jurisdictions Data Not Found!"]);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => 'required|min:2',
            "country_id" => 'required',
            "status" => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $jurisdiction = Jurisdiction::create([
                "name" => $request->name,
                "status" => $request->status,
                "country_id" => $request->country_id,
            ]);
            if (!empty($jurisdiction)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Jurisdiction Added Successfully!",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Can Not Add Jurisdiction!",
                ]);
            }
        }
    }
    public function show(string $id)
    {
        $jurisdiction = Jurisdiction::with('country')->find($id);
        if (!empty($jurisdiction)) {

            $jurisdiction = new JurisdictionResource($jurisdiction);

            return response()->json([
                "res" => "success",
                "message" => "Jurisdiction Found!",
                "detail" => $jurisdiction
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Jurisdiction Not Found!",
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
            "country_id" => 'required',
            "status" => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $jurisdiction = Jurisdiction::where('id', $id)->update([
                "name" => $request->name,
                "country_id" => $request->country_id,
                "status" => $request->status
            ]);
            if (!empty($jurisdiction)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Jurisdiction Updated Successfully!",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Can Not Update Jurisdiction!",
                ]);
            }
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Jurisdiction::destroy($id);
        return response()->json([
            "res" => "success",
            "message" => "Jurisdiction Deleted Successfully!",
        ]);
    }
}
