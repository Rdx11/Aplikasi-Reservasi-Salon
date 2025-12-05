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
        Schema::table('bookings', function (Blueprint $table) {
            $table->decimal('original_price', 10, 2)->nullable()->after('total_price');
            $table->foreignId('promotion_id')->nullable()->after('original_price')->constrained()->onDelete('set null');
        });

        // Set original_price = total_price for existing bookings
        DB::table('bookings')->whereNull('original_price')->update([
            'original_price' => DB::raw('total_price')
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['promotion_id']);
            $table->dropColumn(['original_price', 'promotion_id']);
        });
    }
};
