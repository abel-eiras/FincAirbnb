# Traceability (Frontend): auth-apiclient-jwt

## Matriz

| Spec Req | Servicio | Código frontend | Test case |
|---|---|---|---|
| RF-FE-AUTH-01: Adjuntar JWT en cada petición autenticada | `services/apiClient.ts` | `getAuthHeaders()` → `Authorization: Bearer` | TC-FE-AUTH-01 |
| RF-FE-AUTH-02: Leer token de localStorage | `services/apiClient.ts` | `localStorage.getItem("fincairbnb_token")` | TC-FE-AUTH-02 |
| RF-FE-AUTH-03: No enviar token en SSR | `services/apiClient.ts` | Guard `typeof window === "undefined"` | TC-FE-AUTH-03 |

## Cambios de contrato

- Breaking changes:
  - Eliminado `credentials: "include"` — auth ya no usa cookies sino Bearer header
- Mitigación: Token sigue almacenándose en `localStorage['fincairbnb_token']` por `AuthContext.tsx`
- Fecha efectiva: 2026-04-01
