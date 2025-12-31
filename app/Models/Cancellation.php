<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cancellation extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'id_cancellation';

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'id_cancellation';
    }

    protected $fillable = [
        'id_booking',
        'id_user_cancelled_by',
        'reason',
        'cancelled_at',
    ];

    protected $casts = [
        'cancelled_at' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'id_booking');
    }

    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user_cancelled_by');
    }
}
