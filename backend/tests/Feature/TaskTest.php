<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;


class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_tasks()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Task::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'tasks' => [
                         '*' => [
                             'id',
                             'user_id',
                             'title',
                             'description',
                             'is_completed',
                             'created_at',
                             'updated_at',
                         ],
                     ],
                 ]);
    }

    public function test_user_can_create_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $taskData = [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(2),
            'is_completed' => 0,
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(201)
                 ->assertJsonFragment([
                     'title' => $taskData['title'],
                     'description' => $taskData['description'],
                     'is_completed' => $taskData['is_completed'],
                 ])
                 ->assertJsonStructure([
                     'status',
                     'task' => [
                         'id',
                         'user_id',
                         'title',
                         'description',
                         'is_completed',
                         'created_at',
                         'updated_at',
                     ],
                 ]);

        $this->assertDatabaseHas('tasks', [
            'title' => $taskData['title'],
            'description' => $taskData['description'],
            'is_completed' => $taskData['is_completed'],
        ]);
    }

    public function test_user_can_update_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $task = Task::factory()->create([
            'user_id' => $user->id,
        ]);

        $updateData = [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraph(1),
            'is_completed' => true,
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'title' => $updateData['title'],
                     'description' => $updateData['description'],
                     'is_completed' => $updateData['is_completed'],
                 ])
                 ->assertJsonStructure([
                     'status',
                     'task' => [
                         'id',
                         'user_id',
                         'title',
                         'description',
                         'is_completed',
                         'created_at',
                         'updated_at',
                     ],
                 ]);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => $updateData['title'],
            'description' => $updateData['description'],
            'is_completed' => $updateData['is_completed'],
        ]);
    }

    public function test_user_can_delete_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $task = Task::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }
}
