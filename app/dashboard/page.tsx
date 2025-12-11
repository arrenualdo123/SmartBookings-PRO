import { Calendar, Users, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  {
    name: "Citas hoy",
    value: "0",
    change: "+2",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    name: "Clientes totales",
    value: "28",
    change: "+18",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    name: "Citas esta semana",
    value: "1",
    change: "-5",
    changeType: "negative" as const,
    icon: Clock,
  },
  {
    name: "Tasa de asistencia",
    value: "94%",
    change: "+3%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

const upcomingAppointments = [
  { id: 1, cliente: "Cristian Chavez", servicio: "Corte de cabello", hora: "09:00", estado: "confirmada" },
  { id: 2, cliente: "Salomon Arreola", servicio: "Corte de cabello", hora: "10:30", estado: "pendiente" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Bienvenido de vuelta. Aquí está el resumen de hoy.</p>
        </div>
        <Link href="/dashboard/citas/nueva">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Nueva cita</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.changeType === "positive" ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Próximas citas</CardTitle>
              <CardDescription>Citas programadas para hoy</CardDescription>
            </div>
            <Link href="/dashboard/citas">
              <Button variant="ghost" size="sm" className="text-primary">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-secondary">
                        {appointment.cliente
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{appointment.cliente}</p>
                      <p className="text-sm text-muted-foreground">{appointment.servicio}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-card-foreground">{appointment.hora}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        appointment.estado === "confirmada"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Acciones rápidas</CardTitle>
            <CardDescription>Tareas comunes de un vistazo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/citas/nueva" className="block">
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">Agendar nueva cita</p>
                  <p className="text-sm text-muted-foreground">Crear una reservación para un cliente</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/clientes/nuevo" className="block">
              <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg border border-secondary/20 hover:bg-secondary/10 transition-colors">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">Agregar cliente</p>
                  <p className="text-sm text-muted-foreground">Registrar un nuevo cliente en el sistema</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/calendario" className="block">
              <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg border border-accent/20 hover:bg-accent/10 transition-colors">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground">Ver calendario</p>
                  <p className="text-sm text-muted-foreground">Visualiza todas las citas del mes</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}