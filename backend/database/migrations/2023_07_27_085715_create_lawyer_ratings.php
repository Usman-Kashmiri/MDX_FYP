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
        Schema::create('lawyer_ratings', function (Blueprint $table) {
            $table->id();
            $table->integer('rating');
            $table->unsignedBigInteger("lawyer_id");
            $table->unsignedBigInteger("client_id");
            $table->text("feedback");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lawyer_ratings');
    }
};
