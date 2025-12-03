<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = auth()->user();

        // Admin and Owner go to admin dashboard
        if ($user->hasRole(['Admin', 'Owner'])) {
            $home = '/admin/dashboard';
        } else {
            // Customer goes to customer dashboard
            $home = '/customer/dashboard';
        }

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect()->intended($home);
    }
}
