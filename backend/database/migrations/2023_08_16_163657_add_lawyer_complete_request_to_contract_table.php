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
        Schema::table('contracts', function (Blueprint $table) {
            $table->integer("lawyer_complete_request")->nullable()->default(0)->comment('0 => not sent ,1 => sent');
            $table->timestamp("lawyer_request_timestamp")->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn('lawyer_complete_request');
            $table->dropColumn("lawyer_request_timestamp");
        });
    }
};
