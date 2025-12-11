<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BusinessSeeder extends Seeder
{
    public function run()
    {
        DB::table('businesses')->insert([
            'id' => 1, 
            'name' => 'Consultorio Central PRO',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}