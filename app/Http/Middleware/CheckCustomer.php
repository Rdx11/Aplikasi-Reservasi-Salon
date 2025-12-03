<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCustomer
{
    /**
     * Handle an incoming request.
     * Block admin and owner users from accessing customer routes.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->hasRole(['Admin', 'Owner'])) {
            // Redirect admin/owner to admin dashboard
            return redirect('/admin/dashboard')->with('error', 'Anda tidak dapat mengakses halaman customer');
        }

        return $next($request);
    }
}
