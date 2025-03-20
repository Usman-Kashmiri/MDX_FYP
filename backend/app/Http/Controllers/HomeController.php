<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    // public function index()
    // {
    //     return view('home');
    // }

    public function uploadFileOnS3Bucket(Request $request)
    {
        try {
            if ($request->hasFile('file')) {
                $image = $request->file('file');

                if ($image !== null) {

                    $mimeType = $image->getClientMimeType();
                    if (!Str::startsWith($mimeType, 'image/') || $mimeType === 'image/webp') {
                        // ? pass the uploading task to uploadPrivateFileOnS3 function
                        return self::uploadPrivateFileOnS3($image, 'test');
                    }

                    $uniqueFileName = uniqid();
                    $newFileName = $uniqueFileName . '.webp';
                    $im = imagecreatefromstring(file_get_contents($image));
                    imagepalettetotruecolor($im);
                    imagewebp($im, $newFileName, 80);
                    imagedestroy($im);

                    // Upload the WebP image to S3
                    $uploaded = Storage::disk('s3')->put('test/' . $newFileName, file_get_contents($newFileName));

                    // ? clean up the temporary WEBP file
                    unlink($newFileName);

                    return response()->json(
                        [
                            "success" => false,
                            "message" => "webp image uploaded on s3 successfully!",
                            "data" => 'test/' . $newFileName,
                        ],
                        500
                    );
                }
            }

            return response()->json(
                [
                    "success" => false,
                    "message" => "Failed to upload webp image on s3!"
                ],
                500
            );
        } catch (\Throwable $th) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "File upload on s3 failed!",
                    "error" => $th->getMessage()
                ],
                500
            );
        }
    }

    public function fetchFiles()
    {
        try {
            $client = Storage::disk('s3')->getClient();
            $bucket = Config::get('filesystems.disks.s3.bucket');
            $command = $client->getCommand('GetObject', [
                'Bucket' => $bucket,
                'Key' => 'test/jyOJVNHiqbKCJHWFZZABtAOibWk00XV3zMCmFCUH.png'
            ]);
            $file = $client->createPresignedRequest($command, "+30 minutes");

            if ($file) {
                return response()->json(
                    [
                        "success" => true,
                        "message" => "Resources retrieved from S3 bucket successfully!",
                        "data" => $file->getUri()
                    ],
                    200
                );
            }

            return response()->json(
                [
                    "success" => false,
                    "message" => "Resources not found on S3 bucket!",
                ],
                404
            );
        } catch (\Throwable $th) {
            return response()->json(
                [
                    "success" => false,
                    "message" => "Failed to retrived resources from S3 bucket!",
                    "error" => $th->getMessage()
                ],
                500
            );
        }
    }
}
