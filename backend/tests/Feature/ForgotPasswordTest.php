<?php

namespace Tests\Feature;

use App\Mail\ForgotPasswordMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ForgotPasswordTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_sends_a_reset_link_email()
    {
        Mail::fake();

        $user = User::factory()->create();

        $response = $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
        ]);

        Mail::assertSent(ForgotPasswordMail::class);
    }

    #[Test]
    public function it_resets_the_password_with_a_valid_token()
    {
        $user = User::factory()->create();

        $token = Str::random(64);
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => bcrypt($token),
            'created_at' => now(),
        ]);

        $response = $this->postJson('/api/reset-password/' . $token, [
            'password' => 'novasenha123',
            'password_confirmation' => 'novasenha123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
        ]);

        $this->assertTrue(Hash::check('novasenha123', $user->fresh()->password));
    }

    #[Test]
    public function it_fails_to_reset_with_invalid_token()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/reset-password/tokeninvalido', [
            'password' => 'qualquercoisa',
            'password_confirmation' => 'qualquercoisa',
        ]);

        $response->assertStatus(400);
        $response->assertJson([
            'status' => 'error',
            'message' => 'Token inválido ou expirado.',
        ]);
    }
}
