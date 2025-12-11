<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AppointmentController extends Controller
{
    public function index()
    {
        // Devuelve SOLO citas del negocio del usuario autenticado
        $appointments = Appointment::where('business_id', Auth::user()->business_id)
            ->with('user')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $appointments
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id'      => 'required|exists:users,id',
            'client_name'  => 'required|string|max:255',
            'start_time'   => 'required|date',
            'end_time'     => 'required|date|after:start_time',
            'notes'        => 'nullable|string',
        ]);

        $businessId = Auth::user()->business_id;

        // SOLAPAMIENTO
        $overlap = Appointment::where('business_id', $businessId)
            ->where('user_id', $request->user_id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function ($q) use ($request) {
                          $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                      });
            })
            ->exists();

        if ($overlap) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Este horario se solapa con otra cita existente.'
            ], Response::HTTP_CONFLICT); 
        }

        // CREAR CITA
        $appointment = Appointment::create([
            'business_id' => $businessId,
            'user_id'     => $request->user_id,
            'client_name' => $request->client_name,
            'start_time'  => $request->start_time,
            'end_time'    => $request->end_time,
            'notes'       => $request->notes,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $appointment
        ], Response::HTTP_CREATED);
    }

    public function show(Appointment $appointment)
    {
        return response()->json([
            'status' => 'success',
            'data' => $appointment->load('user')
        ]);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $request->validate([
            'client_name'  => 'sometimes|string|max:255',
            'start_time'   => 'sometimes|date',
            'end_time'     => 'sometimes|date|after:start_time',
            'notes'        => 'nullable|string',
            'user_id'      => 'sometimes|exists:users,id'
        ]);

        // SI CAMBIA HORARIO → revisar solapamiento
        if ($request->start_time || $request->end_time || $request->user_id) {

            $user  = $request->user_id ?? $appointment->user_id;
            $start = $request->start_time ?? $appointment->start_time;
            $end   = $request->end_time ?? $appointment->end_time;

            $overlap = Appointment::where('business_id', Auth::user()->business_id)
                ->where('user_id', $user)
                ->where('id', '!=', $appointment->id)
                ->where(function ($query) use ($start, $end) {
                    $query->whereBetween('start_time', [$start, $end])
                          ->orWhereBetween('end_time', [$start, $end])
                          ->orWhere(function ($q) use ($start, $end) {
                              $q->where('start_time', '<=', $start)
                                ->where('end_time', '>=', $end);
                          });
                })
                ->exists();

            if ($overlap) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Este horario se solapa con otra cita existente.'
                ], Response::HTTP_CONFLICT);
            }
        }

        $appointment->update($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $appointment
        ]);
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment deleted'
        ]);
    }

    // 🔥 MÉTODO QUE FALTABA (la ruta existía en tu api.php)
    public function appointmentsByUser($userId)
    {
        $appointments = Appointment::where('user_id', $userId)
            ->where('business_id', Auth::user()->business_id)
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $appointments
        ]);
    }

    public function available(Request $request)
{
    $request->validate([
        'date' => 'required|date'
    ]);

    $date = Carbon::parse($request->date);
    $dayOfWeek = $date->dayOfWeek; // 0=Domingo, 1=Lunes ... 6=Sábado

    // ================================
    // HORARIOS por DÍA DE LA SEMANA
    // ================================
    switch ($dayOfWeek) {
        case 0: // Domingo
            return response()->json([]); // Cerrado
        case 6: // Sábado
            $workStart = "10:00";
            $workEnd   = "14:00";
            break;
        default: // Lunes a Viernes
            $workStart = "09:00";
            $workEnd   = "18:00";
    }

    $intervalMinutes = 30;

    $start = Carbon::parse($date->format('Y-m-d') . " " . $workStart);
    $end   = Carbon::parse($date->format('Y-m-d') . " " . $workEnd);

    // ================================
    // Obtener citas existentes del día
    // ================================
    $existing = Appointment::whereDate('start_time', $date)
        ->get()
        ->map(function ($a) {
            return [
                'start' => Carbon::parse($a->start_time),
                'end'   => Carbon::parse($a->end_time)
            ];
        });

    // ================================
    // Calcular huecos disponibles
    // ================================
    $available = [];
    $cursor = $start->copy();

    while ($cursor < $end) {
        $slotStart = $cursor->copy();
        $slotEnd = $cursor->copy()->addMinutes($intervalMinutes);

        $isFree = true;

        foreach ($existing as $event) {
            if (
                ($slotStart >= $event['start'] && $slotStart < $event['end']) ||
                ($slotEnd > $event['start'] && $slotEnd <= $event['end'])
            ) {
                $isFree = false;
                break;
            }
        }

        if ($isFree) {
            $available[] = [
                "start" => $slotStart->format("H:i"),
                "end"   => $slotEnd->format("H:i"),
            ];
        }

        $cursor->addMinutes($intervalMinutes);
    }

    return response()->json($available);
}

public function getByMonth(Request $request)
{
    $request->validate([
        'year' => 'required|integer',
        'month' => 'required|integer|min:1|max:12',
    ]);

    $year = $request->year;
    $month = $request->month;

    $appointments = Appointment::whereYear('start_time', $year)
        ->whereMonth('start_time', $month)
        ->get();

    return response()->json($appointments);
}

}
