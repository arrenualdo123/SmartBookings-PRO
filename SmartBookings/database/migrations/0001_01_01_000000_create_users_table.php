<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ----------------------------------------------------
        // MIGRACIÓN DE USERS (AÑADIENDO business_id Y role)
        // ----------------------------------------------------
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // *** Multi-Tenancy: business_id (Llave Foránea a la tabla businesses) ***
            // La migración de 'businesses' debe tener una marca de tiempo anterior a esta.
            $table->unsignedBigInteger('business_id'); 
            
            // *** Autorización: role (admin o employe) ***
            $table->enum('role', ['admin', 'employe'])->default('employe');

            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
        
        // Las siguientes tablas (password_reset_tokens y sessions) no necesitan cambios
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    // ... (down method sigue igual)
};