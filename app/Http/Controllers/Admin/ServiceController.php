<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('category')->latest()->get()->map(function ($service) {
            $service->image_url = $service->image ? asset('storage/' . $service->image) : null;
            return $service;
        });

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'categories' => Category::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_category' => 'required|exists:categories,id_category',
            'name' => 'required|string|max:100',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('services', 'public');
        }

        Service::create($validated);

        return redirect()->back()->with('success', 'Layanan berhasil ditambahkan');
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'id_category' => 'required|exists:categories,id_category',
            'name' => 'required|string|max:100',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'remove_image' => 'nullable',
        ]);

        // Handle image removal - check for string '1' or boolean true
        $shouldRemoveImage = $request->input('remove_image') === '1' || $request->input('remove_image') === true || $request->boolean('remove_image');
        
        if ($shouldRemoveImage) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = null;
        } elseif ($request->hasFile('image')) {
            // Delete old image and upload new one
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $validated['image'] = $request->file('image')->store('services', 'public');
        } else {
            // Keep existing image
            unset($validated['image']);
        }

        unset($validated['remove_image']);
        $service->update($validated);

        return redirect()->back()->with('success', 'Layanan berhasil diupdate');
    }

    public function destroy(Service $service)
    {
        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();

        return redirect()->back()->with('success', 'Layanan berhasil dihapus');
    }
}
