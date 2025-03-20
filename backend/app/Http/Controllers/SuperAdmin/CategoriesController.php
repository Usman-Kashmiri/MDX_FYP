<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoriesController extends Controller
{
    public function index()
    {
        $categories = BlogCategory::all();

        if (count($categories) > 0) {
            return response()->json([
                "res" => "success",
                "message" => "Categories Found Successfully",
                "data" => $categories
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Categories Not Found",
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

            $entry = BlogCategory::create([
                "name" => $request->name,
            ]);

            if (!empty($entry)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Category Successfully Added",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Add Category",
                ]);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = BlogCategory::where('id', $id)->first();

        if (!empty($category)) {
            return response()->json([
                "res" => "success",
                "message" => "category Found Successfully",
                "data" => $category
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Find category",
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

            $entry = BlogCategory::where('id', $id)->update([
                "name" => $request->name,
            ]);

            if (!empty($entry)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Category Updated Succcessfully",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Update Category",
                ]);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = BlogCategory::destroy($id);

        if ($category) {
            return response()->json([
                "res" => "success",
                "message" => "Category Deleted Successfully",
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Delete Category",
            ]);
        }
    }
}
