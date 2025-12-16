Sistema pensado para negocios como consultorios, gimnasios, salones de belleza o talleres mecánicos que necesitan un control centralizado de citas donde las reservaciones se llevan en WhatsApp y libretas, lo que causa citas duplicadas, tiempos muertos y mala organización.

Backend: Jese Arreola, laravel


Fase 1 – Infraestructura (20 horas)
Jese  (Backend / Infra):
Configuración del repositorio Git
Ramas: main, develop, feature
.gitignore principal
README base del proyecto
Crear cuenta AWS (si no existe)
IAM con permisos restringidos
Crear RDS PostgreSQL
Probar conexión desde backend
Crear bucket S3 para el frontend
Configuración inicial del bucket
Verificar que se pueda subir un archivo ejemplo (HTML)

Fase 2 – Desarrollo Backend (25 horas)  (Jese)
Crear proyecto backend (Node/Laravel/Spring)
Endpoints:
POST /api/auth/register
POST /api/auth/login
GET /api/appointments
POST /api/appointments
PUT /api/appointments/:id
DELETE /api/appointments/:id
GET /api/users/:id/appointments
Validaciones
JWT + roles
Manejo de errores
Multi-tenancy
Conexión a RDS
Variables de entorno
Swagger/OpenAPI

Fase 3 – Desarrollo Frontend (20 horas) (Cristian)
Interfaz de Usuario Reactiva
o Login/Registro con
validación en tiempo real
o Dashboard con roles
diferenciados
o Calendario interactivo
(biblioteca externa
permitida)
o Formularios con feedback
visual

2. Principios de Usabilidad:
o Navegación intuitiva
o Mensajes de confirmación
o Estados de carga/error
o Diseño responsive básico

Fase 4 - Despliegue y DevOps (15 horas) primera parte Cristian segunda parte Jese
1. Despliegue en AWS
o Frontend: S3 + CloudFront
con HTTPS
o Backend: Elastic Beanstalk
(simplifica operaciones)
o Configuración de CORS
o Documentación de
despliegue

3. Automatización Básica:
o Script de despliegue
frontend (deploy-
frontend.sh)
o Variables de entorno en
Elastic Beanstalk




SmartBookings - Guía de Prueba de APIs
📋 Descripción General
Esta guía explica cómo probar todas las rutas del backend (Laravel) desde el frontend deployado en Elastic Beanstalk. Incluye ejemplos prácticos, capturas de pantalla y respuestas esperadas.

🚀 Requisitos Previos

EC2 (Backend Laravel) corriendo en: http://3.140.187.117/api
Elastic Beanstalk (Frontend Next.js) deployado en: http://laravel-front-env.eba-btdhn5nm.us-east-2.elasticbeanstalk.com
Navegador moderno (Chrome, Firefox, Safari)
Consola del navegador abierta (F12 → Console)


📝 Paso 1: Abre la Consola del Navegador

Accede al frontend: http://laravel-front-env.eba-btdhn5nm.us-east-2.elasticbeanstalk.com
Presiona F12 en tu teclado
Ve a la pestaña Console

Show Image

🔐 Sección 1: Autenticación
1.1 Registrar un nuevo usuario (Register)
Ruta: POST /api/auth/register
Copia y pega esto en la consola:
javascriptfetch('http://3.140.187.117/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    password_confirmation: 'password123',
    role: 'admin'
  })
}).then(r => r.json()).then(d => console.log(d))
Respuesta esperada (Éxito):
json{
  "message": "User created successfully",
  "user": {
    "business_id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "id": 3,
    "created_at": "2025-12-16T03:15:00.000000Z"
  }
}
Nota: Los campos role pueden ser: admin o employee

1.2 Iniciar sesión (Login)
Ruta: POST /api/auth/login
javascriptfetch('http://3.140.187.117/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(d => {
  console.log(d);
  // Guarda el token para usarlo después
  window.token = d.access_token;
})
Respuesta esperada:
json{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 3,
    "business_id": 1,
    "role": "admin",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
⚠️ Importante: Guarda el access_token en la variable window.token para usarlo en las siguientes peticiones.

📅 Sección 2: Gestión de Citas
2.1 Obtener todas las citas (GET)
Ruta: GET /api/appointments
javascriptfetch('http://3.140.187.117/api/appointments', {
  method: 'GET',
  headers: { 
    'Authorization': `Bearer ${window.token}`,
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(d => console.log(d))
Respuesta esperada:
json{
  "status": "success",
  "data": [
    {
      "id": 1,
      "business_id": 1,
      "user_id": 3,
      "client_name": "Jane Smith",
      "start_time": "2025-12-20T10:00:00.000000Z",
      "end_time": "2025-12-20T11:00:00.000000Z",
      "notes": "Primera consulta"
    }
  ]
}

2.2 Crear una nueva cita (POST)
Ruta: POST /api/appointments
javascriptfetch('http://3.140.187.117/api/appointments', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${window.token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 3,
    client_name: 'Carlos López',
    start_time: '2025-12-22 14:00:00',
    end_time: '2025-12-22 15:00:00',
    notes: 'Consulta de seguimiento'
  })
}).then(r => r.json()).then(d => console.log(d))
Respuesta esperada:
json{
  "status": "success",
  "data": {
    "id": 2,
    "business_id": 1,
    "user_id": 3,
    "client_name": "Carlos López",
    "start_time": "2025-12-22T14:00:00.000000Z",
    "end_time": "2025-12-22T15:00:00.000000Z",
    "notes": "Consulta de seguimiento",
    "created_at": "2025-12-16T03:20:00.000000Z"
  }
}

2.3 Actualizar una cita (PUT)
Ruta: PUT /api/appointments/:id
javascriptfetch('http://3.140.187.117/api/appointments/2', {
  method: 'PUT',
  headers: { 
    'Authorization': `Bearer ${window.token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 3,
    client_name: 'Carlos López Actualizado',
    start_time: '2025-12-22 15:30:00',
    end_time: '2025-12-22 16:30:00',
    notes: 'Cita actualizada'
  })
}).then(r => r.json()).then(d => console.log(d))
Respuesta esperada:
json{
  "status": "success",
  "data": {
    "id": 2,
    "client_name": "Carlos López Actualizado",
    "start_time": "2025-12-22T15:30:00.000000Z",
    "end_time": "2025-12-22T16:30:00.000000Z"
  }
}

2.4 Prueba de Solapamiento de Citas
Ruta: POST /api/appointments
Este test verifica que el sistema no permite crear citas que se solapan con otras existentes.
javascriptfetch('http://3.140.187.117/api/appointments', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${window.token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 3,
    client_name: 'Cliente Conflicto',
    start_time: '2025-12-22 15:45:00',
    end_time: '2025-12-22 16:45:00',
    notes: 'Esta cita se solapa con la anterior'
  })
}).then(r => r.json()).then(d => console.log(d))
Respuesta esperada (Error):
json{
  "status": "error",
  "message": "Este horario se solapa con otra cita existente."
}

2.5 Obtener citas de un usuario específico (GET)
Ruta: GET /api/users/:id/appointments
javascriptfetch('http://3.140.187.117/api/users/3/appointments', {
  method: 'GET',
  headers: { 
    'Authorization': `Bearer ${window.token}`,
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(d => console.log(d))
Respuesta esperada:
json{
  "status": "success",
  "data": [
    {
      "id": 2,
      "user_id": 3,
      "client_name": "Carlos López Actualizado",
      "start_time": "2025-12-22T15:30:00.000000Z"
    }
  ]
}

2.6 Eliminar una cita (DELETE)
Ruta: DELETE /api/appointments/:id
javascriptfetch('http://3.140.187.117/api/appointments/2', {
  method: 'DELETE',
  headers: { 
    'Authorization': `Bearer ${window.token}`,
    'Content-Type': 'application/json'
  }
}).then(r => r.json()).then(d => console.log(d))
Respuesta esperada:
json{
  "status": "success",
  "message": "Appointment deleted successfully"
}

✅ Checklist de Pruebas
Marca cada prueba conforme las completes:

 Register - Crear nuevo usuario
 Login - Obtener token JWT
 GET /api/appointments - Listar citas
 POST /api/appointments - Crear cita
 PUT /api/appointments/:id - Actualizar cita
 Validación de solapamiento - Error esperado
 GET /api/users/:id/appointments - Citas del usuario
 DELETE /api/appointments/:id - Eliminar cita


🔧 Solución de Problemas
Error: "CORS policy blocked"
Solución: Asegúrate de que el CORS está configurado en Laravel:
bash# En EC2
nano /var/www/SmartBookings-PRO/SmartBookings/config/cors.php
Añade tu dominio de EB a allowed_origins.

Error: "Token expired"
Solución: El token JWT expira después de un tiempo. Haz login nuevamente:
javascript// Obtén un nuevo token
fetch('http://3.140.187.117/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(d => {
  window.token = d.access_token;
  console.log('Nuevo token guardado');
})

Error: 502 Bad Gateway en EB
Solución: Verifica que Next.js está corriendo en puerto 8080:
bash# En EB (via SSH)
systemctl status web.service

📊 Resumen de Endpoints
MétodoRutaDescripciónPOST/api/auth/registerRegistrar usuarioPOST/api/auth/loginIniciar sesiónGET/api/appointmentsListar citasPOST/api/appointmentsCrear citaPUT/api/appointments/:idActualizar citaDELETE/api/appointments/:idEliminar citaGET/api/users/:id/appointmentsCitas del usuario
