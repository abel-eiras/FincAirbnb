# Frontend Regression Checklist

## Navegación
- [ ] O `Header` permite chegar a `Beneficios`, `Testemuños` e `Fincas`.
- [ ] Ningún enlace interno remata en 404.
- [ ] O `Footer` abre correctamente páxinas legais (`privacidade`, `termos`, `aviso`, `cookies`).
- [ ] Os CTA principais da home navegan sen recargar toda a aplicación.

## Móbil (375x812)
- [ ] O menú hamburguesa abre e pecha correctamente.
- [ ] Os botóns de autenticación son visibles e clicables.
- [ ] O bloque hero non produce scroll horizontal.
- [ ] O contido principal é lexible sen zoom.

## Dashboard
- [ ] Os accesos rápidos de labrego non rompen rutas.
- [ ] Favoritas e Avaliacións teñen ruta válida.
- [ ] A acción de avaliar redirixe a `/alugamentos/[id]/valorar`.

## Verificación automática
- [ ] Executar `npm run test:frontend-guard`.
- [ ] Executar `npm run lint`.
