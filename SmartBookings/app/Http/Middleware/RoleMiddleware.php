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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string $role El rol o roles permitidos (ej: 'admin' o 'admin|employe')
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // 1. Verificar si el usuario está autenticado (debería estarlo si pasa el middleware 'auth:api')
        if (!auth()->check()) {
            return response()->json(['error' => 'No autorizado. Se requiere iniciar sesión.'], 401);
        }

        // 2. Obtener los roles requeridos y verificar
        $roles_requeridos = explode('|', $role);
        
        // Comprobar si el rol del usuario está en la lista de roles requeridos
        if (!in_array(auth()->user()->role, $roles_requeridos)) {
            // Error de permiso denegado [cite: 108]
            return response()->json(['error' => 'Permiso denegado. Rol insuficiente.'], 403); 
        }

        return $next($request);
    }
}