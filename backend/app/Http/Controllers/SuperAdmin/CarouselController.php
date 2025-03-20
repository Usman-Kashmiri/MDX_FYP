<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\carouselImagesResource;
use App\Models\CarouselImage;
use App\Models\CarouselText;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarouselController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $carouselImages = CarouselImage::orderBy("order", "ASC")->get();
        $carouselText = CarouselText::find(1);

        if (count($carouselImages) > 0 || !empty($carouselText)) {
            $carouselImages = carouselImagesResource::collection($carouselImages);

            return response()->json([
                "res" => "success",
                "message" => "Carousel data found successfully",
                "data" => [
                    "carousel_text" => $carouselText,
                    "carousel_images" =>  $carouselImages,
                ]
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't find carousel data",
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function add_carousel_image(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "image" => 'required|image|mimes:jpeg,png,gif,jpg,svg,webp|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {
            $image = self::uploadWEBPImageOnS3($request, 'image', null, 'carousel', "public");

            $entry = CarouselImage::create([
                "image" => $image ?? $request->image,
                "alt_text" => $request->alt_text,
                "order" => $request->order,
            ]);

            if (!empty($entry)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Carousel Image Successfully Added",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Add Carousel Image",
                ]);
            }
        }
    }

    public function add_carousel_text(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "punchline" => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $entry = CarouselText::create([
                "text" => $request->text,
                "punchline" => $request->punchline,
            ]);

            if (!empty($entry)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Carousel Text Successfully Added",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Add Carousel Text",
                ]);
            }
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update_carousel_text(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            "punchline" => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        } else {

            $isUpdated = CarouselText::where('id', $id)->update([
                "text" => $request->text,
                "punchline" => $request->punchline,
            ]);

            if (!empty($isUpdated)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Carousel Text Updated Successfully",
                ]);
            } else {
                return response()->json([
                    "res" => "error",
                    "message" => "Couldn't Update Carousel Text",
                ]);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete_carousel_image(string $id)
    {
        $isDeleted = CarouselImage::destroy($id);

        if ($isDeleted) {
            return response()->json([
                "res" => "success",
                "message" => "Carousel Image Deleted Successfully",
            ]);
        } else {
            return response()->json([
                "res" => "error",
                "message" => "Couldn't Delete Carousel Image",
            ]);
        }
    }

    public function update_image_order(Request $request)
    {
        $newOrder = $request->input('order');

        $isUpdated = 0;

        foreach ($newOrder as $orderData) {
            $image = CarouselImage::find($orderData['id']);
            if (!empty($image)) {
                $image->order = $orderData['order'];
                $image->save();
                $isUpdated = $isUpdated + 1;
            }
        }

        if ($isUpdated > 0) {
            return response()->json(['res' => "success", 'message' => 'Images order updated successfully']);
        } else {
            return response()->json(["res" => "error", 'message' => "Couldn't update Images order"]);
        }
    }
}
