<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all(['id', 'name', 'email', 'role']);
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => ['required', Rule::in(['admin', 'employe'])],
        ]);

        $user = User::create([
            'business_id' => Auth::user()->business_id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json(['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role], 201);
    }

    public function show(User $user)
    {
        return response()->json(['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role]);
    }
}