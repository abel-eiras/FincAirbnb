# Cursor Multi-root Workspace (Frontend + Backend)

## Objetivo

Trabajar en una sola ventana de Cursor con ambos proyectos:

- Frontend: `D:/Webs/FincAirbnb`
- Backend: `D:/Webs/FincAirbnb_backend`

## Archivo de workspace recomendado

Usa el archivo:

- `D:/Webs/FincAirbnb/FincAirbnb.fullstack.code-workspace`

## Cómo abrirlo

1. En Cursor, usa `File -> Open Workspace from File...`.
2. Selecciona `FincAirbnb.fullstack.code-workspace`.
3. Verifica que aparecen dos raíces en el explorador.

## Convención de terminales

- Terminal 1 (Frontend): cwd en `D:/Webs/FincAirbnb`
  - `npm run dev`
- Terminal 2 (Backend): cwd en `D:/Webs/FincAirbnb_backend`
  - `npm run dev`

## Convención de ramas

- Si ambos repos tienen git independiente, versionar por separado.
- Relacionar PRs con una etiqueta común, por ejemplo: `SDD-<id>`.

## Variables de entorno clave

- Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_USE_EXTERNAL_API`
- Backend: `PORT`, `MONGODB_URI`, `CORS_ORIGIN`, `JWT_SECRET`
