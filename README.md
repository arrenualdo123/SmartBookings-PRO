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
