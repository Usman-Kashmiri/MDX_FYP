<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

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

    public static function uploadImageInWEBP($request, $field, $obj, $uploadPath)
    {
        if ($request->hasFile($field)) {
            $image = $request->file($field);

            if ($image !== null) {

                $mimeType = $image->getClientMimeType();
                if (!Str::startsWith($mimeType, 'image/') || $mimeType === 'image/webp') {
                    // ? pass the uploading task to uploadPrivateFileOnS3 function
                    return self::uploadPrivateFileOnS3($image, $uploadPath);
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

    // ? inprogress incompelete function
    public static function uploadWEBPImageOnS3($request, $field, $obj, $uploadPath, $ACLtype)
    {
        if ($request->hasFile($field)) {
            $image = $request->file($field);

            if ($image !== null) {

                $mimeType = $image->getClientMimeType();
                $uniqueFileName = uniqid();
                $newFileName = $uniqueFileName . '.webp';

                if (!Str::startsWith($mimeType, 'image/') || $mimeType === 'image/webp') {
                    // ? just upload the file to S3 without conversion.
                    $uploaded = Storage::disk('s3')->put($uploadPath . "/" . $newFileName, file_get_contents($image), $ACLtype);

                    return $uploaded ? $uploadPath . '/' . $newFileName : null;
                }

                $im = imagecreatefromstring(file_get_contents($image));
                imagepalettetotruecolor($im);
                imagewebp($im, $newFileName, 80);
                imagedestroy($im);

                if ($obj !== null) {
                    $oldImage = $obj->{$field};
                    if ($oldImage !== null && $oldImage !== "") {
                        // ? delete old image from bucket
                        Storage::disk('s3')->delete($oldImage);
                    }
                }

                $uploaded = Storage::disk('s3')->put($uploadPath . "/" . $newFileName, file_get_contents($newFileName), $ACLtype);

                // ? clean up the temporary WEBP file
                unlink($newFileName);

                return $uploaded ? $uploadPath . '/' . $newFileName : null;
            }
        }

        return null;
    }

    // ? upload a file to bucket privately.
    public static function uploadPrivateFileOnS3($file, $path)
    {
        try {
            $uploaded = $file->store($path, 's3');

            return $uploaded;
        } catch (\Throwable $th) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Failed to upload resource on S3 bucket!",
                    "error" => $th->getMessage(),
                ],
                500
            );
        }
    }

    // ? retrieve private file from bucket
    public static function getPrivateS3File($filename)
    {
        try {
            $client = Storage::disk('s3')->getClient();
            $bucket = Config::get('filesystems.disks.s3.bucket');
            $command = $client->getCommand('GetObject', [
                'Bucket' => $bucket,
                'Key' => $filename,
            ]);
            $presignedUrl = $client->createPresignedRequest($command, "+30 minutes")->getUri();

            return (string) $presignedUrl;
        } catch (\Throwable $th) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Failed to retrive resource from S3 bucket!",
                    "error" => $th->getMessage(),
                ],
                500
            );
        }
    }

    // ? retrieve public file from bucket
    public static function getPublicS3File($filename)
    {
        try {
            $uri = Storage::disk('s3')->url($filename);

            return $uri;
        } catch (\Throwable $th) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Failed to retrive resource from S3 bucket!",
                    "error" => $th->getMessage(),
                ],
                500
            );
        }
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
