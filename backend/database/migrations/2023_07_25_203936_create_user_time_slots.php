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
        Schema::create('user_time_slots', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("status")->default(1)->comment("0 Inactive, 1 Active");
            $table->date("slot_date");
            $table->time("start_time");
            $table->time("end_time");
            $table->unsignedBigInteger("user_id");
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_time_slots');
    }
};
