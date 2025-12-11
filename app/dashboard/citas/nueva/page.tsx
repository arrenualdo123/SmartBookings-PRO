"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, User, Briefcase, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

const clientes = [
  { id: 1, nombre: "Cristian Chavez" },
  { id: 2, nombre: "Salomon Arreola" },
  
]

const servicios = [
  { id: 1, nombre: "Corte de cabello", duracion: 30, precio: 200 },
  { id: 2, nombre: "Manicure", duracion: 45, precio: 150 },
  { id: 3, nombre: "Pedicure", duracion: 60, precio: 180 },
  { id: 4, nombre: "Tinte completo", duracion: 90, precio: 500 },
  { id: 5, nombre: "Tratamiento capilar", duracion: 120, precio: 400 },
  { id: 6, nombre: "Corte y barba", duracion: 45, precio: 250 },
]

const empleados = [
  { id: 1, nombre: "Athenea" },
  { id: 2, nombre: "Esmeralda Díaz" },
  { id: 3, nombre: "Linda Caicedo" },
]

const horasDisponibles = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

export default function NuevaCitaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: "",
    fecha: "",
    hora: "",
    empleado: "",
    notas: "",
  })

  const selectedServicio = servicios.find((s) => s.id.toString() === formData.servicio)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSuccess(true)

    // Redirect after success
    setTimeout(() => {
      router.push("/dashboard/citas")
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="bg-card border-border max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-card-foreground mb-2">Cita agendada</h2>
            <p className="text-muted-foreground">La cita ha sido creada exitosamente.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/citas">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Nueva cita</h1>
          <p className="text-muted-foreground mt-1">Completa la información para agendar</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Información de la cita</CardTitle>
            <CardDescription>Todos los campos marcados son obligatorios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-card-foreground">
                Cliente *
              </Label>
              <Select value={formData.cliente} onValueChange={(value) => setFormData({ ...formData, cliente: value })}>
                <SelectTrigger className="bg-input border-border">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Servicio */}
            <div className="space-y-2">
              <Label htmlFor="servicio" className="text-card-foreground">
                Servicio *
              </Label>
              <Select
                value={formData.servicio}
                onValueChange={(value) => setFormData({ ...formData, servicio: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {servicios.map((servicio) => (
                    <SelectItem key={servicio.id} value={servicio.id.toString()}>
                      {servicio.nombre} - {servicio.duracion} min - ${servicio.precio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedServicio && (
                <p className="text-sm text-muted-foreground">
                  Duración: {selectedServicio.duracion} minutos • Precio: ${selectedServicio.precio}
                </p>
              )}
            </div>

            {/* Fecha y Hora */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha" className="text-card-foreground">
                  Fecha *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fecha"
                    type="date"
                    className="pl-10 bg-input border-border"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora" className="text-card-foreground">
                  Hora *
                </Label>
                <Select value={formData.hora} onValueChange={(value) => setFormData({ ...formData, hora: value })}>
                  <SelectTrigger className="bg-input border-border">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Selecciona hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {horasDisponibles.map((hora) => (
                      <SelectItem key={hora} value={hora}>
                        {hora}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Empleado */}
            <div className="space-y-2">
              <Label htmlFor="empleado" className="text-card-foreground">
                Empleado asignado *
              </Label>
              <Select
                value={formData.empleado}
                onValueChange={(value) => setFormData({ ...formData, empleado: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecciona empleado" />
                </SelectTrigger>
                <SelectContent>
                  {empleados.map((empleado) => (
                    <SelectItem key={empleado.id} value={empleado.id.toString()}>
                      {empleado.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notas" className="text-card-foreground">
                Notas (opcional)
              </Label>
              <Textarea
                id="notas"
                placeholder="Agrega notas o instrucciones especiales..."
                className="bg-input border-border resize-none"
                rows={3}
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/dashboard/citas" className="flex-1">
                <Button type="button" variant="outline" className="w-full border-border bg-transparent">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={
                  isLoading ||
                  !formData.cliente ||
                  !formData.servicio ||
                  !formData.fecha ||
                  !formData.hora ||
                  !formData.empleado
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Agendar cita"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}