<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingConfirmation;
use App\Models\Cancellation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['user', 'service.category']);

        // Search by booking code, customer name, or service name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('service', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function confirm(Request $request, Booking $booking)
    {
        if ($booking->status !== 'pending') {
            return redirect()->back()->with('error', 'Booking tidak dapat dikonfirmasi');
        }

        $booking->update(['status' => 'confirmed']);

        BookingConfirmation::create([
            'id_booking' => $booking->id_booking,
            'id_user_confirmed_by' => auth()->id(),
            'confirmation_date' => now(),
        ]);

        return redirect()->back()->with('success', 'Booking berhasil dikonfirmasi');
    }

    public function cancel(Request $request, Booking $booking)
    {
        if (!in_array($booking->status, ['pending', 'confirmed'])) {
            return redirect()->back()->with('error', 'Booking tidak dapat dibatalkan');
        }

        $booking->update(['status' => 'cancelled']);

        Cancellation::create([
            'id_booking' => $booking->id_booking,
            'id_user_cancelled_by' => auth()->id(),
            'reason' => $request->input('reason', 'Dibatalkan oleh admin'),
            'cancelled_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Booking berhasil dibatalkan');
    }

    public function complete(Booking $booking)
    {
        if ($booking->status !== 'confirmed') {
            return redirect()->back()->with('error', 'Booking tidak dapat diselesaikan');
        }

        $booking->update(['status' => 'completed']);

        return redirect()->back()->with('success', 'Booking berhasil diselesaikan');
    }
}
