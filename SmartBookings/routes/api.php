<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Available\AvailableController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Rutas públicas (auth)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});


/*
|--------------------------------------------------------------------------
| Rutas protegidas (JWT)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    // --- Auth ---
    Route::get('/auth/me', [AuthController::class, 'me']);   // ← CORREGIDO


    // --- Citas simples ---
    Route::get('/available', [AppointmentController::class, 'availableHours']);
    Route::post('/appointments', [AppointmentController::class, 'store']);

    // --- Otras rutas ---
    Route::get('/appointments/month', [AppointmentController::class, 'getByMonth']);
    Route::get('/appointments/available', [AppointmentController::class, 'available']);

    // Citas por usuario
    Route::get('/users/{user}/appointments', [AppointmentController::class, 'appointmentsByUser']);

    // CRUD principal (excepto store porque ya está arriba)
    Route::apiResource('appointments', AppointmentController::class)->except(['create', 'edit', 'store']);

    Route::get('/available-old', [AvailableController::class, 'index']);

    // --- Usuarios (solo admin) ---
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('users', UserController::class)->except(['create', 'edit']);
    });

    Route::get('/test', function () {
        return ['status' => 'ok'];
    });
});
