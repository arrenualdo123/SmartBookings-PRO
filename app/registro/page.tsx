"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Eye, EyeOff, Loader2, Mail, Lock, User, Building2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FormData = {
  nombre: string
  email: string
  password: string
  confirmPassword: string
  negocio: string
  tipoNegocio: string
}

type FormErrors = Partial<FormData>

export default function RegistroPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    negocio: "",
    tipoNegocio: "",
  })

  const validateStep1 = () => {
    const newErrors: FormErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.email) {
      newErrors.email = "El correo es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un correo válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: FormErrors = {}

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (!formData.negocio.trim()) {
      newErrors.negocio = "El nombre del negocio es requerido"
    }

    if (!formData.tipoNegocio) {
      newErrors.tipoNegocio = "Selecciona el tipo de negocio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep2()) return

    setIsLoading(true)

    // Simular registro
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    router.push("/dashboard")
  }

  const passwordStrength = () => {
    const { password } = formData
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strengthColors = ["bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-primary"]
  const strengthLabels = ["Débil", "Regular", "Buena", "Fuerte"]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sidebar-primary rounded-xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-sidebar-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-sidebar-foreground">SmartBookings</span>
        </div>

        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight text-balance">
            Empieza a gestionar tus citas hoy
          </h1>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sidebar-foreground/80">
              <CheckCircle className="w-6 h-6 text-sidebar-primary" />
              <span>Calendario interactivo incluido</span>
            </li>
            <li className="flex items-center gap-3 text-sidebar-foreground/80">
              <CheckCircle className="w-6 h-6 text-sidebar-primary" />
              <span>Gestión de múltiples empleados</span>
            </li>
            <li className="flex items-center gap-3 text-sidebar-foreground/80">
              <CheckCircle className="w-6 h-6 text-sidebar-primary" />
              <span>Recordatorios automáticos</span>
            </li>
            <li className="flex items-center gap-3 text-sidebar-foreground/80">
              <CheckCircle className="w-6 h-6 text-sidebar-primary" />
              <span>Prueba gratuita por 14 días</span>
            </li>
          </ul>
        </div>

        <p className="text-sidebar-foreground/50 text-sm">© 2025 SmartBookings</p>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="space-y-2 text-center">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-card-foreground">Crear cuenta</CardTitle>
            <CardDescription className="text-muted-foreground">
              Paso {step} de 2 - {step === 1 ? "Información personal" : "Configuración del negocio"}
            </CardDescription>

            {/* Progress indicator */}
            <div className="flex gap-2 pt-2">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-card-foreground">
                      Nombre completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="nombre"
                        type="text"
                        placeholder="Tu nombre"
                        className={`pl-10 bg-input border-border text-card-foreground placeholder:text-muted-foreground ${errors.nombre ? "border-destructive" : ""}`}
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </div>
                    {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-card-foreground">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@correo.com"
                        className={`pl-10 bg-input border-border text-card-foreground placeholder:text-muted-foreground ${errors.email ? "border-destructive" : ""}`}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-card-foreground">
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 bg-input border-border text-card-foreground placeholder:text-muted-foreground ${errors.password ? "border-destructive" : ""}`}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-card-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${
                                i < passwordStrength() ? strengthColors[passwordStrength() - 1] : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Fuerza: {strengthLabels[passwordStrength() - 1] || "Muy débil"}
                        </p>
                      </div>
                    )}
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-card-foreground">
                      Confirmar contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 bg-input border-border text-card-foreground placeholder:text-muted-foreground ${errors.confirmPassword ? "border-destructive" : ""}`}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="negocio" className="text-card-foreground">
                      Nombre del negocio
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="negocio"
                        type="text"
                        placeholder="Mi Negocio"
                        className={`pl-10 bg-input border-border text-card-foreground placeholder:text-muted-foreground ${errors.negocio ? "border-destructive" : ""}`}
                        value={formData.negocio}
                        onChange={(e) => setFormData({ ...formData, negocio: e.target.value })}
                      />
                    </div>
                    {errors.negocio && <p className="text-sm text-destructive">{errors.negocio}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoNegocio" className="text-card-foreground">
                      Tipo de negocio
                    </Label>
                    <Select
                      value={formData.tipoNegocio}
                      onValueChange={(value) => setFormData({ ...formData, tipoNegocio: value })}
                    >
                      <SelectTrigger
                        className={`bg-input border-border text-card-foreground ${errors.tipoNegocio ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultorio">Consultorio médico</SelectItem>
                        <SelectItem value="gimnasio">Gimnasio</SelectItem>
                        <SelectItem value="salon">Salón de belleza</SelectItem>
                        <SelectItem value="taller">Taller mecánico</SelectItem>
                        <SelectItem value="spa">Spa / Bienestar</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tipoNegocio && <p className="text-sm text-destructive">{errors.tipoNegocio}</p>}
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continuar
                </Button>
              ) : (
                <div className="flex gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-border text-card-foreground"
                  >
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      "Crear cuenta"
                    )}
                  </Button>
                </div>
              )}

              <p className="text-sm text-muted-foreground text-center">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Inicia sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
