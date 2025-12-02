<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('category')
            ->where('is_active', true)
            ->get()
            ->map(function ($service) {
                $service->image_url = $service->image ? asset('storage/' . $service->image) : null;
                return $service;
            });

        return Inertia::render('Customer/Services/Index', [
            'categories' => Category::where('is_active', true)->get(),
            'services' => $services,
        ]);
    }

    public function show(Service $service)
    {
        $service->load('category');
        $service->image_url = $service->image ? asset('storage/' . $service->image) : null;

        $relatedServices = Service::where('category_id', $service->category_id)
            ->where('id', '!=', $service->id)
            ->where('is_active', true)
            ->take(4)
            ->get()
            ->map(function ($s) {
                $s->image_url = $s->image ? asset('storage/' . $s->image) : null;
                return $s;
            });

        return Inertia::render('Customer/Services/Show', [
            'service' => $service,
            'relatedServices' => $relatedServices,
        ]);
    }
}
