//login.tsx
"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { loginAction } from "./actions"

// 👇 función para llamar al backend REAL usando el token
async function fetchUser() {
  const token = localStorage.getItem("token")
  if (!token) return null

  const res = await fetch("http://localhost:8000/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  })

  if (!res.ok) return null

  return await res.json()
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!formData.email) {
      newErrors.email = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    // 🔥 LOGIN BACKEND
    const response = await loginAction(new FormData(e.target as HTMLFormElement))

    if (!response.ok) {
      setIsLoading(false)

      if (response.status === 401) {
        setErrors({ general: "Credenciales incorrectas" })
        return
      }

      setErrors({ general: response.data?.message || "Error al iniciar sesión" })
      return
    }

    // 🔥 Guardar token
    const token = response.data?.access_token
    if (token) {
      localStorage.setItem("token", token)
    }

    // 🔥 Obtener usuario REAL desde backend
    const user = await fetchUser()

    if (!user) {
      setErrors({ general: "Error obteniendo datos del usuario" })
      setIsLoading(false)
      return
    }

    // Guardar usuario en localStorage (incluye nombre, email, role, id)
    localStorage.setItem("user", JSON.stringify(user))

    setIsLoading(false)

    // Redirigir al dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sidebar-primary rounded-xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-sidebar-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-sidebar-foreground">SmartBookings</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight text-balance">
            Gestiona tu negocio de forma inteligente
          </h1>
          <p className="text-sidebar-foreground/70 text-lg">
            Únete a miles de negocios que ya optimizaron su gestión de citas.
          </p>
        </div>

        <p className="text-sidebar-foreground/50 text-sm">© 2025 SmartBookings PRO</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">

              {errors.general && (
                <p className="text-sm text-destructive text-center">{errors.general}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@correo.com"
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando...</> : "Iniciar Sesión"}
              </Button>

              <p className="text-sm text-center">
                ¿No tienes una cuenta?{" "}
                <Link href="/registro" className="text-primary hover:underline">
                  Regístrate gratis
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}




