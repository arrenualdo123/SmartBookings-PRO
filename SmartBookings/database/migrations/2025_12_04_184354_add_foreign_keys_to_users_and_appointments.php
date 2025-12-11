<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Añadir la restricción a la tabla users (Esta es la que faltaba)
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('business_id')->references('id')->on('businesses')->onDelete('cascade');
        });

        // NOTA: Eliminamos la sección de 'appointments' porque sus foráneas ya existen.
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
        });
        
        // NOTA: Eliminamos la sección de 'appointments' de aquí también.
    }
};