<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            'business_id' => 1,
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'business_id' => 1,
            'name' => 'Empleado Test',
            'email' => 'empleado@test.com',
            'password' => Hash::make('password'), 
            'role' => 'employe',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}