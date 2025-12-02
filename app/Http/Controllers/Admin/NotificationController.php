<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function getNewBookings(Request $request)
    {
        $lastCheck = $request->input('last_check');
        
        // Query for new bookings since last check
        $query = Booking::with(['user', 'service'])
            ->where('status', 'pending');
        
        // If we have a last check time, only get bookings created after that
        if ($lastCheck) {
            try {
                $lastCheckTime = \Carbon\Carbon::parse($lastCheck);
                $query->where('created_at', '>', $lastCheckTime);
            } catch (\Exception $e) {
                // Invalid date format, ignore filter
            }
        }
        
        $newBookings = $query->latest()->limit(20)->get();
        
        // Get unread count (all pending bookings)
        $unreadCount = Booking::where('status', 'pending')->count();
        
        return response()->json([
            'bookings' => $newBookings->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'booking_code' => $booking->booking_code,
                    'customer_name' => $booking->user->name ?? 'Unknown',
                    'service_name' => $booking->service->name ?? 'Unknown',
                    'booking_date' => $booking->booking_date?->format('Y-m-d'),
                    'booking_time' => $booking->booking_time,
                    'total_price' => (float) $booking->total_price,
                    'created_at' => $booking->created_at->toISOString(),
                ];
            }),
            'unread_count' => $unreadCount,
            'server_time' => now()->toISOString(),
        ]);
    }

    public function markAsRead(Request $request)
    {
        return response()->json(['success' => true]);
    }
}
