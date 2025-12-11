"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"

// ======================================
// 🔹 Tipos
// ======================================
type AvailableHoursResponse = {
  date: string
  day_of_week: string
  available_times: string[]
}

// ======================================
// 🔹 Función para obtener horarios
// ======================================
async function getAvailableHours(date: string): Promise<AvailableHoursResponse> {
  const response = await axios.get<AvailableHoursResponse>("/available", {
    params: { date },
  })
  return response.data
}

// ======================================
// 🔹 Página
// ======================================
export default function NuevaCitaPage() {
  const searchParams = useSearchParams()
  const preselectedDate = searchParams.get("date") ?? ""

  const [availableHours, setAvailableHours] = useState<string[]>([])
  const [loadingHours, setLoadingHours] = useState(false)

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    servicio: "",
    fecha: preselectedDate,
    hora: "",
  })

  // ======================================
  // 🔹 Manejar cambios del formulario
  // ======================================
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // ======================================
  // ⭐ Cargar horarios dinámicos cuando cambia la fecha
  // ======================================
  useEffect(() => {
    if (!formData.fecha) return

    const fetchHours = async () => {
      try {
        setLoadingHours(true)
        const data = await getAvailableHours(formData.fecha)
        setAvailableHours(data.available_times)
      } catch (err) {
        console.error("Error cargando horarios disponibles:", err)
      } finally {
        setLoadingHours(false)
      }
    }

    fetchHours()
  }, [formData.fecha])

  // ======================================
  // 🔹 Envío del formulario
  // ======================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post("/appointments", formData)
      alert("Cita creada con éxito")
    } catch (err) {
      console.error("Error al crear cita:", err)
      alert("Hubo un error al crear la cita")
    }
  }

  // ======================================
  // UI
  // ======================================
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Nueva cita</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nombre */}
        <div>
          <label className="block mb-1">Nombre del cliente</label>
          <input
            className="w-full border p-2 rounded"
            value={formData.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
          />
        </div>

        {/* Servicio */}
        <div>
          <label className="block mb-1">Servicio</label>
          <input
            className="w-full border p-2 rounded"
            value={formData.servicio}
            onChange={(e) => updateField("servicio", e.target.value)}
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block mb-1">Fecha</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={formData.fecha}
            onChange={(e) => updateField("fecha", e.target.value)}
          />
        </div>

        {/* Horas dinámicas */}
        <div>
          <label className="block mb-1">Hora</label>

          <select
            className="w-full border p-2 rounded"
            value={formData.hora}
            onChange={(e) => updateField("hora", e.target.value)}
          >
            <option value="">Selecciona una hora</option>

            {loadingHours && (
              <option disabled>Cargando horarios...</option>
            )}

            {!loadingHours && availableHours.length === 0 && formData.fecha && (
              <option disabled>No hay horarios disponibles</option>
            )}

            {availableHours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full">
          Crear cita
        </Button>
      </form>
    </div>
  )
}
