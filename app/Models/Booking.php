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
    ];

    protected $casts = [
        'booking_date' => 'date',
        'total_price' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
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
