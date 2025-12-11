"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Clock, Bell, Users, Plus, Trash2, Save } from "lucide-react"

export default function ConfiguracionPage() {
  const [negocio, setNegocio] = useState({
    nombre: "Mi Negocio",
    tipo: "salon",
    direccion: "Calle Principal 123",
    telefono: "555-1234",
    email: "contacto@minegocio.com",
  })

  const [horarios, setHorarios] = useState([
    { dia: "Lunes", activo: true, inicio: "09:00", fin: "18:00" },
    { dia: "Martes", activo: true, inicio: "09:00", fin: "18:00" },
    { dia: "Miércoles", activo: true, inicio: "09:00", fin: "18:00" },
    { dia: "Jueves", activo: true, inicio: "09:00", fin: "18:00" },
    { dia: "Viernes", activo: true, inicio: "09:00", fin: "18:00" },
    { dia: "Sábado", activo: true, inicio: "10:00", fin: "14:00" },
    { dia: "Domingo", activo: false, inicio: "00:00", fin: "00:00" },
  ])

  const [servicios, setServicios] = useState([
    { id: 1, nombre: "Corte de cabello", duracion: 30, precio: 150 },
    { id: 2, nombre: "Tinte", duracion: 90, precio: 450 },
    { id: 3, nombre: "Manicure", duracion: 45, precio: 200 },
  ])

  const [notificaciones, setNotificaciones] = useState({
    emailConfirmacion: true,
    emailRecordatorio: true,
    recordatorioHoras: "24",
  })

  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", duracion: 30, precio: 0 })

  const toggleDia = (index: number) => {
    const nuevosHorarios = [...horarios]
    nuevosHorarios[index].activo = !nuevosHorarios[index].activo
    setHorarios(nuevosHorarios)
  }

  const actualizarHorario = (index: number, campo: "inicio" | "fin", valor: string) => {
    const nuevosHorarios = [...horarios]
    nuevosHorarios[index][campo] = valor
    setHorarios(nuevosHorarios)
  }

  const agregarServicio = () => {
    if (nuevoServicio.nombre && nuevoServicio.precio > 0) {
      setServicios([...servicios, { ...nuevoServicio, id: Date.now() }])
      setNuevoServicio({ nombre: "", duracion: 30, precio: 0 })
    }
  }

  const eliminarServicio = (id: number) => {
    setServicios(servicios.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Configuración</h1>
        <p className="text-muted-foreground">Administra tu negocio y preferencias</p>
      </div>

      <Tabs defaultValue="negocio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="negocio" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Negocio</span>
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Horarios</span>
          </TabsTrigger>
          <TabsTrigger value="servicios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Servicios</span>
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alertas</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Información del Negocio */}
        <TabsContent value="negocio">
          <Card>
            <CardHeader>
              <CardTitle>Información del Negocio</CardTitle>
              <CardDescription>Datos generales de tu establecimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del negocio</Label>
                  <Input
                    id="nombre"
                    value={negocio.nombre}
                    onChange={(e) => setNegocio({ ...negocio, nombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de negocio</Label>
                  <Select value={negocio.tipo} onValueChange={(value) => setNegocio({ ...negocio, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salon">Salón de belleza</SelectItem>
                      <SelectItem value="consultorio">Consultorio médico</SelectItem>
                      <SelectItem value="gimnasio">Gimnasio</SelectItem>
                      <SelectItem value="taller">Taller mecánico</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={negocio.direccion}
                    onChange={(e) => setNegocio({ ...negocio, direccion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={negocio.telefono}
                    onChange={(e) => setNegocio({ ...negocio, telefono: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email de contacto</Label>
                  <Input
                    id="email"
                    type="email"
                    value={negocio.email}
                    onChange={(e) => setNegocio({ ...negocio, email: e.target.value })}
                  />
                </div>
              </div>
              <Button className="bg-accent hover:bg-accent/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Horarios */}
        <TabsContent value="horarios">
          <Card>
            <CardHeader>
              <CardTitle>Horarios de Atención</CardTitle>
              <CardDescription>Configura los días y horas de servicio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {horarios.map((horario, index) => (
                <div
                  key={horario.dia}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <Switch checked={horario.activo} onCheckedChange={() => toggleDia(index)} />
                    <span className={`font-medium ${!horario.activo ? "text-muted-foreground" : ""}`}>
                      {horario.dia}
                    </span>
                  </div>
                  {horario.activo && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={horario.inicio}
                        onChange={(e) => actualizarHorario(index, "inicio", e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">a</span>
                      <Input
                        type="time"
                        value={horario.fin}
                        onChange={(e) => actualizarHorario(index, "fin", e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                  {!horario.activo && <span className="text-muted-foreground text-sm">Cerrado</span>}
                </div>
              ))}
              <Button className="bg-accent hover:bg-accent/90 mt-4">
                <Save className="mr-2 h-4 w-4" />
                Guardar horarios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Servicios */}
        <TabsContent value="servicios">
          <Card>
            <CardHeader>
              <CardTitle>Servicios</CardTitle>
              <CardDescription>Administra los servicios que ofreces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {servicios.map((servicio) => (
                  <div
                    key={servicio.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{servicio.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {servicio.duracion} min • ${servicio.precio}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => eliminarServicio(servicio.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Agregar nuevo servicio</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Nombre del servicio</Label>
                    <Input
                      placeholder="Ej: Corte de cabello"
                      value={nuevoServicio.nombre}
                      onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duración (min)</Label>
                    <Input
                      type="number"
                      value={nuevoServicio.duracion}
                      onChange={(e) =>
                        setNuevoServicio({ ...nuevoServicio, duracion: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio ($)</Label>
                    <Input
                      type="number"
                      value={nuevoServicio.precio}
                      onChange={(e) =>
                        setNuevoServicio({ ...nuevoServicio, precio: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <Button onClick={agregarServicio} className="mt-4 bg-accent hover:bg-accent/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar servicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Notificaciones */}
        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura los recordatorios por email (AWS SES)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Email de confirmación</p>
                  <p className="text-sm text-muted-foreground">Enviar email al cliente cuando se confirma una cita</p>
                </div>
                <Switch
                  checked={notificaciones.emailConfirmacion}
                  onCheckedChange={(checked) => setNotificaciones({ ...notificaciones, emailConfirmacion: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Email de recordatorio</p>
                  <p className="text-sm text-muted-foreground">Enviar recordatorio antes de la cita</p>
                </div>
                <Switch
                  checked={notificaciones.emailRecordatorio}
                  onCheckedChange={(checked) => setNotificaciones({ ...notificaciones, emailRecordatorio: checked })}
                />
              </div>

              {notificaciones.emailRecordatorio && (
                <div className="space-y-2">
                  <Label>Enviar recordatorio con anticipación de:</Label>
                  <Select
                    value={notificaciones.recordatorioHoras}
                    onValueChange={(value) => setNotificaciones({ ...notificaciones, recordatorioHoras: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora antes</SelectItem>
                      <SelectItem value="2">2 horas antes</SelectItem>
                      <SelectItem value="12">12 horas antes</SelectItem>
                      <SelectItem value="24">24 horas antes</SelectItem>
                      <SelectItem value="48">48 horas antes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button className="bg-accent hover:bg-accent/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}