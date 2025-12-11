<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'business_id',
        'user_id',
        'client_name',
        'start_time',
        'end_time',
        'notes',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    // Relación con usuario (empleado)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación con negocio (multi-tenancy)
    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}
