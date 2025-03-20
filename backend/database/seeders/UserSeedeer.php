<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeedeer extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User::truncate();
        if (count(User::all()) == 0) {
            User::create([
                "first_name" => "Ali",
                "last_name" => "Khan",
                "email" => "superadmin@gmail.com",
                "password" => Hash::make("superadmin123"),
                "role_id" => 1,
                "status" => "1",
                "country_id" => 0,
                "state_id" => 0,
            ]);
            User::create([
                "first_name" => "Hamza",
                "last_name" => "Khalid",
                "email" => "admin@gmail.com",
                "password" => Hash::make("admin123"),
                "role_id" => 2,
                "status" => "1",
                "country_id" => 0,
                "state_id" => 0,
            ]);
            User::create([
                "first_name" => "Ibrahim",
                "last_name" => "Nawab",
                "email" => "lawyer@gmail.com",
                "password" => Hash::make("lawyer123"),
                "role_id" => 3,
                "status" => "1",
                "country_id" => 0,
                "state_id" => 0,
            ]);
            User::create([
                "first_name" => "Usman",
                "last_name" => "Amjad",
                "email" => "client@gmail.com",
                "password" => Hash::make("client123"),
                "role_id" => 4,
                "status" => "1",
                "country_id" => 0,
                "state_id" => 0,
            ]);
        }
    }
}
