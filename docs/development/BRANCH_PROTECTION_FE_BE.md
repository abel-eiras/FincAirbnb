# Branch Protection FE/BE (GitHub)

## Reglas recomendadas para `main` y `develop`

1. Require a pull request before merging.
2. Require approvals: mínimo 1.
3. Require status checks to pass before merging:
   - `CI Frontend / validate`
4. Require branches to be up to date before merging.
5. Include administrators (recomendado).
6. Disable force pushes.
7. Disable branch deletion.

## Reglas de coordinación entre repos

- Si el ticket afecta FE y BE, ambas PR deben estar enlazadas.
- No cerrar ticket sin confirmar compatibilidad en:
  - `docs/development/FE_BE_COMPATIBILITY_MATRIX.md`
