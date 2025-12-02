<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $stats = [
            'totalBookings' => Booking::where('user_id', $userId)->count(),
            'completedBookings' => Booking::where('user_id', $userId)->where('status', 'completed')->count(),
            'pendingBookings' => Booking::where('user_id', $userId)->where('status', 'pending')->count(),
            'cancelledBookings' => Booking::where('user_id', $userId)->where('status', 'cancelled')->count(),
            'totalSpent' => Booking::where('user_id', $userId)->where('status', 'completed')->sum('total_price'),
        ];

        $recentBookings = Booking::with(['service.category'])
            ->where('user_id', $userId)
            ->latest()
            ->take(5)
            ->get();

        $upcomingBookings = Booking::with(['service.category'])
            ->where('user_id', $userId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('booking_date', '>=', now()->toDateString())
            ->orderBy('booking_date')
            ->orderBy('booking_time')
            ->take(3)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'upcomingBookings' => $upcomingBookings,
        ]);
    }
}
