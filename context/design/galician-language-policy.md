# Galician Language Policy - FincAirbnb

## Overview

FincAirbnb is a Galician-first platform. This document defines the language policy for all aspects of the project, from user interface to documentation.

---

## Core Principle

**User-facing content MUST be in Galician (galego)**. This is non-negotiable and reflects our commitment to Galician culture and language.

---

## Language Matrix

### 1. User Interface (UI/UX)

**Language**: 🟢 **Galician (100%)**

**Scope**:
- All buttons, labels, form fields
- Navigation menus
- Page titles and headings
- Instructions and help text
- Error messages
- Success/confirmation messages
- Toast notifications
- Modal dialogues
- Placeholder text
- Call-to-action (CTA) text
- Tooltips
- Loading messages
- Empty states
- Alt text for images

**Examples**:
```tsx
// ✅ CORRECT
<button>Rexistrarse</button>
<label>Correo electrónico</label>
<p>A túa reserva foi confirmada</p>

// ❌ WRONG
<button>Register</button>
<label>Email</label>
<p>Your booking has been confirmed</p>
```

---

### 2. URLs and Routes

**Language**: 🟢 **Galician**

**Why**: URLs are visible to users and part of the user experience.

**URL Mapping**:

```
ENGLISH (❌ Don't use)     GALICIAN (✅ Use)
/register                  /rexistro
/login                     /acceder
/logout                    /pechar-sesion
/forgot-password           /recuperar-contrasinal
/dashboard                 /taboleiro (or /painel)
/profile                   /perfil
/settings                  /configuracion
/properties                /fincas
/property/:id              /finca/:id
/my-properties             /minas-fincas
/create-property           /crear-finca
/bookings                  /reservas
/my-bookings               /minas-reservas
/messages                  /mensaxes
/inbox                     /caixa-entrada
/reviews                   /valoracions
/favorites                 /favoritas
/search                    /buscar
/help                      /axuda
/contact                   /contacto
/about                     /acerca-de
/privacy                   /privacidade
/terms                     /termos
/admin                     /administracion
```

**Implementation**:
```typescript
// app/ directory structure
app/
├── rexistro/
├── acceder/
├── recuperar-contrasinal/
├── taboleiro/
├── fincas/
└── reservas/
```

See `url-mapping.md` for complete reference.

---

### 3. Content & Copy

**Language**: 🟢 **Galician**

**Scope**:
- Marketing copy
- Homepage content
- Feature descriptions
- Testimonials
- Blog posts (if any)
- FAQ section
- Terms and conditions
- Privacy policy
- Email templates
- SMS messages
- Push notifications

**Tone & Style**:
- Informal but respectful (use "ti" instead of "vostede")
- Warm and welcoming
- Avoid bureaucratic language
- Use Galician idioms where appropriate
- Humor is welcome (with taste)

**Examples**:
```
✅ GOOD:
"Benvido/a a FincAirbnb! Imos atopar a túa finca perfecta."
"A túa aventura no rural galego comeza aquí."

❌ AVOID:
"Welcome to FincAirbnb!"
"Your rural adventure starts here."
```

---

### 4. Technical Documentation

**Language**: 🔴 **English**

**Why**: 
- AI models understand English better
- International developers can contribute
- Standard practice in software development
- Better tooling and resources

**Scope**:
- Code comments
- API documentation
- Architecture documents
- Technical specifications
- README for developers
- All files in `/context/`
- GitHub issues/PRs
- Code reviews

**Example**:
```typescript
// ✅ CORRECT (English comments)
/**
 * Validates user registration data
 * @param data - Registration form data
 * @returns Validation result
 */
function validateRegistration(data: RegisterData) {
  // Check email format
  if (!isValidEmail(data.email)) {
    return { valid: false, error: 'invalid_email' };
  }
  // ...
}

// ❌ WRONG (Galician comments in code)
/**
 * Valida os datos de rexistro do usuario
 */
function validateRegistration(data: RegisterData) {
  // Comprobar formato do correo
  // ...
}
```

---

### 5. Code (Variables, Functions, Classes)

**Language**: 🔴 **English**

**Why**: 
- International standard
- Better readability for global developers
- Tooling and linters expect English
- Avoiding encoding issues

**Examples**:
```typescript
// ✅ CORRECT
const propertyList: Property[] = [];
function createBooking(data: BookingData) {}
class UserService {}
interface AuthResponse {}

// ❌ WRONG
const listaFincas: Property[] = [];
function crearReserva(data: BookingData) {}
class ServizioUsuario {}
interface RespostaAuth {}
```

---

### 6. Business Documentation

**Language**: 🟡 **Spanish**

**Why**: 
- Business stakeholders typically Spanish-speaking
- Business context in Spain/Galicia
- Easier communication with non-technical team

**Scope**:
- Executive summaries
- Business plans
- Financial projections
- Stakeholder reports
- Marketing strategies (internal)
- `/RESUMEN_EJECUTIVO.md`

**Note**: This is the only exception where neither Galician nor English is used.

---

### 7. Database & Data

**Language**: 🔴 **English**

**Why**: 
- Database schemas standard practice
- Easier migrations and integrations
- International developers understanding

**Database Schema**:
```sql
-- ✅ CORRECT
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  owner_id UUID,
  ...
);

-- ❌ WRONG
CREATE TABLE fincas (
  id UUID PRIMARY KEY,
  titulo VARCHAR(100),
  descricion TEXT,
  propietario_id UUID,
  ...
);
```

**User-generated content**: Can be in any language (user choice)

---

### 8. Git & Version Control

**Language**: 🔴 **English**

**Scope**:
- Commit messages
- Branch names
- Pull request titles/descriptions
- Issue titles/descriptions
- Release notes (technical)

**Examples**:
```bash
# ✅ CORRECT
git commit -m "feat: add property search filters"
git checkout -b "feature/booking-system"

# ❌ WRONG
git commit -m "nova funcionalidade: filtros de busca"
git checkout -b "funcionalidade/sistema-reservas"
```

**Exceptions**: User-reported issues can be in Galician/Spanish

---

## Implementation Guidelines

### React Components

```tsx
// Component names: English
// Props: English
// UI text: Galician

interface PropertyCardProps {
  title: string;
  price: number;
}

export function PropertyCard({ title, price }: PropertyCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{formatPrice(price)}</p>
      <button>Ver detalles</button>  {/* ✅ Galician UI */}
    </article>
  );
}
```

### i18n Strategy (Future)

**Current**: Galician-only  
**Future**: Support multiple languages for international expansion

```typescript
// Future i18n structure
const translations = {
  gl: {  // Galician (default)
    'button.book': 'Reservar',
    'message.confirmed': 'Reserva confirmada',
  },
  es: {  // Spanish (future)
    'button.book': 'Reservar',
    'message.confirmed': 'Reserva confirmada',
  },
  en: {  // English (future)
    'button.book': 'Book',
    'message.confirmed': 'Booking confirmed',
  },
};
```

---

## Content Guidelines

### Galician Orthography

**Follow RAG (Real Academia Galega) standards**:
- Use "x" not "j": "caixa" not "caija"
- Use "ñ": "montaña" not "montanha"
- Accent marks: "está", "é", "ó"

### Common Terms

```
ENGLISH          GALICIAN
User             Usuario/a
Guest            Hóspede
Owner            Propietario/a
Property         Finca / Propiedade
Farm             Finca
Booking          Reserva
Check-in         Check-in (keep) or "Entrada"
Check-out        Check-out (keep) or "Saída"
Dashboard        Taboleiro / Painel
Login            Acceder / Iniciar sesión
Register         Rexistrarse
Settings         Configuración
Messages         Mensaxes
Reviews          Valoracións / Opinións
Rating           Puntuación
Calendar         Calendario
Availability     Dispoñibilidade
Price            Prezo
Payment          Pago
Confirmation     Confirmación
```

### Tone Examples

**Formal Legal** (Terms, Privacy):
```
"Ao rexistrarte na plataforma, aceptas os nosos termos e 
condicións. FincAirbnb comprométese a protexer a túa 
privacidade..."
```

**Friendly Marketing** (Homepage, Emails):
```
"Descobre a túa finca perfecta no rural galego! 🌿
Desde pazos históricos ata fincas acolledoras, temos 
o lugar ideal para a túa escapada."
```

**Functional UI** (Buttons, Forms):
```
"Completar perfil"
"Engadir finca"
"Enviar mensaxe"
"Confirmar reserva"
```

**Error Messages** (Helpful but clear):
```
"Ups! Non puidemos procesar o pago. Verifica os datos da 
túa tarxeta e téntao de novo."
```

---

## Translation Tools & Resources

### Dictionaries
- **RAG**: Real Academia Galega (rag.gal)
- **Termigal**: Galician terminology database
- **Dicionario da RAG**: Official dictionary

### Translation Memory
- Maintain a glossary of common terms
- Store in `/context/design/glossary.md` (future)
- Ensure consistency across platform

### Quality Assurance
- **Native speaker review**: All user-facing text
- **No machine translation**: For user interface
- **Context matters**: Same English word may have different Galician translations

---

## Exceptions & Edge Cases

### Technical Terms

Some technical terms have no good Galician equivalent. Keep them in English if commonly used:

**Keep in English**:
- Email (not "correo electrónico" - too long)
- Wi-Fi
- Check-in / Check-out (widely understood)
- App
- Smartphone

**Translate**:
- User → Usuario/a
- Password → Contrasinal
- Account → Conta
- Settings → Configuración

### Brands & Proper Nouns

- Keep brand names as-is: Stripe, Google, Facebook
- Keep place names as-is: Pontevedra, Galicia
- Product name: "FincAirbnb" (no translation)

---

## Compliance & Legal

### Legal Requirements (Spain/EU)

**RGPD/GDPR compliance**:
- Privacy policy: Must be available in Galician
- Terms of service: Must be available in Galician
- Cookie consent: Galician
- Legal notices: Galician

**Regional support**:
- Galician is co-official with Spanish in Galicia
- Users have the right to interact in Galician
- Public-facing content must be in Galician

---

## Checklist for New Features

When adding new features, verify:

- [ ] All UI text is in Galician
- [ ] URLs use Galician paths
- [ ] Error messages are in Galician
- [ ] Email templates are in Galician
- [ ] No hardcoded English strings
- [ ] Code comments are in English
- [ ] Variable names are in English
- [ ] Documentation updated
- [ ] Native speaker review completed

---

## Resources

### Internal
- `/context/design/url-mapping.md` - Complete URL reference
- `/context/design/glossary.md` - Term translations (future)

### External
- **RAG**: https://academia.gal
- **Dicionario da RAG**: https://academia.gal/dicionario
- **Termigal**: https://www.termigal.org

---

**Last Updated**: October 2024  
**Maintained By**: Product & Content Team  
**Review Cycle**: Every 3 months or with major updates

---

## Quick Reference

```
┌─────────────────────────────────────────────────┐
│  LANGUAGE POLICY SUMMARY                        │
├─────────────────────────────────────────────────┤
│  User Interface          → GALICIAN ✅          │
│  URLs/Routes             → GALICIAN ✅          │
│  Content/Copy            → GALICIAN ✅          │
│  Email/SMS               → GALICIAN ✅          │
│  Code                    → ENGLISH ✅           │
│  Technical Docs          → ENGLISH ✅           │
│  Business Docs           → SPANISH ✅           │
│  Database Schemas        → ENGLISH ✅           │
│  Git Commits             → ENGLISH ✅           │
└─────────────────────────────────────────────────┘
```

**Golden Rule**: If a user can see it, it must be in Galician. 🌍

