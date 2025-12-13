"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Users,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calendario", href: "/dashboard/calendario", icon: Calendar },
  { name: "Citas", href: "/dashboard/citas", icon: Clock },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users },
  { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout, loading } = useAuth();

  if (loading) return null;

  const safeUser = {
    name: user?.name ?? "Usuario",
    email: user?.email ?? "correo@ejemplo.com",
    role: user?.role ?? "employee",
    business: "Mi Negocio",
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            SmartBookings
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transition-transform duration-300 lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              SmartBookings
            </span>
            <p className="text-xs text-sidebar-foreground/60">
              {safeUser.business}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="p-3 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent">
                <UserCircle className="w-8 h-8 text-sidebar-foreground" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-sidebar-foreground">
            {safeUser.name}
            </p>
            <p className="text-xs capitalize text-sidebar-foreground/70">
            {safeUser.role}
             </p>

                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{safeUser.name}</p>
                <p className="text-xs text-muted-foreground">
                  {safeUser.email}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/dashboard/perfil">
                  <UserCircle className="w-4 h-4 mr-2" />
                  Mi perfil
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
