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
        Schema::table('promotions', function (Blueprint $table) {
            $table->date('promo_date')->nullable()->after('image');
        });

        // Copy start_date to promo_date for existing records
        DB::table('promotions')->update(['promo_date' => DB::raw('start_date')]);

        Schema::table('promotions', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('image');
            $table->date('end_date')->nullable()->after('start_date');
        });

        DB::table('promotions')->update([
            'start_date' => DB::raw('promo_date'),
            'end_date' => DB::raw('promo_date'),
        ]);

        Schema::table('promotions', function (Blueprint $table) {
            $table->dropColumn('promo_date');
        });
    }
};
