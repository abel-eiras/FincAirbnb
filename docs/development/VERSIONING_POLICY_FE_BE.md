# Política de versionado FE/BE

Esta política aplica a:

- Frontend: `D:/Webs/FincAirbnb`
- Backend: `D:/Webs/FincAirbnb_backend`

## Convención de ramas

Usar siempre una rama por repo y por ticket:

- Frontend: `feat/<ticket>-frontend-<short-desc>`
- Backend: `feat/<ticket>-backend-<short-desc>`

También válidas: `fix/`, `chore/`, `docs/`, `refactor/`, `test/`.

## Convención de commits

Formato obligatorio:

`type(scope): mensaje`

Ejemplos:

- `feat(frontend): integra consumo de API de mensaxes`
- `fix(backend): corrige validación de bookingId`
- `docs(shared): actualiza matriz de compatibilidad`

Tipos permitidos:

- `feat`
- `fix`
- `docs`
- `chore`
- `refactor`
- `test`
- `ci`
- `build`

## Política de PR coordinadas

Cuando un cambio afecta a ambos repos:

1. Crear 2 PR (una por repo).
2. Ambas PR deben incluir el mismo ticket.
3. En la descripción de cada PR, enlazar la PR hermana.

## Matriz de compatibilidad FE/BE

Mantener la matriz en `docs/development/FE_BE_COMPATIBILITY_MATRIX.md`.

Regla:

- Si backend introduce breaking change, subir versión mayor o documentar fallback.
- Si frontend requiere endpoint nuevo, no mergear hasta que exista versión backend compatible.
