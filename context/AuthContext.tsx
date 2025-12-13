"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

/* =============================
   TIPOS
============================= */
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee";
}

interface LoginResponse {
  access_token: string;
}

/* =============================
   CONTEXTO
============================= */
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {},
});

const API_URL = "http://127.0.0.1:8000/api";

/* =============================
   PROVIDER
============================= */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* =============================
     CARGAR TOKEN AL INICIAR
  ============================== */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  /* =============================
     USUARIO REAL DESDE BACKEND
  ============================== */
  const refreshUser = async () => {
    try {
      const res = await axios.get<User>( 
  `${API_URL}/auth/me`
);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.warn("Sesión inválida, limpiando auth");
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     LOGIN
  ============================== */
  const login = async (email: string, password: string) => {
   const res = await axios.post<LoginResponse>(
  `${API_URL}/auth/login`, 
  { email, password }
);

    const accessToken = res.data.access_token;

    setToken(accessToken);
    localStorage.setItem("token", accessToken);

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    await refreshUser();
  };

  /* =============================
     LOGOUT
  ============================== */
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =============================
   HOOK
============================= */
export const useAuth = () => useContext(AuthContext);