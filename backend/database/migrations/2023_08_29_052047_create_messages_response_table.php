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
        Schema::create('messages_response', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contact_id');
            $table->text('subject');
            $table->text('message');
            $table->timestamps();

            $table->foreign('contact_id')->references('id')->on('contact_us')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages_response');
    }
};
