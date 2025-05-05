<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\ForgotPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use App\Models\User;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $validated['email'])->first();
        $token = Password::createToken($user);

        // Apenas o token na URL
        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token;

        try {
            Mail::to($user->email)->send(new ForgotPasswordMail($resetUrl));

            return response()->json([
                'status' => 'success',
                'message' => 'E-mail de redefinição enviado com sucesso.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro ao enviar o e-mail.',
            ], 500);
        }
    }

    public function resetPassword(Request $request, $token)
    {
        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        // Como os tokens são criptografados, precisamos verificar um por um
        $record = collect(DB::table('password_reset_tokens')->get())
            ->first(fn ($r) => Hash::check($token, $r->token));

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token inválido ou expirado.'
            ], 400);
        }

        $user = User::where('email', $record->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não encontrado.'
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->setRememberToken(Str::random(60));
        $user->save();

        // Invalida o token
        DB::table('password_reset_tokens')->where('email', $user->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Senha redefinida com sucesso.'
        ], 200);
    }
}
