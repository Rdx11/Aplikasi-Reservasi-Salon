<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Cancellation;
use App\Models\Promotion;
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

        // Get services with active promotions for today
        $services = Service::with('category')
            ->where('is_active', true)
            ->get()
            ->map(function ($service) {
                $promo = Promotion::getForService($service->id, now()->toDateString());
                if ($promo) {
                    $service->active_promo = [
                        'id' => $promo->id,
                        'title' => $promo->title,
                        'discount_percentage' => $promo->discount_percentage,
                        'discount_amount' => $promo->discount_amount,
                        'discounted_price' => $promo->calculateDiscountedPrice($service->price),
                    ];
                }
                return $service;
            });

        return Inertia::render('Customer/Bookings/Index', [
            'bookings' => $query->latest()->paginate(10)->withQueryString(),
            'services' => $services,
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
        $bookingDate = $validated['booking_date'];
        
        // Check for active promotion on booking date
        $promo = Promotion::getForService($service->id, $bookingDate);
        $totalPrice = $service->price;
        $promoId = null;
        
        if ($promo) {
            $totalPrice = $promo->calculateDiscountedPrice($service->price);
            $promoId = $promo->id;
        }

        $booking = Booking::create([
            'booking_code' => Booking::generateBookingCode(),
            'user_id' => auth()->id(),
            'service_id' => $validated['service_id'],
            'booking_date' => $bookingDate,
            'booking_time' => $validated['booking_time'],
            'notes' => $validated['notes'],
            'total_price' => $totalPrice,
            'original_price' => $service->price,
            'promotion_id' => $promoId,
            'status' => 'pending',
        ]);

        return redirect()->route('customer.bookings.index')
            ->with('success', "Booking berhasil dibuat! Kode booking Anda: {$booking->booking_code}");
    }

    public function show(Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Customer/Bookings/Show', [
            'booking' => $booking->load(['service.category', 'confirmation', 'cancellation', 'promotion']),
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

    public function uploadPayment(Request $request, Booking $booking)
    {
        if ($booking->user_id !== auth()->id()) {
            abort(403);
        }

        if ($booking->status !== 'confirmed') {
            return redirect()->back()->with('error', 'Bukti pembayaran hanya dapat diupload untuk booking yang sudah dikonfirmasi');
        }

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Delete old payment proof if exists
        if ($booking->payment_proof) {
            \Storage::disk('public')->delete($booking->payment_proof);
        }

        $path = $request->file('payment_proof')->store('payment-proofs', 'public');

        $booking->update([
            'payment_proof' => $path,
            'payment_uploaded_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil diupload');
    }
}
