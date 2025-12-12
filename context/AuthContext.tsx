//AuthContext
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
    role: "admin" | "employe";
}

interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: async () => {
        throw new Error("login not implemented");
    },
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario y token del storage al iniciar
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);

            axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<User> => {
        const res = await axios.post<LoginResponse>("http://127.0.0.1:8000/api/auth/login", {
            email,
            password,
        });

        const userData = res.data.user;
        const token = res.data.access_token;

        // Guardar estado
        setUser(userData);
        setToken(token);

        // Guardar en localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);

        // Configurar axios con nuevo token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return userData;
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        delete axios.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


