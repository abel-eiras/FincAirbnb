# Memoria persistente del proyecto FincAirbnb (MERN)

Cerebro a largo plazo del proyecto. Consultar al inicio de cada tarea y actualizar al resolver bugs, tomar decisiones de arquitectura o añadir dependencias relevantes.

**Contexto:** Clon de Airbnb en stack MERN para un curso de programación asistida por IA. Parodia gallega con ironía y humor (fincas, labregos/labregas, retranca). El detalle está en la documentación del frontend (`/context/`, `/docs/`, README, RESUMEN_EJECUTIVO).

---

## Decisiones de Arquitectura

- **Origen del proyecto:** FincAirbnb es el proyecto de un curso de programación asistida por IA que pide un clon de Airbnb en stack MERN. Nuestro clon es una **parodia gallega** con ironía y humor: se alquilan **fincas** (no habitaciones/casas); los huéspedes son **labregos/labregas**; el tono usa **retranca** gallega. Toda la documentación de producto/negocio y diseño está en el frontend (`/context/`, `/docs/`, README, RESUMEN_EJECUTIVO).

- **Stack y repos:** Arquitectura **multirepo**: frontend en `FincAirbnb` (Next.js 13 App Router, TypeScript, Tailwind, shadcn/ui), backend en `FincAirbnb_backend` (Express + MongoDB). Contrato API: OpenAPI en backend; frontend consume API con **fallback a mocks** (`services/apiClient.ts`, `services/runtime.ts`).

- **Idiomas y URLs:** **UI y contenido usuario:** 100% galego. **URLs:** galego (`/rexistro`, `/acceder`, `/taboleiro`, `/fincas`, `/alugamentos`, `/mensaxes`, etc.). **Código y documentación técnica:** inglés. **Documentación de desarrollo:** español (docs/, milestones). Ver `context/design/galician-language-policy.md`.

- **Versionado y SDD:** Ramas: `feat/<ticket>-frontend-<desc>` / `feat/<ticket>-backend-<desc>`. Commits: `type(scope): mensaje` (feat, fix, docs, chore, refactor, test, ci, build). PR que afecten FE+BE: dos PR con el mismo ticket y enlace entre ellas. Matriz de compatibilidad en `docs/development/FE_BE_COMPATIBILITY_MATRIX.md`.

- **Contrato API:** Fuente de verdad del contrato: `FincAirbnb_backend/openapi/openapi.yaml`. Tipos frontend en `shared/types/` deben alinearse; ante cambios de endpoint/payload, actualizar OpenAPI y revisar `shared/types` y trazabilidad en specs.

---

## Registro de Bugs y Aprendizajes

| Fecha | Dónde | Por qué | Cómo se arregló | Aprendizaje |
|-------|-------|---------|-----------------|-------------|
| ~Ene 2025 | Header / contenido condicional según auth | Hidratación: el servidor no tiene sesión; el cliente sí (localStorage). UI distinta server vs client. | Envolver el bloque condicional (botones de usuario / auth) en un componente **ClientOnly** que solo renderiza en cliente, con fallback (ej. placeholder de altura fija) durante la hidratación. Evitar leer `localStorage` en el primer render del servidor. | En Next.js App Router, todo lo que dependa de auth o localStorage debe renderizarse solo en cliente (ClientOnly) para evitar "Hydration failed because the initial UI does not match". |
| ~Ene 2025 | AuthContext | Inicialización de estado de auth en SSR podía provocar flashes o desajustes. | Estado inicial neutro (ej. `loading: true` o sin usuario) y resolución de sesión solo en cliente (useEffect). No asumir sesión en el primer paint del servidor. | El contexto de auth debe ser consistente con el modelo "solo cliente" para la parte de UI que depende de login. |
| ~Ene 2025 | Ruta `/acceder` 404 | Ruta de login no encontrada (configuración o redirección). | Ajuste de rutas en App Router y/o middleware para que `/acceder` exista y sea la ruta de login. Documentado en `docs/fixes/SOLUCION_404_ACEDER.md`. | Verificar que las rutas de auth en galego (`/acceder`, `/rexistro`, etc.) estén registradas y protegidas correctamente en `app/` y `middleware`. |
| ~Ene 2025 | Navegación dashboard (propietario/labrego) | Enlaces o redirecciones incorrectas tras login o entre secciones. | Corrección de hrefs y rutas del taboleiro (documentado en `docs/fixes/CORRECCION_NAVEGACION_DASHBOARD.md`, `SOLUCION_ERRORES_NAVEGACION_DASHBOARD.md`). | Mantener un mapa claro de rutas del dashboard (taboleiro) y usar componentes de enlace consistentes. |
| ~Ene 2025 | Botones "Limpar filtros" / "Volver" (formularios/edición) | Comportamiento incorrecto o navegación inesperada. | Ajuste de handlers y navegación (docs: `CORRECCION_BOTON_LIMPAR_FILTROS.md`, `CORRECCION_BOTON_VOLVER_EDICION.md`, `CORRECCION_BOTON_VOLVER_FORMULARIO.md`). | Definir un patrón único para "cancelar/volver" y "limpar filtros" en listados y formularios. |
| ~Ene 2025 | Sistema de mensaxería / selector de plantillas | Errores de integración, 404 o textos no galegos. | Refactor del flujo de mensaxes, selector de plantillas en galego e integración con alugamentos (docs: `FIX_SELECTOR_PLANTILLAS_GALLEGO.md`, `FIX_SISTEMA_MENSAXERIA_*.md`, `FIX_MENSAJERIA_ALUGAMENTOS_CONECTADO.md`). | Mensaxería y plantillas deben estar alineadas con la API y con la nomenclatura en galego; probar flujo completo propietario–labrego. |
| ~Ene 2025 | Página "Contactar labrego" 404 | Enlace o ruta incorrecta desde la ficha de finca o listado. | Corrección de la ruta y del enlace al flujo de contacto (doc: `FIX_BOTON_CONTACTAR_LABREGO_404.md`). | Revisar todos los CTAs que abren mensaxería o contacto desde vistas de fincas/alugamentos. |

---

## Estándares del Proyecto

- **Identidad y tono:** Parodia gallega: fincas, labregos/labregas, retranca. No usar "Hóspede" en UI; usar "Labrego/a". Términos agrícolas en galego (ferrados, hectáreas, etc.). Ver `context/design/brand-identity.md` y `docs/updates/ACTUALIZACION_TERMINOS_AGRICOLAS.md`.

- **Estructura frontend:** `app/` (App Router), `components/` (auth, dashboard, properties, ui, messaging, reviews), `contexts/`, `hooks/`, `lib/`, `services/` (apiClient + mocks), `mocks/` (JSON), `shared/types/`, `context/` (docs técnicas EN), `docs/` (desarrollo ES). Backend en repo separado.

- **Nomenclatura en código:** Código en inglés. En UI y copy solo galego. Rutas en galego. Tipos compartidos alineados con OpenAPI.

- **Commits y ramas:** Convención SDD: ramas por ticket, commits `type(scope): mensaje`. Ver `docs/development/VERSIONING_POLICY_FE_BE.md`.

- **Documentación:** Para IA/desarrolladores: `AGENTS.MD`, `context/`. Índice: `INDICE_DOCUMENTACION.md`. Estado del proyecto: `ESTADO_ACTUAL.md`. Estructura: `ESTRUCTURA_PROYECTO.md`.

---

## Nuevas Dependencias Relevantes

**Regla:** Cualquier librería que afecte al stack (frontend o backend) debe registrarse aquí con versión y motivo.

Registrar aquí: nombre, versión, uso (ej. Recharts para gráficos en dashboard).

| Nombre | Versión | Uso |
|--------|---------|-----|
| (añadir nuevas al instalar) | | |
