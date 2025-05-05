<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;

class GuestLoginTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_creates_a_guest_user_and_returns_a_token()
    {
        $response = $this->postJson('/api/guest-login');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'user' => ['id', 'name', 'email', 'created_at', 'updated_at'],
                     'token',
                     'token_type',
                 ]);

        $this->assertDatabaseCount('users', 1);

        $user = User::first();

        $this->assertStringContainsString('@guest.local', $user->email);
        $this->assertNotNull($response->json('token'));
    }

    #[Test]
    public function it_creates_unique_guest_emails()
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/guest-login')->assertStatus(200);
        }

        $emails = User::pluck('email')->toArray();
        $this->assertCount(5, array_unique($emails));
    }
}
