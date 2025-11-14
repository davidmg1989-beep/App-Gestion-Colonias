 # Gestión de Colonias Felinas

Resumen del estado del proyecto

- Estado: funcional y compilable. `npm run build` genera la carpeta `dist/` con Vite.
- Frontend: React + TypeScript + Vite.
- Datos: `data/mockData.ts` contiene datos iniciales (`initialColonies`, `initialCats`).
- Despliegue: añadidos `Dockerfile` multi-stage y `nginx.conf` para servir la app como SPA.

Cambios y progresos recientes

- Añadidas definiciones de tipos `@types/react`, `@types/react-dom` para resolver errores TS.
- Añadido Dockerfile multi-stage (build con node → servir con nginx).
- Añadido `nginx.conf` y `.dockerignore` para despliegue en Coolify o Docker en general.
- Corregido: sincronización del formulario de edición en `CatDetail` para evitar valores obsoletos.
- Mejorado: creación programática de iconos de marcador en `Dashboard` para accesibilidad y robustez.
- Añadido `tailwind.config.js` con `safelist` para clases dinámicas.
- Añadido workflow de CI (`.github/workflows/ci.yml`) que ejecuta `npm ci` y `npm run build` en pushes/PRs.
- Mejorado: los ids ahora usan UUID v4 (paquete `uuid`) en lugar de `Date.now()`.

Temas pendientes / Recomendaciones

1. Probar la imagen Docker localmente:

   - Construir:
     ```bash
     docker build -t app-gestion-colonias .
     ```

   - Ejecutar:
     ```bash
     docker run -p 8080:80 app-gestion-colonias
     # Abrir http://localhost:8080
     ```

   Nota: si el entorno donde ejecutas esto no dispone de Docker, Coolify puede construir desde el repo.

2. Autenticación real:

   - Actualmente `AuthContext` usa una contraseña mock ('1234'). Recomendado: integrar JWT/OAuth o delegar autenticación al proveedor (Coolify/NGINX proxy).

3. Tests y calidad:

   - Añadir tests unitarios (vitest/jest) para funciones clave (p. ej. `generateCats`), y añadir lint/format en CI.

4. Persistencia y backend:

   - Actualmente el estado es local en `App.tsx`. Si planeas sincronizar con backend, considera:
     - Reemplazar `initial*` por API calls (GET/POST/PUT).
     - Usar IDs UUID como ya implementado.

5. Mejoras de accesibilidad:

   - Añadí `aria-label` a los iconos de marcador; revisar hi-contrast y descripciones más ricas si se necesita.

Despliegue en Coolify (resumen práctico)

1. Repositorio
   - Conecta tu repo de GitHub a Coolify (Coolify puede leer Dockerfile y construir la imagen).

2. Variables de build
   - `vite.config.ts` utiliza `loadEnv` para inyectar `GEMINI_API_KEY` en tiempo de build. En Coolify, añade la variable `GEMINI_API_KEY` en el apartado de build-time environment variables.
   - NO subas secretos directamente al repo.

3. Comportamiento de build
   - Coolify puede usar el `Dockerfile` multi-stage que añadimos. Asegúrate de habilitar la extracción de context y revisar que el servicio público use el puerto 80.

4. Opciones si no usas Dockerfile
   - Puedes configurar Coolify para ejecutar los pasos: `npm ci && npm run build` y luego servir `dist/` con nginx (o usar la opción de static hosting).

5. Healthcheck y dominio
   - Configura un healthcheck que verifique `GET /` devuelve 200.
   - Asocia dominio y certificados TLS desde Coolify.

Comandos útiles

- Instalar dependencias (incluyendo uuid):

  ```bash
  npm ci
  npm install uuid
  ```

- Build local:

  ```bash
  npm run build
  ```

Resumen final y próximos pasos que puedo hacer ahora

- Puedo construir y ejecutar la imagen Docker localmente para verificar runtime (si Docker está disponible).
- Puedo añadir tests y extender CI para ejecutar lint/tests además del build.
- Puedo reemplazar el sistema mock de auth por integración con un proveedor real si quieres.

Si quieres, aplico ahora alguno de los siguientes: construir la imagen Docker localmente, extender CI con lint/tests, o integrar una solución de autenticación.

Backlog / Tareas futuras (para plantear más adelante)

Estas son las mejoras y tareas que hemos discutido y que conviene planificar para próximas iteraciones. Las incluyo aquí para facilitar priorización y seguimiento.

- Verificación local de Docker:
   - Construir y ejecutar la imagen localmente para validar el runtime y la configuración de `nginx`.
   - Comandos sugeridos:
      ```bash
      docker build -t app-gestion-colonias .
      docker run --rm -p 8080:80 app-gestion-colonias
      # Abrir http://localhost:8080
      ```

- Publicar imagen en un registry (GHCR/DockerHub):
   - Añadir un workflow de GitHub Actions para construir y publicar la imagen al GitHub Container Registry o DockerHub.
   - Permite desplegar desde Coolify sin construir desde el repo.

- Extender CI (lint, tests y cobertura):
   - Añadir step de `npm run lint` en CI y configurar tests unitarios adicionales.
   - Integrar reportes de coverage y fallos antes de permitir merge a `main`.

- E2E / integración (Playwright / Cypress):
   - Crear pruebas E2E que validen flujos críticos (login, crear colonia/gato, editar cat, ver mapa).

- Autenticación real y permisos:
   - Reemplazar el auth mock por JWT/OAuth o delegar a un proveedor.
   - Definir roles/permiso en la UI si habrá usuarios con distintos niveles.

- Persistencia / API Backend:
   - Diseñar endpoints para sincronizar colonias, gatos y visitas (GET/POST/PUT/DELETE).
   - Decidir quién genera ids: cliente (UUID) o servidor; definir estrategia de reconciliación.

- Migración de IDs y datos existentes:
   - Plan para normalizar ids (si es necesario) y migrar los datos de `initialCats` a un formato con UUID consistente.

- Mejorar marcadores de mapa:
   - Pasar de iconos HTML simples a SVG programáticos o elementos DOM con handlers (mejor accesibilidad y control).
   - Añadir pruebas visuales y comprobaciones de contraste / accesibilidad.

- Revisión de Tailwind: safelist vs enfoque DOM
   - Podemos seguir con `safelist` (ya añadido) o mover estilos dinámicos a CSS inline/SVG/DOM programático para no depender de purge.

- Healthchecks, métricas y monitorización:
   - Añadir `HEALTHCHECK` al Dockerfile o endpoint HTTP para comprobar disponibilidad.
   - Configurar alertas en el entorno de despliegue (Coolify / external monitoring).

- Seguridad y secretos:
   - No commitear secretos. Documentar cómo setear `GEMINI_API_KEY` y otros secrets en Coolify o en Actions Secrets.

- Rollback / estrategia de despliegue:
   - Definir política de despliegue: canary/blue-green o despliegue inmediato.

Cada uno de estos puntos puede ser convertido en una tarea/issue y priorizado. Si quieres, puedo crear issues en GitHub para cada ítem y proponer estimaciones o hacer alguno automáticamente (por ejemplo publicar la imagen en GHCR con un workflow). 
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app
# Gestión de Colonias Felinas

Este repositorio es una SPA en React + TypeScript (Vite) para gestionar colonias felinas. Está diseñada para ser lo más sencilla posible y, al mismo tiempo, ofrecer persistencia fiable mediante un backend mínimo en Node/Express con SQLite.

## Resumen rápido
- Frontend: React + TypeScript + Vite; Leaflet para mapa; Tailwind CSS.
- Backend: Node + Express + SQLite (archivo `./data/colonias.db`) para persistencia mínima y fiable.
- Deployment target: Coolify (recomendado para facilidad) o cualquier host Docker-compatible.

## Contenido del repo (archivos importantes)
- `App.tsx`, `components/` — frontend, lógica UI y formularios.
- `data/mockData.ts` — datos iniciales y utilidades de generación (`generateCats`).
- `backend/server.js`, `backend/db.js` — servidor Express y inicializador SQLite.
- `Dockerfile` (root) — multi-stage para build frontend y servir `dist/` con nginx.
- `backend/Dockerfile` — Dockerfile para backend (Node).
- `docker-compose.override.yml` — en desarrollo monta `./data` como volumen para persistencia.
- `scripts/backup.sh` — script para dump y rotación de backups del archivo SQLite.
- `.github/workflows/ci.yml` — CI que ejecuta tests y build.

## Estado actual (válido para producción si se configura correctamente)
- La app compila (`npm run build`).
- Tests unitarios mínimos con Vitest añadidos.
- Backend funcional con endpoints CRUD básicos y `/api/seed` para poblar datos de ejemplo.

## Requisitos / variables de entorno
En producción (Coolify) debes configurar las siguientes variables de entorno:

- `NODE_ENV=production` — para el backend si lo despliegas con Node.
- `PORT` — puerto del backend (por defecto `4000`).
- `ADMIN_TOKEN` — token secreto para proteger endpoints de escritura del backend (imprescindible). Usa un valor largo y seguro, p. ej. 32+ caracteres aleatorios.
- `GEMINI_API_KEY` — si usas integraciones de IA (opcional), inyectada en tiempo de build para el frontend si procede.

### Buenas prácticas de seguridad
- No commitear secretos. Define `ADMIN_TOKEN` en Coolify (Settings > Environment Variables) o en el panel del servicio.
- Usar HTTPS/TLS en producción. Coolify puede gestionar certificados automáticamente.
- Rotar `ADMIN_TOKEN` si se sospecha exposición.

## Despliegue en Coolify (paso a paso recomendado)
1) Preparar repo
   - Push del repo a GitHub (asegúrate de que todos los commits estén en `main`).

2) Crear dos servicios en Coolify (lo simple):
   - Frontend: tipo static/site. Configura build command y serve `dist/` con nginx o usa nuestro `Dockerfile` en la raíz.
   - Backend: servicio Node.js. Usa `backend/Dockerfile` o ejecuta `node server.js` en el contenedor.

3) Configurar volúmenes para persistencia
   - Monta un volumen en el backend apuntando a la carpeta `/app/data` del contenedor (o la ruta que use el servidor) para que `colonias.db` quede fuera del contenedor y sobreviva reinicios.
   - Si usas Docker Compose en producción, el `docker-compose.override.yml` ya plantea montar `./data` localmente en desarrollo.

4) Variables de entorno en Coolify
   - Backend: `ADMIN_TOKEN` (valor fuerte), `PORT` (4000), `NODE_ENV=production`.
   - Frontend: si necesitas `GEMINI_API_KEY` o similares en build-time, defínelas como build-time env vars.

5) Healthchecks y dominio
   - Backend healthcheck: `GET http://<backend-host>:<port>/health` debe devolver 200.
   - Frontend: configurar dominio y TLS desde Coolify.

6) Backups
   - Asegura un job/cron que haga dump periódico de `colonias.db` (recomendado: cada 6–24h). Usa `scripts/backup.sh` como base.
   - Copia backups a almacenamiento durable (S3, servidor de backup) o al host con retención y rotación.

7) Acceso y protección
   - El backend valida `ADMIN_TOKEN` en cabeceras `x-admin-token` o `Authorization: Bearer <token>` para POST/PUT/DELETE.
   - El frontend incluye un campo opcional para introducir `adminToken` en el login; se guarda en `localStorage` y se añade automáticamente a las peticiones mutantes mediante `utils/api.ts`.

## Comandos útiles (local)
```bash
# Instala deps
npm ci

# Backend (desarrollo)
cd backend
npm install
node server.js

# Frontend (desarrollo)
npm run dev

# Build producción
npm run build

# Build imagen Docker (root)
docker build -t app-gestion-colonias .

# Ejecutar imagen (puerto 8080 en host -> 80 en contenedor)
docker run --rm -p 8080:80 app-gestion-colonias
# Abrir http://localhost:8080
```

## CI / Tests
- El workflow de GitHub Actions ejecuta `npm ci`, `npm run test` (Vitest) y `npm run build` en pushes y PRs.
- Recomendado: ampliar CI con `npm run lint`, `npm run typecheck` y un job de smoke test que despliegue en un entorno de staging y verifique `/health` y endpoints básicos.

## Publicar imágenes (opcional)
- Añadir un workflow para publicar imágenes al GitHub Container Registry (GHCR) o DockerHub. Esto permite desplegar el contenedor en Coolify desde el registry en vez de construir en Coolify.

## Checklist antes de producción (qué falta o debes confirmar)
1. ADMIN_TOKEN configurado en Coolify (imprescindible).
2. Volumen persistente montado en backend para `./data/colonias.db`.
3. Backups automáticos y política de retención en funcionamiento (scripts/backup.sh y cron/job).
4. HTTPS/TLS configurado para el dominio.
5. CI que ejecute tests/lint y bloquee merges con fallos.
6. (Opcional) Flow de migración/import para datos existentes (si quieres pasar mockData a la DB): usar `/api/seed` o escribir script de import.

## Qué más puedo hacer por ti (priorizado)
- Integrar el frontend para usar la API (convertir mutaciones locales en llamadas `apiFetch`) y dejar la app en modo persistente por defecto.
- Añadir un job de backup (ej. `cron`) y documentar pasos para restauración.
- Añadir workflow para publicar imágenes en GHCR y/o desplegar automáticamente en Coolify.
- Reforzar auth: migrar `ADMIN_TOKEN` a JWT (si quieres multiusuario y auditoría).

## Estado final y recomendaciones para el gestor
- Con `ADMIN_TOKEN` y volumen para `./data`, el gestor podrá usar la app en producción sin perder datos aunque el contenedor se reinicie o se actualice.
- Mantener copias de seguridad y una política de rotación es crítico: automatízalo desde el principio.

Si quieres, hago ahora cualquiera de los pasos de la sección "Qué más puedo hacer por ti" y lo commiteo. También puedo preparar un checklist final con los comandos exactos para configurar Coolify paso a paso.

_Última actualización: 2025-11-14_
