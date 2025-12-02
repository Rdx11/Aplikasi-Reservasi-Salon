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
    public function index()
    {
        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => Booking::with(['user', 'service.category'])->latest()->get(),
        ]);
    }

    public function confirm(Request $request, Booking $booking)
    {
        if ($booking->status !== 'pending') {
            return redirect()->back()->with('error', 'Booking tidak dapat dikonfirmasi');
        }

        $booking->update(['status' => 'confirmed']);

        BookingConfirmation::create([
            'booking_id' => $booking->id,
            'confirmed_by' => auth()->id(),
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
            'booking_id' => $booking->id,
            'cancelled_by' => auth()->id(),
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
