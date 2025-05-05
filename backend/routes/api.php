<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\GuestLoginController;
use App\Http\Controllers\Api\ForgotPasswordController;

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/guest-login', [GuestLoginController::class, 'login'])->name('guest.login');
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink'])->name('password.forgot');
Route::post('/reset-password/{token}', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

