<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'employee'    => $this->whenLoaded('employee', function () {
                return [
                    'id'    => $this->employee->id,
                    'name'  => $this->employee->name,
                    'email' => $this->employee->email
                ];
            }),
            'client_name' => $this->client_name,
            'schedule'    => $this->formatSchedule(),
            'notes'       => $this->notes,
            'created_at'  => $this->created_at?->format('Y-m-d H:i'),
            'updated_at'  => $this->updated_at?->format('Y-m-d H:i'),
        ];
    }

    /**
     * Formatea el horario de la cita de forma legible.
     *
     * Ejemplo: "15 Feb 2026, 10:00 - 11:00"
     */
    private function formatSchedule()
    {
        if (!$this->start_time || !$this->end_time) {
            return null;
        }

        $start = Carbon::parse($this->start_time);
        $end   = Carbon::parse($this->end_time);

        return sprintf(
            "%s, %s - %s",
            $start->format('d M Y'),
            $start->format('H:i'),
            $end->format('H:i')
        );
    }
}
