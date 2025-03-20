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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->enum("type", ['long term', 'short term']);
            $table->string('title');
            $table->integer('client_id');
            $table->integer('lawyer_id');
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->decimal('fees_amount', 10, 2);
            $table->string('currency', 10);
            $table->string('document', 100)->nullable();
            $table->string('clauses');
            $table->string('additional_note')->nullable();
            $table->string('payment_details')->nullable();
            $table->enum('status', ['pending', 'in-progress', 'complete', 'rejected', 'canceled'])->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
