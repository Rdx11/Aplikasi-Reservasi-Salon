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
        Schema::create('booking_confirmations', function (Blueprint $table) {
            $table->id('id_booking_confirmation');
            $table->unsignedBigInteger('id_booking')->unique();
            $table->unsignedBigInteger('id_user_confirmed_by');
            $table->timestamp('confirmation_date');
            $table->string('payment_proof', 255)->nullable();
            $table->string('bank_name', 50)->nullable();
            $table->string('account_number', 25)->nullable();
            $table->string('account_name', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('id_booking')->references('id_booking')->on('bookings')->onDelete('cascade');
            $table->foreign('id_user_confirmed_by')->references('id_user')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_confirmations');
    }
};
