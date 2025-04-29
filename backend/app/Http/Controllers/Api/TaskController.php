<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\FormErrorController;

class TaskController extends Controller
{
    public function index()
    {
        $myTasks = auth()->user()->tasks;
        return response()->json([
            'status' => 'success',
            'tasks' => $myTasks,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_completed' => ['required', 'in:0,1'],
        ], [
            'title.required' => 'O campo título é obrigatório.',
            'title.string' => 'O campo título deve ser um texto.',
            'title.max' => 'O título não pode ter mais que :max caracteres.',
            'description.string' => 'A descrição deve ser um texto.',
            'description.max' => 'A descrição não pode ter mais que :max caracteres.',
            'is_completed.required' => 'O campo status é obrigatório.',
            'is_completed.in' => 'O status deve ser 0 (pendente) ou 1 (concluído).',
        ]);

        if ($validator->fails()) {
            return FormErrorController::validation($validator);
        }

        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não autenticado.',
            ], 401);
        }

        $newTask = Task::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => $request->is_completed,
        ]);

        return response()->json([
            'status' => 'success',
            'task' => $newTask,
        ], 201);


    }

    public function update(Request $request, Task $task)
    {

        $validator = Validator::make($request->all(), [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_completed' => ['required', 'in:0,1'],
        ], [
            'title.required' => 'O campo título é obrigatório.',
            'title.string' => 'O campo título deve ser um texto.',
            'title.max' => 'O título não pode ter mais que :max caracteres.',
            'description.string' => 'A descrição deve ser um texto.',
            'description.max' => 'A descrição não pode ter mais que :max caracteres.',
            'is_completed.required' => 'O campo status é obrigatório.',
            'is_completed.in' => 'O status deve ser 0 (pendente) ou 1 (concluído).',
        ]);

        if ($validator->fails()) {
            return FormErrorController::validation($validator);
        }

        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não autenticado.',
            ], 401);
        }

        if ($task->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Você não tem permissão para editar esta tarefa.',
            ], 403);
        }

        $task->update([
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => $request->is_completed,
        ]);

        return response()->json([
            'status' => 'success',
            'task' => $task,
        ]);

    }

    public function destroy(Task $task)
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não autenticado.',
            ], 401);
        }

        if ($task->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Você não tem permissão para editar esta tarefa.',
            ], 403);
        }   

        $task->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tarefa excluída com sucesso.',
        ], 204);
    }
}
