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
- `hooks/`: inclúe utilidades como `use-toast` para notificacións futuras.
- `lib/`: helpers compartidos (por exemplo, `utils.ts` para combinar clases CSS).

## 🎯 Ideas para seguintes iteracións
- Engadir autenticación e xestión real de fincas con datos procedentes dunha API.
- Substituír os placeholders da hero por fotografías ou ilustracións de fincas galegas reais.
- Implementar un fluxo de reserva con formularios validados mediante `react-hook-form` + `zod`.

## 📄 Licenza
Este proxecto distribúese baixo [Creative Commons Zero 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).
Licenza máis libre imposible, é dicir, fai o que che saia do carallo con ela.
