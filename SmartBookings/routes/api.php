<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\Available\AvailableController;
use App\Http\Controllers\UserController;

Route::group(['middleware' => 'api', 'prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']); 
    Route::post('login', [AuthController::class, 'login']);
});

Route::middleware('auth:api')->group(function () {

    Route::get('/appointments/month', [AppointmentController::class, 'getByMonth']);
    Route::get('/appointments/available', [AppointmentController::class, 'available']);
    
    // Citas por usuario (método agregado)
    Route::get('users/{user}/appointments', [AppointmentController::class, 'appointmentsByUser']);

    // CRUD de citas
    Route::apiResource('appointments', AppointmentController::class);

    Route::get('/available', [AvailableController::class, 'index']);

    // CRUD de usuarios (solo admin)
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('users', UserController::class)->except(['create', 'edit']);
    });

    // Ruta de prueba
    Route::get('test', function () {
        return ['status' => 'ok'];
    });
});
