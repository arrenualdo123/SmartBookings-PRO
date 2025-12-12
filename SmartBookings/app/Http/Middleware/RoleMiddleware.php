<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles  Ejemplo: "admin" o "admin|employee"
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        // ⛔ Si no está autenticado
        if (!auth()->check()) {
            return response()->json([
                'error' => 'No autorizado. Se requiere iniciar sesión.',
            ], 401);
        }

        $user = auth()->user();

        // ⛔ Si el usuario no tiene campo "role"
        if (!isset($user->role)) {
            return response()->json([
                'error' => 'El usuario no tiene rol asignado.',
            ], 403);
        }

        // Roles permitidos (pueden venir varios: "admin|employee")
        $allowedRoles = explode('|', $roles);

        // ⛔ Verificar si el rol del usuario está permitido
        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'error' => 'Permiso denegado. Rol insuficiente.',
                'required_roles' => $allowedRoles,
                'user_role' => $user->role,
            ], 403);
        }

        // ✅ Todo OK, continuar
        return $next($request);
    }
}
