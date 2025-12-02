<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        return $request->wantsJson()
            ? new JsonResponse(['message' => 'Registration successful'], 201)
            : redirect('/customer/dashboard');
    }
}
