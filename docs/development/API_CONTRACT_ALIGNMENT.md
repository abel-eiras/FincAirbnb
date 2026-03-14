# Alineación Frontend-Backend de Contrato API

## Fuente de verdad

- Backend contract: `D:/Webs/FincAirbnb_backend/openapi/openapi.yaml`
- Mapping de tipos: `D:/Webs/FincAirbnb_backend/docs/API_CONTRACT_MAPPING.md`

## Tipos frontend afectados

- `shared/types/user.ts`
- `shared/types/property.ts`
- `shared/types/booking.ts`
- `shared/types/message.ts`
- `shared/types/review.ts`

## Regla de cambios

1. Cambio de endpoint o payload -> actualizar OpenAPI.
2. Revisar impacto en `shared/types`.
3. Actualizar trazabilidad SDD en specs.
