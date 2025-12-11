// lib/axios.ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URI ?? "http://127.0.0.1:8000/api";

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
});

// Si tu frontend guarda token JWT en localStorage:
instance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (err) => Promise.reject(err));

export default instance;
