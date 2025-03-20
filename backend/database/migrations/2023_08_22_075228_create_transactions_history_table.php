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
        Schema::create('transactions_history', function (Blueprint $table) {
            $table->id();
            $table->bigInteger("user_id");
            $table->text('amount');
            $table->string("reason");
            $table->string("type")->comment("credited, debited");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions_history');
    }
};
