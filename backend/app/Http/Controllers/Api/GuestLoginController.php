<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class GuestLoginController extends Controller
{
    public function login(Request $request)
    {
        $name = 'Visitante';

        // Garante um e-mail único usando UUID
        $email = 'guest_' . Str::uuid() . '@guest.local';

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make(Str::random(16)),
        ]);

        $token = $user->createToken('guest-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }
}

