<?php

namespace Database\Seeders;

use App\Models\BlockWord;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlockWordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (count(BlockWord::all()) == 0) {
            $words = array("fuck", "sex", "sexy", "porn", "bitch");
            foreach ($words as $word) {
                BlockWord::create([
                    "word" => $word
                ]);
            }
        }
    }
}
