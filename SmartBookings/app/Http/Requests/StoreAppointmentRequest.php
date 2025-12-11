<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize()
    {
        return Auth::check();
    }

    public function rules()
    {
        $appointmentId = $this->route('appointment'); // null si es creación

        return [

            // --- DATOS BÁSICOS ---
            'client_name' => 'required|string|max:255',

            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(function ($query) {
                    return $query->where('business_id', Auth::user()->business_id);
                }),
            ],

            'notes' => 'nullable|string',

            // --- VALIDACIÓN DE HORARIOS ---
            'start_time' => [
                'required',
                'date',
                'after_or_equal:now',
                Rule::unique('appointments')->where(function ($query) use ($appointmentId) {

                    $query->where('user_id', $this->user_id);

                    // Verificar solapamiento
                    $query->where(function ($q) {
                        $q->whereBetween('start_time', [$this->start_time, $this->end_time])
                          ->orWhereBetween('end_time', [$this->start_time, $this->end_time])
                          ->orWhere(function ($q2) {
                              $q2->where('start_time', '<', $this->start_time)
                                 ->where('end_time', '>', $this->end_time);
                          });
                    });

                    // Ignorar la cita actual si estamos editando
                    if ($appointmentId) {
                        $query->where('id', '!=', $appointmentId);
                    }
                }),
            ],

            'end_time' => [
                'required',
                'date',
                'after:start_time',
            ],
        ];
    }

    public function messages()
    {
        return [
            'start_time.unique' => 'El horario solicitado se solapa con una cita existente para este empleado.',
            'user_id.exists' => 'El empleado seleccionado no existe o no pertenece a tu negocio.',
            'end_time.after' => 'La hora de finalización debe ser posterior a la hora de inicio.',
        ];
    }
}
