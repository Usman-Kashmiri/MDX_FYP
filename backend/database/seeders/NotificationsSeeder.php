<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('notifications')->insert([
            [
                "user_id" => 124,
                'title' => 'A New Contract Has Been Created!',
                'description' => 'A new contract has been created by your lawyer Mr. K.D. Patak.',
                'url' => null,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "user_id" => 124,
                'title' => 'Contract Completion Request!',
                'description' => 'Your lawyer Mr. Bajaj has initiated a request to complete an ongoing contract.',
                'url' => null,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "user_id" => 100,
                'title' => 'A New Contract Has Been Created!',
                'description' => 'A new contract has been created by your lawyer Mr. K.D. Patak.',
                'url' => null,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "user_id" => 100,
                'title' => 'Contract Completion Request!',
                'description' => 'Your lawyer Mr. Bajaj has initiated a request to complete an ongoing contract.',
                'url' => null,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "user_id" => 8,
                'title' => 'A New Contract Has Been Created!',
                'description' => 'A new contract has been created by your lawyer Mr. K.D. Patak.',
                'url' => null,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "user_id" => 8,
                'title' => 'Contract Completion Request!',
                'description' => 'Your lawyer Mr. Bajaj has initiated a request to complete an ongoing contract.',
                'url' => null,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "user_id" => 93,
                'title' => 'A New Contract Has Been Created!',
                'description' => 'A new contract has been created by your lawyer Mr. K.D. Patak.',
                'url' => null,
                "created_at" => now(),
                "updated_at" => now(),
            ],
            [
                "user_id" => 93,
                'title' => 'Contract Completion Request!',
                'description' => 'Your lawyer Mr. Bajaj has initiated a request to complete an ongoing contract.',
                'url' => null,
                "created_at" => now(),
                "updated_at" => now(),
            ],
        ]);
    }
}
