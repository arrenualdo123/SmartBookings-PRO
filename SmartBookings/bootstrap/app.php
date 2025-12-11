<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // COMENTA O ELIMINA ESTA LÍNEA SI USAS JWT (TYMON) Y NO SANCTUM COOKIES
        // Esta línea es la que activa la protección CSRF para APIs "stateful"
        // $middleware->api(prepend: [
        //     \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ]);

        // ---------------------------------------------------------
        // SOLUCIÓN AL ERROR 419 (CSRF)
        // ---------------------------------------------------------
        // Aquí es donde se excluyen las rutas en Laravel 11/12
        $middleware->validateCsrfTokens(except: [
            'api/auth/*', // Excluir registro, login, etc.
            'api/*',      // Opcional: Excluir toda la API si es 100% JWT
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();