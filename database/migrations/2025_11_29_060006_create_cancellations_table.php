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
        Schema::create('cancellations', function (Blueprint $table) {
            $table->id('id_cancellation');
            $table->unsignedBigInteger('id_booking');
            $table->unsignedBigInteger('id_user_cancelled_by');
            $table->text('reason');
            $table->timestamp('cancelled_at');
            $table->timestamps();

            $table->foreign('id_booking')->references('id_booking')->on('bookings')->onDelete('cascade');
            $table->foreign('id_user_cancelled_by')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancellations');
    }
};
