<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarouselSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('carousel_text')->insert([
            'text' => 'Your Legal Solution Starts Here',
            'punchline' => 'Revolutionizing Legal Access - One Service at a Time',
        ]);
    }
}
