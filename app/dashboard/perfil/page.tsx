"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell, Camera } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function PerfilPage() {
  const [perfil, setPerfil] = useState({
    nombre: "Admin",
    apellido: "Usuario",
    email: "admin@ejemplo.com",
    telefono: "555-1234",
    cargo: "Administrador",
  })

  const [notificaciones, setNotificaciones] = useState({
    emailCitas: true,
    emailCancelaciones: true,
    emailRecordatorios: false,
    pushCitas: true,
    pushCancelaciones: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y preferencias</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" />
            Datos personales
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="gap-2">
            <Lock className="h-4 w-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Tab: Datos personales */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>Actualiza tus datos de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/admin-user-avatar.png" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {perfil.nombre[0]}
                      {perfil.apellido[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-transparent"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {perfil.nombre} {perfil.apellido}
                  </h3>
                  <p className="text-muted-foreground">{perfil.cargo}</p>
                </div>
              </div>

              {/* Formulario */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={perfil.nombre}
                    onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={perfil.apellido}
                    onChange={(e) => setPerfil({ ...perfil, apellido: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    value={perfil.cargo}
                    onChange={(e) => setPerfil({ ...perfil, cargo: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-accent/90">Guardar cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Seguridad */}
        <TabsContent value="seguridad">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar contraseña</CardTitle>
              <CardDescription>Asegúrate de usar una contraseña segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actual">Contraseña actual</Label>
                <Input id="actual" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nueva">Nueva contraseña</Label>
                <Input id="nueva" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmar">Confirmar nueva contraseña</Label>
                <Input id="confirmar" type="password" />
              </div>
              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-accent/90">Actualizar contraseña</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sesiones activas</CardTitle>
              <CardDescription>Dispositivos donde has iniciado sesión</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Windows - Chrome</p>
                    <p className="text-sm text-muted-foreground">Ciudad de México • Activo ahora</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Sesión actual</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">iPhone - Safari</p>
                    <p className="text-sm text-muted-foreground">Ciudad de México • Hace 2 días</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Notificaciones */}
        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de notificaciones</CardTitle>
              <CardDescription>Configura cómo quieres recibir las notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Notificaciones por email</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nuevas citas</p>
                      <p className="text-sm text-muted-foreground">Recibe un email cuando se agende una cita</p>
                    </div>
                    <Switch
                      checked={notificaciones.emailCitas}
                      onCheckedChange={(checked) => setNotificaciones({ ...notificaciones, emailCitas: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cancelaciones</p>
                      <p className="text-sm text-muted-foreground">Recibe un email cuando se cancele una cita</p>
                    </div>
                    <Switch
                      checked={notificaciones.emailCancelaciones}
                      onCheckedChange={(checked) =>
                        setNotificaciones({ ...notificaciones, emailCancelaciones: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Recordatorios diarios</p>
                      <p className="text-sm text-muted-foreground">Resumen de citas del día siguiente</p>
                    </div>
                    <Switch
                      checked={notificaciones.emailRecordatorios}
                      onCheckedChange={(checked) =>
                        setNotificaciones({ ...notificaciones, emailRecordatorios: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Notificaciones push</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nuevas citas</p>
                      <p className="text-sm text-muted-foreground">Notificación instantánea de nuevas citas</p>
                    </div>
                    <Switch
                      checked={notificaciones.pushCitas}
                      onCheckedChange={(checked) => setNotificaciones({ ...notificaciones, pushCitas: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cancelaciones</p>
                      <p className="text-sm text-muted-foreground">Notificación instantánea de cancelaciones</p>
                    </div>
                    <Switch
                      checked={notificaciones.pushCancelaciones}
                      onCheckedChange={(checked) =>
                        setNotificaciones({ ...notificaciones, pushCancelaciones: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-accent/90">Guardar preferencias</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}