<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingConfirmation extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'id_booking_confirmation';

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'id_booking_confirmation';
    }

    protected $fillable = [
        'id_booking',
        'id_user_confirmed_by',
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
        return $this->belongsTo(Booking::class, 'id_booking');
    }

    public function confirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user_confirmed_by');
    }
}
