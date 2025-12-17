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

# PHP 8.2 o superior
php -v

# Composer
composer --version

# Git
git --version

# PostgreSQL (o MySQL)
psql --version

# Postman (descarga desde postman.com)

# Clona el repositorio
git clone https://github.com/arrenualdo123/SmartBookings-PRO.git

# Entra a la carpeta del proyecto
cd SmartBookings

# Instala las dependencias de PHP con Composer
composer install

# Esto puede tardar 2-5 minutos
# Verifica que no haya errores

Configurar estas variables:
APP_NAME="SmartBookings"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=smartbookings_local
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña

JWT_SECRET=tu_clave_jwt_secreta

Paso 5: Generar Clave de Aplicación
php artisan key:generate

# Output: Application key set successfully.

Paso 6: ejecutar las migraciones
# Ejecuta las migraciones
php artisan migrate

# Output esperado:
# Migration table created successfully.
# Migrating: ...
# Migrated: ...

Paso 8: Correr el servidor

php artisan serve


Paso 9: Testing en Postman
9.1 Crear una Colección en Postman

Abre Postman
Click en "Create Collection"
Nombra tu colección: "SmartBookings API"

9.2 Variables de Entorno en Postman

Click en el ícono de engranaje (⚙️) en la esquina superior derecha
Selecciona "Manage Environments"
Click en "Add"
Nombra: "Local Development"
Añade estas variables:

base_url: http://localhost:8000/api
admin_token: (se obtiene del login)
employee_token: (se obtiene del login)

Click en "Save"

9.3 Crear Peticiones en Postman
9.3.1 Register Admin
Método: POST
URL: {{base_url}}/auth/register
Headers:
Content-Type: application/json
Body (raw JSON):
{
  "name": "Admin Usuario",
  "email": "admin@local.com",
  "password": "AdminPass123!",
  "password_confirmation": "AdminPass123!",
  "role": "admin"
}
Click en "Send"
9.3.2 Register Empleado
Método: POST
URL: {{base_url}}/auth/register
Body:
{
  "name": "Empleado Juan",
  "email": "juan@local.com",
  "password": "EmpleadoPass123!",
  "password_confirmation": "EmpleadoPass123!",
  "role": "employe"
}
9.3.3 Login Admin
Método: POST
URL: {{base_url}}/auth/login
Body:
{
  "email": "admin@local.com",
  "password": "AdminPass123!"
}
Respuesta esperada:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": { ... }
}
Guardar el token en la variable admin_token:

En la respuesta, selecciona el token
Click derecho → "Set admin_token as variable"

9.3.4 Crear Cita
Método: POST
URL: {{base_url}}/appointments
Headers:
Authorization: Bearer {{admin_token}}
Content-Type: application/json
Body:
{
  "user_id": 2,
  "client_name": "Carlos García",
  "start_time": "2025-12-17 10:00:00",
  "end_time": "2025-12-17 11:00:00",
  "notes": "Consulta inicial"
}
9.3.5 Obtener Todas las Citas
Método: GET
URL: {{base_url}}/appointments
Headers:
Authorization: Bearer {{admin_token}}
Content-Type: application/json
9.3.6 Intento de Solapamiento (DEBE FALLAR)
Método: POST
URL: {{base_url}}/appointments
Headers:
Authorization: Bearer {{admin_token}}
Content-Type: application/json
Body:
{
  "user_id": 2,
  "client_name": "Pedro López",
  "start_time": "2025-12-17 10:30:00",
  "end_time": "2025-12-17 11:30:00",
  "notes": "Solapamiento"
}
Respuesta esperada (ERROR):
{
  "status": "error",
  "message": "Este horario se solapa con otra cita existente."
}

Paso 10: Testing en Terminal con cURL
10.1 Register Admin
bashcurl -X POST "http://localhost:8000/api/auth/register" -H "Content-Type: application/json" -d '{"name":"Admin Local","email":"admin_local@test.com","password":"AdminPass123!","password_confirmation":"AdminPass123!","role":"admin"}' | jq .
10.2 Register Empleado
bashcurl -X POST "http://localhost:8000/api/auth/register" -H "Content-Type: application/json" -d '{"name":"Empleado Local","email":"empleado_local@test.com","password":"EmpleadoPass123!","password_confirmation":"EmpleadoPass123!","role":"employe"}' | jq .
10.3 Login Admin
bashcurl -s -X POST "http://localhost:8000/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin_local@test.com","password":"AdminPass123!"}' | jq .
Guarda el token:
bashTOKEN_ADMIN="tu_token_aqui"
10.4 Crear Cita
bashcurl -s -X POST "http://localhost:8000/api/appointments" -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" -d '{"user_id":2,"client_name":"Carlos García","start_time":"2025-12-17 10:00:00","end_time":"2025-12-17 11:00:00","notes":"Consulta"}' | jq .
10.5 Obtener Citas
bashcurl -s -X GET "http://localhost:8000/api/appointments" -H "Authorization: Bearer $TOKEN_ADMIN" -H "Content-Type: application/json" | jq .
10.6 Intento de Solapamiento (DEBE FALLAR)
bashcurl -s -X POST "http://localhost:8000/api/appointments" -H "Authorization: Beare



///////posdata si en el rol no funciona employe cambiar por employee\\\\\\\\\\\\\\\\\\\\
