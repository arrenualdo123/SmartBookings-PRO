"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Clock, User, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import axios from "@/lib/axios"

// =============================
// Tipos
// =============================
type Appointment = {
  id: number
  client_name: string
  service: string
  start_time: string
  end_time: string
  status: "confirmada" | "pendiente" | "cancelada"
}

type DayAppointments = {
  [key: number]: Appointment[]
}

// =============================
// Constantes UI
// =============================
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MONTHS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
]

// =============================
// Página
// =============================
export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [view, setView] = useState<"mes" | "semana">("mes")

  // Citas reales
  const [appointments, setAppointments] = useState<DayAppointments>({})

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1   // Backend requiere 1–12

  const jsMonth = currentDate.getMonth()     // Para UI

  const today = new Date()
  const isCurrentMonth = today.getMonth() === jsMonth && today.getFullYear() === year

  // =============================
  // Cargar citas desde backend
  // =============================
 const loadAppointments = async () => {
  try {
    const response = await axios.get("/api/appointments/month", {
      params: { year, month }
    })

    const data = response.data as Appointment[]

    const byDay: DayAppointments = {}

    data.forEach(event => {
      const day = new Date(event.start_time).getDate()
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(event)
    })

    setAppointments(byDay)

  } catch (error) {
    console.error("Error cargando citas:", error)
  }
}


  useEffect(() => {
    loadAppointments()
  }, [year, month])

  // =============================
  // Navegación
  // =============================
  const firstDayOfMonth = new Date(year, jsMonth, 1).getDay()
  const daysInMonth = new Date(year, jsMonth + 1, 0).getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, jsMonth - 1, 1))
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, jsMonth + 1, 1))
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(today.getDate())
  }

  // =============================
  // Construcción de días
  // =============================
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const getAppointmentsForDay = (day: number): Appointment[] => {
    return appointments[day] || []
  }

  const selectedAppointments = selectedDate ? getAppointmentsForDay(selectedDate) : []

  // =============================
  // UI (SIN TOCAR NADA )
  // =============================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Calendario</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus citas de forma visual</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={goToToday} className="border-border bg-transparent">
            Hoy
          </Button>
          <Link href="/dashboard/citas/nueva">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nueva cita
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-xl text-card-foreground">
                {MONTHS[jsMonth]} {year}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Days header */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const dayAppointments = getAppointmentsForDay(day)
                const isToday = isCurrentMonth && day === today.getDate()
                const isSelected = day === selectedDate

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square p-1 rounded-lg transition-colors relative ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isToday
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                    }`}
                  >
                    <span className="text-sm font-medium">{day}</span>

                    {dayAppointments.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayAppointments.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-primary-foreground" : "bg-primary"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detail panel */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              {selectedDate ? `${selectedDate} de ${MONTHS[jsMonth]}` : "Selecciona un día"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {selectedDate ? (
              selectedAppointments.length > 0 ? (
                <div className="space-y-3">
                  {selectedAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-3 rounded-lg border ${
                        appointment.status === "cancelada"
                          ? "bg-destructive/5 border-destructive/20"
                          : appointment.status === "pendiente"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-primary/5 border-primary/20"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-card-foreground">
                            {new Date(appointment.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Reagendar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Cancelar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-card-foreground">{appointment.client_name}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1">{appointment.service}</p>

                      <span
                        className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                          appointment.status === "confirmada"
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "pendiente"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No hay citas para este día</p>
                  <Link href="/dashboard/citas/nueva">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Agendar cita
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Selecciona un día del calendario para ver las citas
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
