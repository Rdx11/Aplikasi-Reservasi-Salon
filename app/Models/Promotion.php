<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Promotion extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'id_promotion';

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'id_promotion';
    }

    protected $fillable = [
        'title',
        'description',
        'id_service',
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
        return $this->belongsTo(Service::class, 'id_service');
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
                $q->where('id_service', $serviceId)
                  ->orWhereNull('id_service'); // Promo untuk semua layanan
            })
            ->orderByRaw('id_service IS NULL') // Prioritaskan promo spesifik
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
