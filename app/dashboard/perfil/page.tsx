"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell } from "lucide-react"

export default function PerfilPage() {
  const { user, loading } = useAuth()

  const [perfil, setPerfil] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cargo: "",
  })

  useEffect(() => {
    if (user) {
      setPerfil({
        nombre: user.name,
        apellido: "",
        email: user.email,
        cargo: user.role === "admin" ? "Administrador" : "Empleado",
      })
    }
  }, [user])

  if (loading) return null
  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Mi Perfil</h1>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal"><User className="w-4 h-4 mr-2" />Datos</TabsTrigger>
          <TabsTrigger value="seguridad"><Lock className="w-4 h-4 mr-2" />Seguridad</TabsTrigger>
          <TabsTrigger value="notificaciones"><Bell className="w-4 h-4 mr-2" />Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>Datos de tu cuenta</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {perfil.nombre.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{perfil.nombre}</p>
                  <p className="text-muted-foreground">{perfil.cargo}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Nombre</Label>
                  <Input value={perfil.nombre} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={perfil.email} disabled />
                </div>
                <div className="md:col-span-2">
                  <Label>Rol</Label>
                  <Input value={perfil.cargo} disabled />
                </div>
              </div>

              <Button disabled>Guardar cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
