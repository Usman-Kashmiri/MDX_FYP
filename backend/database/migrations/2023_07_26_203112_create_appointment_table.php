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
        Schema::create('appointment', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("user_id");
            $table->unsignedBigInteger("lawyer_id");
            $table->string("title");
            $table->longText("description");
            $table->date("appointment_date");
            $table->time("appointment_start_time");
            $table->time("appointment_end_time");
            $table->bigInteger("status")->comment("0 pending, 1 confirmed, 2 cancelled, 3 past");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment');
    }
};
