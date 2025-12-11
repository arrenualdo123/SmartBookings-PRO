"use client"

import { useState } from "react"
import { Search, Plus, Filter, MoreHorizontal, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

type Cita = {
  id: number
  cliente: string
  servicio: string
  fecha: string
  hora: string
  duracion: number
  estado: "confirmada" | "pendiente" | "cancelada" | "completada"
  empleado: string
}

const citas: Cita[] = [
  {
    id: 1,
    cliente: "Cristian Chavez",
    servicio: "Corte de cabello",
    fecha: "2025-12-02",
    hora: "09:00",
    duracion: 30,
    estado: "confirmada",
    empleado: "Athenea",
  },
  {
    id: 2,
    cliente: "Salomon Arreola",
    servicio: "Corte de cabello",
    fecha: "2025-12-02",
    hora: "10:30",
    duracion: 45,
    estado: "pendiente",
    empleado: "Esmeralda Díaz",
  },
]

const estadoStyles = {
  confirmada: "bg-green-100 text-green-700",
  pendiente: "bg-yellow-100 text-yellow-700",
  cancelada: "bg-red-100 text-red-700",
  completada: "bg-blue-100 text-blue-700",
}

const estadoLabels = {
  confirmada: "Confirmada",
  pendiente: "Pendiente",
  cancelada: "Cancelada",
  completada: "Completada",
}

export default function CitasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")

  const filteredCitas = citas.filter((cita) => {
    const matchesSearch =
      cita.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cita.servicio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEstado = filtroEstado === "todos" || cita.estado === filtroEstado
    return matchesSearch && matchesEstado
  })

  // Group by date
  const groupedCitas = filteredCitas.reduce(
    (acc, cita) => {
      if (!acc[cita.fecha]) {
        acc[cita.fecha] = []
      }
      acc[cita.fecha].push(cita)
      return acc
    },
    {} as Record<string, Cita[]>,
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (dateStr === today.toISOString().split("T")[0]) {
      return "Hoy"
    } else if (dateStr === tomorrow.toISOString().split("T")[0]) {
      return "Mañana"
    }
    return date.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Citas</h1>
          <p className="text-muted-foreground mt-1">Gestiona todas las reservaciones</p>
        </div>
        <Link href="/dashboard/citas/nueva">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Nueva cita
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o servicio..."
                className="pl-9 bg-input border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full sm:w-48 bg-input border-border">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="confirmada">Confirmadas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="completada">Completadas</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-6">
        {Object.entries(groupedCitas)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([fecha, citasDelDia]) => (
            <div key={fecha}>
              <h2 className="text-lg font-semibold text-foreground mb-3 capitalize">{formatDate(fecha)}</h2>
              <div className="space-y-3">
                {citasDelDia.map((cita) => (
                  <Card key={cita.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 text-center">
                            <p className="text-lg font-bold text-card-foreground">{cita.hora}</p>
                            <p className="text-xs text-muted-foreground">{cita.duracion} min</p>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-card-foreground">{cita.cliente}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{cita.servicio}</p>
                            <p className="text-xs text-muted-foreground mt-1">Atendido por: {cita.empleado}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-3 py-1 rounded-full ${estadoStyles[cita.estado]}`}>
                            {estadoLabels[cita.estado]}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Reagendar</DropdownMenuItem>
                              {cita.estado === "pendiente" && <DropdownMenuItem>Confirmar</DropdownMenuItem>}
                              {cita.estado !== "completada" && cita.estado !== "cancelada" && (
                                <DropdownMenuItem className="text-destructive">Cancelar</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

        {Object.keys(groupedCitas).length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No se encontraron citas</p>
              <Link href="/dashboard/citas/nueva">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Agendar nueva cita
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}