<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     */
    protected $primaryKey = 'id_service';

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'id_service';
    }

    protected $fillable = [
        'id_category',
        'name',
        'description',
        'price',
        'duration',
        'image',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'id_category');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'id_service');
    }

    public function promotions(): HasMany
    {
        return $this->hasMany(Promotion::class, 'id_service');
    }
}
