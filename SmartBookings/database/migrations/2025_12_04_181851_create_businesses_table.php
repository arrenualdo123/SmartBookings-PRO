<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id(); // SERIAL PRIMARY KEY
            $table->string('name');
            $table->timestamps(); // created_at y updated_at
        });
    }
    
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
