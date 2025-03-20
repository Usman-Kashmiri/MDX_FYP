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
        Schema::create('lawyers_jurisdictions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lawyer_id')->default(0);
            $table->unsignedBigInteger('jurisdiction_id')->default(0);
            $table->foreign('lawyer_id')->references('id')->on('users')->onDelete("cascade");
            $table->foreign('jurisdiction_id')->references('id')->on('jurisdictions')->onDelete("NO ACTION");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lawyers_jurisdiction');
    }
};
