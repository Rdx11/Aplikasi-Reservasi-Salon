<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get monthly booking data for chart (last 6 months)
        $monthlyBookings = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = Booking::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $revenue = Booking::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->where('status', 'completed')
                ->sum('total_price');
            
            $monthlyBookings->push([
                'month' => $date->format('M'),
                'bookings' => $count,
                'revenue' => (int) $revenue,
            ]);
        }

        // Get booking status distribution for pie chart
        $bookingStatus = [
            ['name' => 'Pending', 'value' => Booking::where('status', 'pending')->count(), 'color' => '#f59e0b'],
            ['name' => 'Confirmed', 'value' => Booking::where('status', 'confirmed')->count(), 'color' => '#3b82f6'],
            ['name' => 'Completed', 'value' => Booking::where('status', 'completed')->count(), 'color' => '#10b981'],
            ['name' => 'Cancelled', 'value' => Booking::where('status', 'cancelled')->count(), 'color' => '#ef4444'],
        ];

        // Calculate growth percentages
        $thisMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();
        
        $thisMonthBookings = Booking::whereMonth('created_at', $thisMonth->month)
            ->whereYear('created_at', $thisMonth->year)->count();
        $lastMonthBookings = Booking::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)->count();
        
        $bookingsGrowth = $lastMonthBookings > 0 
            ? round((($thisMonthBookings - $lastMonthBookings) / $lastMonthBookings) * 100) 
            : 0;

        $thisMonthRevenue = Booking::whereMonth('created_at', $thisMonth->month)
            ->whereYear('created_at', $thisMonth->year)
            ->where('status', 'completed')
            ->sum('total_price');
        $lastMonthRevenue = Booking::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->where('status', 'completed')
            ->sum('total_price');
        
        $revenueGrowth = $lastMonthRevenue > 0 
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100) 
            : 0;

        // Recent bookings with real data
        $recentBookings = Booking::with(['user', 'service'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id_booking,
                    'booking_code' => $booking->booking_code,
                    'customer_name' => $booking->user->name ?? 'Unknown',
                    'service_name' => $booking->service->name ?? 'Unknown',
                    'booking_date' => Carbon::parse($booking->booking_date)->format('d M Y'),
                    'booking_time' => $booking->booking_time,
                    'total_price' => (int) $booking->total_price,
                    'status' => $booking->status,
                ];
            });

        // Popular services
        $popularServices = Service::withCount(['bookings' => function ($query) {
                $query->whereMonth('created_at', Carbon::now()->month);
            }])
            ->orderByDesc('bookings_count')
            ->take(5)
            ->get()
            ->map(function ($service) {
                return [
                    'name' => $service->name,
                    'bookings' => $service->bookings_count,
                    'price' => (int) $service->price,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => User::role('Customer')->count(),
                'totalBookings' => Booking::count(),
                'totalServices' => Service::where('is_active', true)->count(),
                'revenue' => (int) Booking::where('status', 'completed')->sum('total_price'),
                'pendingBookings' => Booking::where('status', 'pending')->count(),
                'bookingsGrowth' => $bookingsGrowth,
                'revenueGrowth' => $revenueGrowth,
            ],
            'chartData' => [
                'monthly' => $monthlyBookings,
                'status' => $bookingStatus,
            ],
            'recentBookings' => $recentBookings,
            'popularServices' => $popularServices,
        ]);
    }
}
