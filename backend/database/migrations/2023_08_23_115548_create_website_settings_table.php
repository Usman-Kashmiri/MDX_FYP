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
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->nullable();
            $table->string('site_email')->nullable();
            $table->text('site_logo')->nullable();
            $table->text('site_favicon')->nullable();
            $table->string('site_contact')->nullable();
            $table->text('admin_commission_percent')->nullable();
            $table->text('gpt_key')->nullable();
            $table->text('stripe_pk')->nullable();
            $table->text('stripe_sk')->nullable();
            $table->text('encryption_key')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_settings');
    }
};
