# FincAirbnb

FincAirbnb é unha experiencia dixital pensada para que influencers urbanitas poidan sentir a chamada do agro galego sen deixar de lado as redes sociais. A aplicación propón un marketplace ficticio de fincas de alugueiro con moito humor e unha estética baseada en Tailwind CSS.

## ✨ Que atoparás?
- Interface 100% en galego con seccións claras: cabeceira, hero, beneficios, testemuños e pé de páxina listo para captar leads.
- Copys con retranca que destacan as vantaxes de cultivar a túa propia finca mentres mantés a presenza en Instagram.
- Deseño responsive baseado en compoñentes reutilizables e tipografía DM Sans cargada co App Router de Next.js 13.
- Paleta personalizada (`galician-blue`, `galician-green`, `shell-beige`) e compoñentes de Radix UI integrados con shadcn/ui.

## 🧰 Tecnoloxías clave
- **Next.js 13 (App Router)** con `app/` como punto de entrada principal.
- **React 18** e **TypeScript**, incluíndo tipados para hooks, lib e compoñentes.
- **Tailwind CSS** con configuración personalizada en `tailwind.config.ts` e utilidades `clsx`/`class-variance-authority` para estilos condicionais.
- **Radix UI** + **shadcn/ui** para botóns, menús despregábeis e demais widgets accesibles.
- **react-hook-form** e **zod** dispoñíbeis para futuras validacións de formularios.

## 🚀 Executar o proxecto
1. Instala as dependencias:
   ```bash
   npm install
   ```
2. Arrinca o entorno de desenvolvemento:
   ```bash
   npm run dev
   ```
   O sitio abrirase en `http://localhost:3000` co refresco quentado polo hot reload.
3. Outros scripts dispoñíbeis:
   - `npm run build`: prepara a versión optimizada para produción.
   - `npm run start`: serve a build xa xerada.
   - `npm run lint`: executa ESLint cos axustes de Next.js.

## 🏗️ Estrutura destacada
- `app/`: rutas e layout principal (`layout.tsx` establece o idioma en `gl`).
- `components/`: bloques de interface como `Header`, `HeroSection`, `BenefitsSection`, ademais da libraría `ui/` xerada a partir de shadcn.
- `contexts/`: Context API para xestión de estado (autenticación).
- `hooks/`: inclúe utilidades como `use-toast` para notificacións futuras.
- `lib/`: helpers compartidos (por exemplo, `utils.ts` para combinar clases CSS, `auth-mock.ts` para autenticación mock).
- `types/`: definicións de tipos TypeScript.
- `middleware.ts`: protección de rutas.

## 📚 Documentación

### Para Usuarios Non Técnicos
- **[RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md)**: Visión xeral do proxecto, modelo de negocio, roadmap (en español)

### Para Desenvolvedores e Axentes de IA
- **[AGENTS.MD](AGENTS.MD)**: Guía completa para axentes de IA (en inglés)
- **[/context/](context/)**: Documentación técnica completa
  - Business: Modelo de negocio, personas, KPIs
  - Technical: Arquitectura, stack, sistemas
  - Features: Especificacións de funcionalidades
  - Design: Guías de deseño, marca, política de idiomas
  - Integrations: Integraciones con servizos externos

### Para o Equipo de Desenvolvemento
- **[/docs/](docs/)**: Guías de desenvolvemento e milestones (en español)

## 🎯 Roadmap de Desenvolvemento

- ✅ **Fase 1**: Sistema de autenticación e dashboard (Completado)
- 🚧 **Fase 2**: Sistema de listado de propiedades (Seguinte)
- 📅 **Fase 3**: Sistema de reservas
- 📅 **Fase 4**: Integración de pagos
- 📅 **Fase 5**: Sistema de mensaxería
- 📅 **Fase 6**: Reseñas e valoracións
- 📅 **Fase 7**: Panel de administración

Ver [/docs/milestones/](docs/milestones/) para máis detalles.

## 🌍 Política de Idiomas

**Importante**: FincAirbnb é unha plataforma 100% en galego para os usuarios finais:

- ✅ **Interface de usuario**: Galego
- ✅ **URLs**: Galego (`/rexistro`, `/taboleiro`, `/fincas`)
- ✅ **Contido**: Galego
- 📝 **Documentación técnica**: Inglés (para IA e desenvolvedores)
- 📝 **Código**: Inglés (estándar de desenvolvemento)

Ver [/context/design/galician-language-policy.md](context/design/galician-language-policy.md) para detalles completos.

## 📄 Licenza
Este proxecto distribúese baixo [Creative Commons Zero 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
Licenza máis libre imposible, é dicir, fai o que che saia do carallo con ela.
