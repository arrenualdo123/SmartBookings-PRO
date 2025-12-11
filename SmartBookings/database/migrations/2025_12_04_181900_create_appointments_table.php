<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            // Llaves foráneas para Multi-Tenancy y Empleado (usando la estructura de tu SQL)
            $table->foreignId('business_id')->constrained('businesses')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');

            $table->string('client_name');
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->text('notes')->nullable();
            
            // Índice para evitar solapamiento (opcional pero bueno)
            $table->index(['user_id', 'start_time', 'end_time']);
            
            $table->timestamps();
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};