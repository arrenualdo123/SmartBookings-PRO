"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, MoreHorizontal, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import axios from "@/lib/axios"

type Cita = {
  id: number
  nombre: string
  servicio: string
  fecha: string
  hora: string
  duracion: number
  estado: string
  empleado?: string
}

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")

  // ======================================
  //  Cargar citas desde el backend
  // ======================================
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const resp = await axios.get("/appointments")
        setCitas((resp.data as any).data ?? resp.data) // por si usas Resource o json directo
      } catch (err) {
        console.error(err)
        setError("Error al cargar citas")
      } finally {
        setLoading(false)
      }
    }

    fetchCitas()
  }, [])

  // ======================================
  //  Filtrado
  // ======================================
  const filteredCitas = citas.filter((cita) => {
    const matchesSearch =
      cita.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cita.servicio?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesEstado = filtroEstado === "todos" || cita.estado === filtroEstado

    return matchesSearch && matchesEstado
  })

  // ======================================
  // 🔹 Agrupar por fecha
  // ======================================
  const groupedCitas = filteredCitas.reduce((acc, cita) => {
    if (!acc[cita.fecha]) acc[cita.fecha] = []
    acc[cita.fecha].push(cita)
    return acc
  }, {} as Record<string, Cita[]>)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })
  }

  // ======================================
  // UI
  // ======================================
  if (loading) return <p>Cargando citas...</p>
  if (error) return <p className="text-red-500">{error}</p>

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

      {/* Lista de citas */}
      <div className="space-y-6">
        {Object.entries(groupedCitas).map(([fecha, citasDelDia]) => (
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
                            <span className="font-medium text-card-foreground">{cita.nombre}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{cita.servicio}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {cita.estado}
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
                            <DropdownMenuItem className="text-destructive">Cancelar</DropdownMenuItem>
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
