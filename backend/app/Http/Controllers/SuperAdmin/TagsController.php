<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TagsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tags = Tag::all();

        if (count($tags) > 0) {
            return response()->json([
                "res" => "success",
                "message" => "Tags Found Successfully",
                "data" => $tags
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Tags Not Found",
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $entry = Tag::create([
                "name" => $request->name,
            ]);

            if (!empty($entry)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Tag Successfully Added",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Add Tag",
                ]);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tag = Tag::where('id', $id)->first();

        if (!empty($tag)) {
            return response()->json([
                "res" => "success",
                "message" => "Tag Found Successfully",
                "data" => $tag
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Find Tag",
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            "name" => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $entry = Tag::where('id', $id)->update([
                "name" => $request->name,
            ]);

            if (!empty($entry)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Tag Updated Succcessfully",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Update Tag",
                ]);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tag = Tag::destroy($id);

        if ($tag) {
            return response()->json([
                "res" => "success",
                "message" => "Tag Deleted Successfully",
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Delete Tag",
            ]);
        }
    }
}
