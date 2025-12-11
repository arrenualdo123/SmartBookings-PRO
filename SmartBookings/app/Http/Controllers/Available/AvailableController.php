<?php

namespace App\Http\Controllers\Available;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AvailableController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date'); // formato YYYY-MM-DD

        if (!$date) {
            return response()->json(['error' => 'Missing date'], 400);
        }

        $day = Carbon::parse($date)->format('N'); // 1 = lunes ... 7 = domingo

        // HORARIOS POR DÍA
        // Lunes a Viernes
        if ($day >= 1 && $day <= 5) {
            $start = "09:00";
            $end   = "17:00";
        }
        // Sábado
        else if ($day == 6) {
            $start = "10:00";
            $end   = "14:00";
        }
        // Domingo — CERRADO
        else if ($day == 7) {
            return response()->json([
                'date' => $date,
                'available_hours' => [],
                'message' => 'Cerrado domingo'
            ]);
        }

        // Generar intervalos de 1h, modifica si quieres 30min →
        $interval = 60;

        $hours = [];
        $current = Carbon::parse("$date $start");
        $limit   = Carbon::parse("$date $end");

        while ($current < $limit) {
            $hours[] = $current->format('H:i');
            $current->addMinutes($interval);
        }

        return response()->json([
            'date' => $date,
            'available_hours' => $hours
        ]);
    }
}
