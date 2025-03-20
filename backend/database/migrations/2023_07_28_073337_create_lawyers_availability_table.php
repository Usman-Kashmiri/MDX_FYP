<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lawyers_availability', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('day'); // Day of the week (e.g., Mon, Tue, etc.)
            $table->time('start_time'); // Start time of the working hour (e.g., 09:00:00)
            $table->time('end_time'); // End time of the working hour (e.g., 17:00:00)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lawyers_availability');
    }
};
