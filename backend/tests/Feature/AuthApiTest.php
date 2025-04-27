<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register',[
            'name' => 'Test User',
            'email' => 'teste@gmail.com',
            'password' => 'my_secure_password',
            'password_confirmation' => 'my_secure_password',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'status',
            'access_token',
            'token_type',
            'user' => [
                'id',
                'name',
                'email',
                'created_at',
                'updated_at'    
            ]
        ]);
    }

    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'password' => bcrypt('my_secure_password'),
        ]);
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'my_secure_password',
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'access_token',
            'token_type'
        ]);

    }

    public function test_login_wrog_credentials_fails()
    {
        $user = User::factory()->create([
            'password' => bcrypt('my_secure_password'),
        ]);
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong_password',
        ]);
        $response->assertStatus(401);

    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');
        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Logout realizado com sucesso.'
        ]);

    }
}
