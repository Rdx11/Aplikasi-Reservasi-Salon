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
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('confirmed_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('confirmation_date');
            $table->string('payment_proof')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('account_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
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
