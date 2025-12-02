<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
});

// Customer Routes (Admin cannot access)
Route::middleware(['auth', 'customer'])->prefix('customer')->name('customer.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Customer\DashboardController::class, 'index'])->name('dashboard');

    // Services
    Route::get('/services', [App\Http\Controllers\Customer\ServiceController::class, 'index'])->name('services.index');
    Route::get('/services/{service}', [App\Http\Controllers\Customer\ServiceController::class, 'show'])->name('services.show');

    // Bookings
    Route::get('/bookings', [App\Http\Controllers\Customer\BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings', [App\Http\Controllers\Customer\BookingController::class, 'store'])->name('bookings.store');
    Route::get('/bookings/{booking}', [App\Http\Controllers\Customer\BookingController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{booking}/cancel', [App\Http\Controllers\Customer\BookingController::class, 'cancel'])->name('bookings.cancel');

    // Profile
    Route::get('/profile', [App\Http\Controllers\Customer\ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [App\Http\Controllers\Customer\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [App\Http\Controllers\Customer\ProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::delete('/profile/photo', [App\Http\Controllers\Customer\ProfileController::class, 'deletePhoto'])->name('profile.photo.delete');
    Route::put('/password', [App\Http\Controllers\Customer\ProfileController::class, 'updatePassword'])->name('password.update');
});

// Admin Routes
Route::middleware(['auth', 'role:Admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    // Services
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('/services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings/{booking}/confirm', [BookingController::class, 'confirm'])->name('bookings.confirm');
    Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::post('/bookings/{booking}/complete', [BookingController::class, 'complete'])->name('bookings.complete');

    // Promotions
    Route::get('/promotions', [PromotionController::class, 'index'])->name('promotions.index');
    Route::post('/promotions', [PromotionController::class, 'store'])->name('promotions.store');
    Route::put('/promotions/{promotion}', [PromotionController::class, 'update'])->name('promotions.update');
    Route::delete('/promotions/{promotion}', [PromotionController::class, 'destroy'])->name('promotions.destroy');

    // Users
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Reports
    Route::get('/reports', [App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [App\Http\Controllers\Admin\ReportController::class, 'export'])->name('reports.export');

    // Notifications API
    Route::get('/notifications/new-bookings', [App\Http\Controllers\Admin\NotificationController::class, 'getNewBookings'])->name('notifications.new-bookings');
    Route::post('/notifications/mark-read', [App\Http\Controllers\Admin\NotificationController::class, 'markAsRead'])->name('notifications.mark-read');

    // Profile
    Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [App\Http\Controllers\Admin\ProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::delete('/profile/photo', [App\Http\Controllers\Admin\ProfileController::class, 'deletePhoto'])->name('profile.photo.delete');
    Route::put('/profile/password', [App\Http\Controllers\Admin\ProfileController::class, 'updatePassword'])->name('profile.password');

    // Settings
    Route::get('/settings', [App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
});
