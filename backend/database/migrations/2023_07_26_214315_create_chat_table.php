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
        Schema::create('chat', function (Blueprint $table) {
            $table->id();
            $table->BigInteger("appointment_id")->default(0);
            $table->unsignedBigInteger("sender_id");
            $table->unsignedBigInteger("recevier_id");
            $table->longText("message")->nullable();
            $table->string("attach_type")->nullable()->comment("image, video, audio, document");
            $table->string("attach")->nullable();
            $table->boolean("seen")->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat');
    }
};
