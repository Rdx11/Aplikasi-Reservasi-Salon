<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => Promotion::with('service')->latest()->get()->map(function ($promo) {
                return [
                    'id' => $promo->id,
                    'title' => $promo->title,
                    'description' => $promo->description,
                    'service_id' => $promo->service_id,
                    'service' => $promo->service,
                    'discount_percentage' => $promo->discount_percentage,
                    'discount_amount' => $promo->discount_amount,
                    'image' => $promo->image ? '/storage/' . $promo->image : null,
                    'start_date' => $promo->start_date,
                    'end_date' => $promo->end_date,
                    'is_active' => $promo->is_active,
                ];
            }),
            'services' => Service::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'service_id' => 'nullable|exists:services,id',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('promotions', 'public');
        }

        Promotion::create($validated);

        return redirect()->back()->with('success', 'Promosi berhasil ditambahkan');
    }

    public function update(Request $request, Promotion $promotion)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'service_id' => 'nullable|exists:services,id',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($promotion->image) {
                Storage::disk('public')->delete($promotion->image);
            }
            $validated['image'] = $request->file('image')->store('promotions', 'public');
        } else {
            unset($validated['image']);
        }

        $promotion->update($validated);

        return redirect()->back()->with('success', 'Promosi berhasil diupdate');
    }

    public function destroy(Promotion $promotion)
    {
        if ($promotion->image) {
            Storage::disk('public')->delete($promotion->image);
        }
        
        $promotion->delete();

        return redirect()->back()->with('success', 'Promosi berhasil dihapus');
    }
}
