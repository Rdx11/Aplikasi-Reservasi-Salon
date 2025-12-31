<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Revisi database:
     * 1. Ubah primary key id menjadi id_namatabel
     * 2. Sesuaikan size field yang tidak logis
     * 3. Terapkan nullable/not null yang tepat
     */
    public function up(): void
    {
        // Disable foreign key checks untuk MySQL
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // =====================================================
        // 1. TABEL USERS
        // =====================================================
        Schema::table('users', function (Blueprint $table) {
            // Ubah size field
            $table->string('name', 100)->change();
            $table->string('phone', 15)->nullable()->change();
            $table->string('profile_photo', 255)->nullable()->change();
        });

        // Rename primary key: id -> id_user
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('id', 'id_user');
        });

        // =====================================================
        // 2. TABEL CATEGORIES
        // =====================================================
        Schema::table('categories', function (Blueprint $table) {
            $table->string('name', 100)->change();
            $table->string('icon', 50)->nullable()->change();
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->renameColumn('id', 'id_category');
        });

        // =====================================================
        // 3. TABEL SERVICES
        // =====================================================
        Schema::table('services', function (Blueprint $table) {
            $table->string('name', 100)->change();
            $table->string('image', 255)->nullable()->change();
        });

        // Update foreign key reference
        Schema::table('services', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->renameColumn('id', 'id_service');
            $table->renameColumn('category_id', 'id_category');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->foreign('id_category')->references('id_category')->on('categories')->onDelete('cascade');
        });

        // =====================================================
        // 4. TABEL PROMOTIONS
        // =====================================================
        Schema::table('promotions', function (Blueprint $table) {
            $table->string('title', 150)->change();
            $table->string('image', 255)->nullable()->change();
        });

        Schema::table('promotions', function (Blueprint $table) {
            $table->dropForeign(['service_id']);
        });

        Schema::table('promotions', function (Blueprint $table) {
            $table->renameColumn('id', 'id_promotion');
            $table->renameColumn('service_id', 'id_service');
        });

        Schema::table('promotions', function (Blueprint $table) {
            $table->foreign('id_service')->references('id_service')->on('services')->onDelete('set null');
        });

        // =====================================================
        // 5. TABEL BOOKINGS
        // =====================================================
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('booking_code', 20)->change();
            $table->string('payment_proof', 255)->nullable()->change();
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['service_id']);
            $table->dropForeign(['promotion_id']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->renameColumn('id', 'id_booking');
            $table->renameColumn('user_id', 'id_user');
            $table->renameColumn('service_id', 'id_service');
            $table->renameColumn('promotion_id', 'id_promotion');
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->foreign('id_user')->references('id_user')->on('users')->onDelete('cascade');
            $table->foreign('id_service')->references('id_service')->on('services')->onDelete('cascade');
            $table->foreign('id_promotion')->references('id_promotion')->on('promotions')->onDelete('set null');
        });

        // =====================================================
        // 6. TABEL BOOKING_CONFIRMATIONS
        // =====================================================
        Schema::table('booking_confirmations', function (Blueprint $table) {
            $table->string('payment_proof', 255)->nullable()->change();
            $table->string('bank_name', 50)->nullable()->change();
            $table->string('account_number', 25)->nullable()->change();
            $table->string('account_name', 100)->nullable()->change();
        });

        Schema::table('booking_confirmations', function (Blueprint $table) {
            $table->dropForeign(['booking_id']);
            $table->dropForeign(['confirmed_by']);
        });

        Schema::table('booking_confirmations', function (Blueprint $table) {
            $table->renameColumn('id', 'id_booking_confirmation');
            $table->renameColumn('booking_id', 'id_booking');
            $table->renameColumn('confirmed_by', 'id_user_confirmed_by');
        });

        Schema::table('booking_confirmations', function (Blueprint $table) {
            $table->foreign('id_booking')->references('id_booking')->on('bookings')->onDelete('cascade');
            $table->foreign('id_user_confirmed_by')->references('id_user')->on('users')->onDelete('cascade');
        });

        // =====================================================
        // 7. TABEL CANCELLATIONS
        // =====================================================
        Schema::table('cancellations', function (Blueprint $table) {
            $table->dropForeign(['booking_id']);
            $table->dropForeign(['cancelled_by']);
        });

        Schema::table('cancellations', function (Blueprint $table) {
            $table->renameColumn('id', 'id_cancellation');
            $table->renameColumn('booking_id', 'id_booking');
            $table->renameColumn('cancelled_by', 'id_user_cancelled_by');
        });

        Schema::table('cancellations', function (Blueprint $table) {
            $table->foreign('id_booking')->references('id_booking')->on('bookings')->onDelete('cascade');
            $table->foreign('id_user_cancelled_by')->references('id_user')->on('users')->onDelete('cascade');
        });

        // =====================================================
        // 8. TABEL SESSIONS (update foreign key)
        // =====================================================
        Schema::table('sessions', function (Blueprint $table) {
            $table->renameColumn('user_id', 'id_user');
        });

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Reverse sessions
        Schema::table('sessions', function (Blueprint $table) {
            $table->renameColumn('id_user', 'user_id');
        });

        // Reverse cancellations
        Schema::table('cancellations', function (Blueprint $table) {
            $table->dropForeign(['id_booking']);
            $table->dropForeign(['id_user_cancelled_by']);
        });
        Schema::table('cancellations', function (Blueprint $table) {
            $table->renameColumn('id_cancellation', 'id');
            $table->renameColumn('id_booking', 'booking_id');
            $table->renameColumn('id_user_cancelled_by', 'cancelled_by');
        });
        Schema::table('cancellations', function (Blueprint $table) {
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->foreign('cancelled_by')->references('id')->on('users')->onDelete('cascade');
        });

        // Reverse booking_confirmations
        Schema::table('booking_confirmations', function (Blueprint $table) {
            $table->dropForeign(['id_booking']);
            $table->dropForeign(['id_user_confirmed_by']);
        });
        Schema::table('booking_confirmations', function (Blueprint $table) {
            $table->renameColumn('id_booking_confirmation', 'id');
            $table->renameColumn('id_booking', 'booking_id');
            $table->renameColumn('id_user_confirmed_by', 'confirmed_by');
            $table->string('bank_name', 255)->nullable()->change();
            $table->string('account_number', 255)->nullable()->change();
            $table->string('account_name', 255)->nullable()->change();
        });
        Schema::table('booking_confirmations', function (Blueprint $table) {
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->foreign('confirmed_by')->references('id')->on('users')->onDelete('cascade');
        });

        // Reverse bookings
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['id_user']);
            $table->dropForeign(['id_service']);
            $table->dropForeign(['id_promotion']);
        });
        Schema::table('bookings', function (Blueprint $table) {
            $table->renameColumn('id_booking', 'id');
            $table->renameColumn('id_user', 'user_id');
            $table->renameColumn('id_service', 'service_id');
            $table->renameColumn('id_promotion', 'promotion_id');
            $table->string('booking_code', 255)->change();
        });
        Schema::table('bookings', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->foreign('promotion_id')->references('id')->on('promotions')->onDelete('set null');
        });

        // Reverse promotions
        Schema::table('promotions', function (Blueprint $table) {
            $table->dropForeign(['id_service']);
        });
        Schema::table('promotions', function (Blueprint $table) {
            $table->renameColumn('id_promotion', 'id');
            $table->renameColumn('id_service', 'service_id');
            $table->string('title', 255)->change();
        });
        Schema::table('promotions', function (Blueprint $table) {
            $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');
        });

        // Reverse services
        Schema::table('services', function (Blueprint $table) {
            $table->dropForeign(['id_category']);
        });
        Schema::table('services', function (Blueprint $table) {
            $table->renameColumn('id_service', 'id');
            $table->renameColumn('id_category', 'category_id');
            $table->string('name', 255)->change();
        });
        Schema::table('services', function (Blueprint $table) {
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });

        // Reverse categories
        Schema::table('categories', function (Blueprint $table) {
            $table->renameColumn('id_category', 'id');
            $table->string('name', 255)->change();
            $table->string('icon', 255)->nullable()->change();
        });

        // Reverse users
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('id_user', 'id');
            $table->string('name', 255)->change();
            $table->string('phone', 255)->nullable()->change();
        });

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
};
