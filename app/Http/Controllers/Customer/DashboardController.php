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
            'totalBookings' => Booking::where('id_user', $userId)->count(),
            'completedBookings' => Booking::where('id_user', $userId)->where('status', 'completed')->count(),
            'pendingBookings' => Booking::where('id_user', $userId)->where('status', 'pending')->count(),
            'cancelledBookings' => Booking::where('id_user', $userId)->where('status', 'cancelled')->count(),
            'totalSpent' => Booking::where('id_user', $userId)->where('status', 'completed')->sum('total_price'),
        ];

        $recentBookings = Booking::with(['service.category'])
            ->where('id_user', $userId)
            ->latest()
            ->take(5)
            ->get();

        $upcomingBookings = Booking::with(['service.category'])
            ->where('id_user', $userId)
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
