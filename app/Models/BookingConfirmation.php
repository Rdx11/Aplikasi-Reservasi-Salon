<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingConfirmation extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'confirmed_by',
        'confirmation_date',
        'payment_proof',
        'bank_name',
        'account_number',
        'account_name',
        'notes',
    ];

    protected $casts = [
        'confirmation_date' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function confirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}
