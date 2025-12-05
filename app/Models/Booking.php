<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'user_id',
        'service_id',
        'booking_date',
        'booking_time',
        'status',
        'notes',
        'total_price',
        'original_price',
        'promotion_id',
        'payment_proof',
        'payment_uploaded_at',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'total_price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'payment_uploaded_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class);
    }

    public function hasPromo(): bool
    {
        return $this->promotion_id !== null;
    }

    public function confirmation(): HasOne
    {
        return $this->hasOne(BookingConfirmation::class);
    }

    public function cancellation(): HasOne
    {
        return $this->hasOne(Cancellation::class);
    }

    public static function generateBookingCode(): string
    {
        return 'BK' . date('Ymd') . strtoupper(substr(uniqid(), -4));
    }
}
