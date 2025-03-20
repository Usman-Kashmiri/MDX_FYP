<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Resources\WebsiteSettingsResource;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;

class WebsiteSettingsController extends Controller
{
    public function index()
    {
        try {
            $websiteSettings = WebsiteSetting::find(1);

            $websiteSettings = new WebsiteSettingsResource($websiteSettings);

            if (!empty($websiteSettings)) {
                return response()->json([
                    "res" => "success",
                    "message" => "Website found successfully",
                    "data" => $websiteSettings
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Data not found",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }

    public function update(Request $request)
    {
        try {
            $websiteSettings = WebsiteSetting::find(1);

            $websiteLogo = self::uploadWEBPImageOnS3($request, 'site_logo', $websiteSettings, 'site', 'public');
            $websiteFavicon = self::uploadWEBPImageOnS3($request, 'site_favicon', $websiteSettings, 'site', 'public');

            $websiteSettings->site_name = $request->site_name;
            $websiteSettings->site_email = $request->site_email;
            $websiteSettings->site_contact = $request->site_contact;
            $websiteSettings->admin_commission_percent = $request->admin_commission_percent;
            $websiteSettings->gpt_key = $request->gpt_key;
            $websiteSettings->stripe_pk = $request->stripe_public_key;
            $websiteSettings->stripe_sk = $request->stripe_secret_key;
            $websiteSettings->encryption_key = $request->encryption_key;
            $websiteSettings->site_logo = $websiteLogo ?? $websiteSettings->site_logo;
            $websiteSettings->site_favicon = $websiteFavicon ?? $websiteSettings->site_favicon;

            $isUpdated = $websiteSettings->save();

            if ($isUpdated) {
                return response()->json([
                    "res" => "success",
                    "message" => "Website Settings Successfully Updated",
                ]);
            }

            return response()->json([
                "res" => "error",
                "message" => "Couldn't Update Website Settings",
            ]);
        } catch (\Throwable $th) {
            return self::exceptionResponse($th->getMessage());
        }
    }
}
