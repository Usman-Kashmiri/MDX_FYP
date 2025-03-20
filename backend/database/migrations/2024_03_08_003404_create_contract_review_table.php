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
        Schema::create('contract_reviews', function (Blueprint $table) {
            $table->id();
            $table->string('contract_id');
            $table->integer('sender_id');
            $table->integer('reciever_id');
            $table->string('rating');
            $table->string('review');
            $table->string('reciever_role');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_review');
    }
};
