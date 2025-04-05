<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    // ? upload any file
    public static function handleFileUpload($request, $field, $obj, $uploadPath)
    {
        if ($request->hasFile($field)) {
            $image = $request->file($field);

            if ($image !== null) {
                $uniqueFileName = uniqid();
                $fileExtension = strtolower($image->getClientOriginalExtension());
                $newFileName = $uniqueFileName . '.' . $fileExtension;
                $path = public_path($uploadPath);

                if ($obj !== null) {
                    $oldImage = $obj->{$field};

                    if ($oldImage !== null && $oldImage !== "") {
                        $oldImagePath = $path . $oldImage;

                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath);
                        }
                    }
                }

                $image->move($path, $newFileName);

                return $newFileName;
            }
        }

        return null;
    }

    // ? upload images in WEBPNG format
    public static function uploadImageInWEBP($request, $field, $obj, $uploadPath)
    {
        if ($request->hasFile($field)) {
            $image = $request->file($field);

            if ($image !== null) {

                $mimeType = $image->getClientMimeType();
                if (!Str::startsWith($mimeType, 'image/') || $mimeType === 'image/webp') {
                    return self::handleFileUpload($request, $field, $obj, $uploadPath);
                }

                $uniqueFileName = uniqid();
                $path = public_path($uploadPath);
                $newFileName = $uniqueFileName . '.webp';
                $im = imagecreatefromstring(file_get_contents($image));
                imagepalettetotruecolor($im);
                imagewebp($im, $newFileName, 80);
                imagedestroy($im);

                if ($obj !== null) {
                    $oldImage = $obj->{$field};

                    if ($oldImage !== null && $oldImage !== "") {
                        $oldImagePath = $path . $oldImage;

                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath);
                        }
                    }
                }


                return $newFileName;
            }
        }

        return null;
    }

    // ? success response handler
    public static function successResponse(
        $message,
        $data = null
    ) {
        $response = [
            "success" => true,
            "message" => $message,
        ];

        if (!is_null($data)) {
            $response['data'] = $data;
        }

        return response()->json($response, 200);
    }

    // ? failure response handler
    public static function failureResponse(
        $message = "Looks like something went  wrong!",
        $status = 500,
        $error = null,
    ) {
        $response = [
            "success" => false,
            "message" => $message,
        ];

        if (!is_null($error)) {
            $response['error'] = $error;
        }

        return response()->json($response, $status);
    }

    // ? failure response handler
    public static function exceptionResponse($error = null)
    {
        $response = [
            "success" => false,
            "message" => "Looks like something went  wrong!",
        ];

        if (!is_null($error)) {
            $response['error'] = $error;
        }

        return response()->json($response, 500);
    }

    // ? validate pagination query
    public static function validatePagination($request)
    {
        $validator = Validator::make($request->query(), [
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:50',
        ]);

        if ($validator->fails()) {
            return self::failureResponse($validator->errors()->first(), 400);
        }
    }
}
