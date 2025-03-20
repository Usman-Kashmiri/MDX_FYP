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
        Schema::table('users', function (Blueprint $table) {
            $table->string("phone_number")->nullable()->after("image");
            $table->string("address")->nullable()->after("phone_number");
            $table->text("short_bio")->nullable()->after("address");
            // $table->unsignedBigInteger('country_id')->default(0)->after("short_bio");
            $table->unsignedBigInteger('state_id')->default(0)->after("country_id");
            $table->string("city")->nullable()->after("state_id");
            $table->string("zip_code")->nullable()->after("city");
            $table->boolean("terms_of_service")->default(false)->after("zip_code");
            $table->string("bar_membership_numer")->nullable()->nullable()->after("terms_of_service");
            // $table->unsignedBigInteger('jurisdiction_id')->default(0)->after("bar_membership_numer");
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
