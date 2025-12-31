<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'id_booking';

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'id_booking';
    }

    protected $fillable = [
        'booking_code',
        'id_user',
        'id_service',
        'booking_date',
        'booking_time',
        'status',
        'notes',
        'total_price',
        'original_price',
        'id_promotion',
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
        return $this->belongsTo(User::class, 'id_user');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'id_service');
    }

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class, 'id_promotion');
    }

    public function hasPromo(): bool
    {
        return $this->id_promotion !== null;
    }

    public function confirmation(): HasOne
    {
        return $this->hasOne(BookingConfirmation::class, 'id_booking');
    }

    public function cancellation(): HasOne
    {
        return $this->hasOne(Cancellation::class, 'id_booking');
    }

    public static function generateBookingCode(): string
    {
        return 'BK' . date('Ymd') . strtoupper(substr(uniqid(), -4));
    }
}
