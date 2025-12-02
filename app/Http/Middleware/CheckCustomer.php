<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCustomer
{
    /**
     * Handle an incoming request.
     * Block admin users from accessing customer routes.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->hasRole('Admin')) {
            // Redirect admin to admin dashboard
            return redirect('/admin/dashboard')->with('error', 'Admin tidak dapat mengakses halaman customer');
        }

        return $next($request);
    }
}
