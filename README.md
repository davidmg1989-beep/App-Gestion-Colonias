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
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1QzwqGLa3lW1YMLYK09HEzPZlU7LHCZkq

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
