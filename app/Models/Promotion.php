<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'service_id',
        'discount_percentage',
        'discount_amount',
        'image',
        'promo_date',
        'is_active',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'promo_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeActiveOnDate($query, $date)
    {
        return $query->where('is_active', true)
            ->whereDate('promo_date', $date);
    }

    public function scopeActiveToday($query)
    {
        return $query->activeOnDate(now()->toDateString());
    }

    /**
     * Get active promotion for a service on a specific date
     */
    public static function getForService($serviceId, $date)
    {
        return static::where('is_active', true)
            ->whereDate('promo_date', $date)
            ->where(function ($q) use ($serviceId) {
                $q->where('service_id', $serviceId)
                  ->orWhereNull('service_id'); // Promo untuk semua layanan
            })
            ->orderByRaw('service_id IS NULL') // Prioritaskan promo spesifik
            ->first();
    }

    /**
     * Calculate discounted price
     */
    public function calculateDiscountedPrice($originalPrice)
    {
        if ($this->discount_percentage) {
            return $originalPrice - ($originalPrice * $this->discount_percentage / 100);
        }
        
        if ($this->discount_amount) {
            return max(0, $originalPrice - $this->discount_amount);
        }

        return $originalPrice;
    }
}
