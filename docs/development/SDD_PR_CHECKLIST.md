# SDD PR Checklist (Frontend)

Usar esta checklist en cada PR:

- [ ] Hay `spec.md` para la feature (o actualización de una existente).
- [ ] Los criterios de aceptación están validados.
- [ ] Existe `test-cases.md` con casos funcionales y de error.
- [ ] `traceability.md` enlaza requisitos con archivos modificados.
- [ ] Si hay impacto en API, se enlaza spec backend asociada.
- [ ] La rama cumple convención (`<type>/<ticket>-frontend-<desc>`).
- [ ] El commit cumple formato `type(scope): mensaje`.
- [ ] Pasan checks locales (`npm run test:rules`).
- [ ] La PR backend (si aplica) está enlazada.
