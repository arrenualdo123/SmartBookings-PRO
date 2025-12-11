<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Listar citas del negocio
     */
    public function index()
    {
        $appointments = Appointment::where('business_id', Auth::user()->business_id)
            ->with('user')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $appointments
        ]);
    }

    /**
     * Crear cita
     */
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

        // Validar SOLAPAMIENTO
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
                'status' => 'error',
                'message' => 'Este horario se solapa con otra cita existente.'
            ], Response::HTTP_CONFLICT);
        }

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

    /**
     * Ver una cita
     */
    public function show(Appointment $appointment)
    {
        return response()->json([
            'status' => 'success',
            'data' => $appointment->load('user')
        ]);
    }

    /**
     * Actualizar cita
     */
    public function update(Request $request, Appointment $appointment)
    {
        $request->validate([
            'client_name'  => 'sometimes|string|max:255',
            'start_time'   => 'sometimes|date',
            'end_time'     => 'sometimes|date|after:start_time',
            'notes'        => 'nullable|string',
            'user_id'      => 'sometimes|exists:users,id'
        ]);

        // revisa solapamiento si cambia horario/usuario
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

    /**
     * Eliminar cita
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment deleted'
        ]);
    }

    /**
     * Citas por usuario (ruta: /users/{user}/appointments)
     */
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

    /**
     * Horarios disponibles para un día
     * /appointments/available?date=2025-02-10
     */
    public function available(Request $request)
    {
        $request->validate([
            'date' => 'required|date'
        ]);

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek; // 0=Dom, 1=Lun...6=Sab

        // Horario según día
        switch ($dayOfWeek) {
            case 0: // Domingo
                return response()->json([]);
            case 6: // Sábado
                $workStart = "10:00";
                $workEnd   = "14:00";
                break;
            default: // Lunes–Viernes
                $workStart = "09:00";
                $workEnd   = "18:00";
        }

        $intervalMinutes = 30;

        $start = Carbon::parse($date->format('Y-m-d') . " " . $workStart);
        $end   = Carbon::parse($date->format('Y-m-d') . " " . $workEnd);

        // Citas existentes del día
        $existing = Appointment::whereDate('start_time', $date)
            ->get()
            ->map(function ($a) {
                return [
                    'start' => Carbon::parse($a->start_time),
                    'end'   => Carbon::parse($a->end_time)
                ];
            });

        // Calcular huecos disponibles
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

    /**
     * Todas las citas de un mes (para el calendario mensual)
     */
    public function getByMonth(Request $request)
    {
        $request->validate([
            'year'  => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $appointments = Appointment::where('business_id', Auth::user()->business_id)
            ->whereYear('start_time', $request->year)
            ->whereMonth('start_time', $request->month)
            ->get();

        return response()->json($appointments);
    }
}
