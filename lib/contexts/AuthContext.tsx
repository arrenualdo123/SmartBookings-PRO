"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// 1. Definir la forma de los datos del usuario y del contexto
interface User {
  nombre: string
  email: string
  rol: "admin" | "employee"
  negocio: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User, token: string) => void
  logout: () => void
  isLoading: boolean
}

// 2. Crear el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 3. Crear el componente Proveedor (AuthProvider)
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Para manejar el estado de carga inicial

  useEffect(() => {
    // Al cargar la aplicación, intentar recuperar los datos del usuario desde localStorage
    try {
      const storedToken = localStorage.getItem("token")
      const storedRole = localStorage.getItem("userRole") as User["rol"]

      // Aquí, en una aplicación real, decodificarías el token para obtener los datos del usuario
      // o harías una petición a un endpoint /me para obtener los datos del usuario.
      // Por ahora, simularemos que tenemos algunos datos si el rol existe.
      if (storedToken && storedRole) {
        setUser({
          nombre: "Usuario", // Debería venir del token o una API
          email: "usuario@ejemplo.com", // Debería venir del token o una API
          rol: storedRole,
          negocio: "Mi Negocio", // Debería venir del token o una API
        })
      }
    } catch (error) {
      console.error("Error al cargar los datos de autenticación:", error)
      // En caso de error, nos aseguramos de que el usuario no esté logueado
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: User, token: string) => {
    // Guardar en el estado y en localStorage
    setUser(userData)
    localStorage.setItem("token", token)
    localStorage.setItem("userRole", userData.rol)
  }

  const logout = () => {
    // Limpiar el estado y localStorage
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    // Opcional: Redirigir al login
    window.location.href = '/login';
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 4. Crear un hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
