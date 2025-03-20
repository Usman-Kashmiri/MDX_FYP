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
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("lawyer_id");
            $table->unsignedBigInteger("client_id");
            $table->longText("case")->nullable();
            $table->longText("case_summary")->nullable();
            $table->smallInteger("status")->comment("0 pending, 1 approved, 2 rejected, 3 completed, 4 cancelled");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
