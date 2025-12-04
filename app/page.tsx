import type React from "react"
import Link from "next/link"
import { Calendar, Clock, Users, Shield, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">SmartBookings</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Características
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Precios
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Gestiona tus citas de forma inteligente
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Sistema de reservaciones diseñado para consultorios, gimnasios, salones de belleza y talleres. Olvídate de
              las libretas y el WhatsApp.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registro">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Comenzar gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Todo lo que necesitas</h2>
            <p className="mt-4 text-muted-foreground text-lg">Herramientas diseñadas para simplificar tu día a día</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Calendario Interactivo"
              description="Visualiza y gestiona todas tus citas en un solo lugar con vista diaria, semanal y mensual."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Gestión de Clientes"
              description="Base de datos organizada con historial de citas y preferencias de cada cliente."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Reagendamiento Fácil"
              description="Mueve citas con un click y notifica automáticamente a tus clientes."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Roles y Permisos"
              description="Control de acceso para administradores y empleados con permisos diferenciados."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Deja de perder citas y tiempo valioso
              </h2>
              <ul className="mt-8 space-y-4">
                <BenefitItem text="Reduce las citas duplicadas en un 95%" />
                <BenefitItem text="Ahorra hasta 10 horas semanales en gestión" />
                <BenefitItem text="Mejora la satisfacción de tus clientes" />
                <BenefitItem text="Accede desde cualquier dispositivo" />
              </ul>
            </div>
            <div className="bg-secondary/10 rounded-2xl p-8 border border-border">
              <div className="aspect-video bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                <Calendar className="w-20 h-20 text-secondary-foreground opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Planes y Precios</h2>
            <p className="mt-4 text-muted-foreground text-lg">Elige el plan que mejor se adapte a tu negocio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Básico"
              price="Gratis"
              description="Perfecto para empezar"
              features={["Hasta 50 citas/mes", "1 usuario", "Calendario básico", "Soporte por email"]}
            />
            <PricingCard
              name="Profesional"
              price="$299"
              period="/mes"
              description="Para negocios en crecimiento"
              features={[
                "Citas ilimitadas",
                "Hasta 5 usuarios",
                "Calendario avanzado",
                "Recordatorios por email",
                "Reportes básicos",
                "Soporte prioritario",
              ]}
              highlighted
            />
            <PricingCard
              name="Empresarial"
              price="$599"
              period="/mes"
              description="Control total de tu negocio"
              features={[
                "Todo lo de Profesional",
                "Usuarios ilimitados",
                "API de integración",
                "Recordatorios WhatsApp",
                "Reportes avanzados",
                "Soporte 24/7",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Contáctanos</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                ¿Tienes dudas? Escríbenos y te responderemos lo antes posible
              </p>
            </div>
            <form className="space-y-6 bg-card p-8 rounded-2xl border border-border">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="business" className="block text-sm font-medium text-foreground mb-2">
                  Tipo de negocio
                </label>
                <select
                  id="business"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="consultorio">Consultorio médico</option>
                  <option value="gimnasio">Gimnasio</option>
                  <option value="salon">Salón de belleza</option>
                  <option value="taller">Taller mecánico</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3">
                Enviar mensaje
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">SmartBookings</span>
            </div>
            <p className="text-sidebar-foreground/70 text-sm">
              © 2025 SmartBookings. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors">
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
      <span className="text-foreground">{text}</span>
    </li>
  )
}

// Pricing Card Component
function PricingCard({
  name,
  price,
  period = "",
  description,
  features,
  highlighted = false,
}: {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <div
      className={`p-8 rounded-2xl border ${
        highlighted ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border bg-background"
      }`}
    >
      {highlighted && (
        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full mb-4">
          Más popular
        </span>
      )}
      <h3 className="text-xl font-bold text-foreground">{name}</h3>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/registro">
        <Button
          className={`w-full ${
            highlighted
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          }`}
        >
          Comenzar ahora
        </Button>
      </Link>
    </div>
  )
}
