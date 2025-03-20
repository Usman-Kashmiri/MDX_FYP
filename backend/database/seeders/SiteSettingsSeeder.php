<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('website_settings')->insert([
            'site_name' => 'nbundl',
            'site_email' => 'info@nbundl.com',
            'admin_commission_percent' => null,
            'gpt_key' => null,
            'stripe_pk' => null,
            'stripe_sk' => null,
            'encryption_key' => null,
        ]);
    }
}
