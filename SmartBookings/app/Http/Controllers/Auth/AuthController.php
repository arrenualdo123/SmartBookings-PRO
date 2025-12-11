<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth; // Importante para usar Auth::guard()

class AuthController extends Controller
{
    public function register(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6|confirmed',
        'role' => 'required|in:admin,employe',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    // Asegurar que existe un negocio con id=1
    $business = \App\Models\Business::firstOrCreate(
        ['id' => 1],
        ['name' => 'Default Business']
    );

    // Crear usuario
    $user = User::create([
        'business_id' => $business->id,
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $request->role,
    ]);

    return response()->json([
        'message' => 'User created successfully',
        'user' => $user
    ], 201);
}


    public function login()
    {
        $credentials = request(['email', 'password']);

        // CORRECCIÓN CLAVE: Usar auth('api') en lugar de auth()
        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        // CORRECCIÓN CLAVE: Usar auth('api') aquí también
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user(),
        ]);
    }
}