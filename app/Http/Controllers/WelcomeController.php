<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Promotion;
use App\Models\Service;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Welcome', [
            'categories' => Category::where('is_active', true)->get(),
            'services' => Service::with('category')->where('is_active', true)->take(6)->get()->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'price' => $service->price,
                    'duration' => $service->duration,
                    'image' => $service->image ? '/storage/' . $service->image : null,
                    'category' => $service->category,
                ];
            }),
            'promotions' => Promotion::with('service')
                ->activeToday()
                ->take(4)
                ->get()
                ->map(function ($promo) {
                    return [
                        'id' => $promo->id,
                        'title' => $promo->title,
                        'description' => $promo->description,
                        'discount_percentage' => $promo->discount_percentage,
                        'discount_amount' => $promo->discount_amount,
                        'image' => $promo->image ? '/storage/' . $promo->image : null,
                        'service_id' => $promo->service_id,
                        'service' => $promo->service ? [
                            'id' => $promo->service->id,
                            'name' => $promo->service->name,
                        ] : null,
                        'promo_date' => $promo->promo_date?->format('Y-m-d'),
                    ];
                }),
        ]);
    }
}
