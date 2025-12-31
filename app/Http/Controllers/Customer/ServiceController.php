<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Promotion;
use App\Models\Service;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();
        
        $services = Service::with('category')
            ->where('is_active', true)
            ->get()
            ->map(function ($service) use ($today) {
                $service->image_url = $service->image ? asset('storage/' . $service->image) : null;
                
                // Check for active promo today
                $promo = Promotion::getForService($service->id_service, $today);
                if ($promo) {
                    $service->active_promo = [
                        'id' => $promo->id_promotion,
                        'title' => $promo->title,
                        'discount_percentage' => $promo->discount_percentage,
                        'discount_amount' => $promo->discount_amount,
                        'discounted_price' => $promo->calculateDiscountedPrice($service->price),
                    ];
                }
                
                return $service;
            });

        return Inertia::render('Customer/Services/Index', [
            'categories' => Category::where('is_active', true)->get(),
            'services' => $services,
        ]);
    }

    public function show(Service $service)
    {
        $today = now()->toDateString();
        
        $service->load('category');
        $service->image_url = $service->image ? asset('storage/' . $service->image) : null;
        
        // Check for active promo today
        $promo = Promotion::getForService($service->id_service, $today);
        if ($promo) {
            $service->active_promo = [
                'id' => $promo->id_promotion,
                'title' => $promo->title,
                'discount_percentage' => $promo->discount_percentage,
                'discount_amount' => $promo->discount_amount,
                'discounted_price' => $promo->calculateDiscountedPrice($service->price),
            ];
        }

        $relatedServices = Service::where('id_category', $service->id_category)
            ->where('id_service', '!=', $service->id_service)
            ->where('is_active', true)
            ->take(4)
            ->get()
            ->map(function ($s) use ($today) {
                $s->image_url = $s->image ? asset('storage/' . $s->image) : null;
                
                // Check for active promo today
                $promo = Promotion::getForService($s->id_service, $today);
                if ($promo) {
                    $s->active_promo = [
                        'id' => $promo->id_promotion,
                        'title' => $promo->title,
                        'discount_percentage' => $promo->discount_percentage,
                        'discount_amount' => $promo->discount_amount,
                        'discounted_price' => $promo->calculateDiscountedPrice($s->price),
                    ];
                }
                
                return $s;
            });

        return Inertia::render('Customer/Services/Show', [
            'service' => $service,
            'relatedServices' => $relatedServices,
        ]);
    }
}
