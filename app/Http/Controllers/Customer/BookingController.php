<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Cancellation;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['service.category'])
            ->where('user_id', auth()->id());

        // Search by booking code or service name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                  ->orWhereHas('service', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return Inertia::render('Customer/Bookings/Index', [
            'bookings' => $query->latest()->paginate(10)->withQueryString(),
            'services' => Service::with('category')
                ->where('is_active', true)
                ->get(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'booking_time' => 'required',
            'notes' => 'nullable|string',
        ]);

        $service = Service::findOrFail($validated['service_id']);

        Booking::create([
            'booking_code' => Booking::generateBookingCode(),
            'user_id' => auth()->id(),
            'service_id' => $validated['service_id'],
            'booking_date' => $validated['booking_date'],
            'booking_time' => $validated['booking_time'],
            'notes' => $validated['notes'],
            'total_price' => $service->price,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Booking berhasil dibuat');
    }

    public function show(Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Customer/Bookings/Show', [
            'booking' => $booking->load(['service.category', 'confirmation', 'cancellation']),
        ]);
    }

    public function cancel(Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        if ($booking->status !== 'pending') {
            return redirect()->back()->with('error', 'Booking tidak dapat dibatalkan');
        }

        $booking->update(['status' => 'cancelled']);

        Cancellation::create([
            'booking_id' => $booking->id,
            'cancelled_by' => auth()->id(),
            'reason' => 'Dibatalkan oleh pelanggan',
            'cancelled_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Booking berhasil dibatalkan');
    }
}
