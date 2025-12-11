// lib/api/appointment.ts
import apiClient from "@/lib/api/client";

export interface Appointment {
  id: number;
  client_name: string;
  start_time: string;
  end_time: string;
  notes?: string;
  user_id: number;
  business_id: number;
}

// Obtener citas
export async function getAppointments(): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>("/appointments");
  return response.data;
}

// Crear cita
export async function createAppointment(payload: Partial<Appointment>) {
  const response = await apiClient.post("/appointments", payload);
  return response.data;
}

// Actualizar cita
export async function updateAppointment(id: number, payload: Partial<Appointment>) {
  const response = await apiClient.put(`/appointments/${id}`, payload);
  return response.data;
}

// Eliminar cita
export async function deleteAppointment(id: number) {
  const response = await apiClient.delete(`/appointments/${id}`);
  return response.data;
}

// 🔥 NUEVO: obtener horarios disponibles desde backend
export async function getAvailableHours(date: string) {
  const response = await apiClient.get(`/available?date=${date}`);
  return response.data;
}
