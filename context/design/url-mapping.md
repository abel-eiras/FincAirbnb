# URL Mapping - FincAirbnb

## Overview

This document defines the complete URL structure for FincAirbnb. All user-facing URLs MUST use Galician words to maintain consistency with our language policy.

---

## Principles

1. **Galician Only**: All URLs visible to users must be in Galician
2. **Readable**: Use clear, recognizable Galician words
3. **SEO-Friendly**: Descriptive, keyword-rich paths
4. **Consistent**: Follow naming patterns throughout
5. **RESTful**: Follow REST conventions where applicable

---

## Complete URL Reference

### Public Pages

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/                                   Homepage
/acerca-de                          About us
/como-funciona                      How it works
/axuda                              Help center
/contacto                           Contact us
/preguntas-frecuentes               FAQ
/blog                               Blog (if exists)
/blog/:slug                         Blog post
```

---

### Authentication

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/acceder                            Login page
/rexistro                           Registration
/rexistro/propietario               Owner registration
/rexistro/hoxpede                   Guest registration
/recuperar-contrasinal              Forgot password
/recuperar-contrasinal/confirmar    Password reset confirm
/pechar-sesion                      Logout (action)
/verificar-correo                   Email verification
/verificar-correo/:token            Email verification with token
```

**Alternatives Considered**:
- `/iniciar-sesion` ❌ (too formal)
- `/entrar` ✅ (alternative to /acceder)
- `/crear-conta` ✅ (alternative to /rexistro)

---

### User Dashboard

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/taboleiro                          User dashboard home
/taboleiro/perfil                   User profile
/taboleiro/editar-perfil            Edit profile
/taboleiro/configuracion            Settings
/taboleiro/configuracion/conta      Account settings
/taboleiro/configuracion/seguridade Security settings
/taboleiro/configuracion/notificacions Notification settings
/taboleiro/configuracion/privacidade  Privacy settings
/taboleiro/configuracion/pagamento  Payment settings
```

**Note**: "Taboleiro" (dashboard) is the standard term. Alternative: "Painel"

---

### Properties (Fincas)

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/fincas                             Browse all properties
/fincas/:slug                       Property detail page
/fincas/buscar                      Property search
/fincas/mapa                        Map view
/fincas/favoritas                   Saved/favorite properties

# Owner Property Management
/taboleiro/minas-fincas             My properties list
/taboleiro/fincas/crear             Create new property
/taboleiro/fincas/:id/editar        Edit property
/taboleiro/fincas/:id/fotos         Manage photos
/taboleiro/fincas/:id/calendario    Manage calendar
/taboleiro/fincas/:id/prezos        Manage pricing
/taboleiro/fincas/:id/configuracion Property settings
/taboleiro/fincas/:id/estatisticas  Property analytics
/taboleiro/fincas/:id/valoracions   Property reviews
```

**URL Slug Format**: `[property-name]-[city]`
Example: `/fincas/finca-do-val-ponteareas`

---

### Bookings (Reservas)

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
# Guest Bookings
/reservas                           Guest bookings (list)
/reservas/proximas                  Upcoming bookings
/reservas/pasadas                   Past bookings
/reservas/canceladas                Cancelled bookings
/reservas/:id                       Booking details
/reservas/:id/modificar             Modify booking
/reservas/:id/cancelar              Cancel booking
/reservas/:id/valorar               Leave review

# Booking Flow
/fincas/:slug/reservar              Start booking
/reservas/nova                      New booking form
/reservas/:id/pagar                 Payment page
/reservas/:id/confirmacion          Booking confirmation

# Owner Bookings (received)
/taboleiro/reservas-recibidas       Received bookings
/taboleiro/reservas-recibidas/calendario Calendar view
/taboleiro/reservas-recibidas/:id   Booking details
/taboleiro/reservas-recibidas/:id/aceptar Accept booking
/taboleiro/reservas-recibidas/:id/rexeitar Decline booking
```

---

### Messages (Mensaxes)

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/mensaxes                           Inbox
/mensaxes/caixa-entrada             Inbox (alternative)
/mensaxes/enviadas                  Sent messages
/mensaxes/arquivadas                Archived messages
/mensaxes/:conversationId           Conversation thread
/mensaxes/nova                      New message

# Templates (owners)
/taboleiro/mensaxes/modelos         Message templates
/taboleiro/mensaxes/modelos/crear   Create template
/taboleiro/mensaxes/modelos/:id/editar Edit template
```

---

### Reviews (Valoracións)

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/taboleiro/valoracions              My reviews
/taboleiro/valoracions/recibidas    Reviews received
/taboleiro/valoracions/feitas       Reviews given
/taboleiro/valoracions/:id          Review details
/reservas/:bookingId/valorar        Write review
```

---

### Payments & Billing

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/taboleiro/pagamentos               Payment dashboard
/taboleiro/pagamentos/metodos       Payment methods
/taboleiro/pagamentos/engadir-metodo Add payment method
/taboleiro/pagamentos/historial     Payment history
/taboleiro/pagamentos/facturas      Invoices

# Subscription (owners)
/taboleiro/subscricion              Subscription info
/taboleiro/subscricion/plan         Current plan
/taboleiro/subscricion/cambiar-plan Change plan
/taboleiro/subscricion/cancelar     Cancel subscription
/taboleiro/subscricion/facturas     Subscription invoices
```

---

### Admin Panel

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/administracion                     Admin dashboard
/administracion/usuarios            User management
/administracion/usuarios/:id        User details
/administracion/fincas              Property management
/administracion/fincas/pendentes    Pending verification
/administracion/fincas/:id/verificar Verify property
/administracion/reservas            Booking management
/administracion/reportes            Reports
/administracion/analise             Analytics
/administracion/configuracion       Admin settings
/administracion/moderacion          Content moderation
```

---

### Legal Pages

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/termos                             Terms of service
/termos-e-condicións                Terms & conditions (alt)
/privacidade                        Privacy policy
/politica-de-privacidade            Privacy policy (alt)
/cookies                            Cookie policy
/avisolegal                         Legal notice
/politica-cancelacion               Cancellation policy
```

---

### Help & Support

```
ROUTE                               PURPOSE
─────────────────────────────────────────────────────────────
/axuda                              Help center home
/axuda/hoxpedes                     Guest help
/axuda/propietarios                 Owner help
/axuda/primeiros-pasos              Getting started
/axuda/reservas                     Booking help
/axuda/pagamentos                   Payment help
/axuda/seguridade                   Security help
/axuda/buscar                       Search help articles
/axuda/:slug                        Help article
```

---

## API Routes

**Note**: API routes can use English (not user-facing)

```
/api/auth/login                     Authentication
/api/auth/register
/api/auth/logout

/api/properties                     Properties CRUD
/api/properties/:id
/api/properties/:id/availability

/api/bookings                       Bookings CRUD
/api/bookings/:id
/api/bookings/:id/cancel

/api/messages                       Messaging
/api/messages/:conversationId

/api/reviews                        Reviews
/api/reviews/:id

/api/users/:id                      User management
/api/payments                       Payment processing
```

---

## Query Parameters

### Search Filters

```
/fincas/buscar?
  localización=pontevedra            Location
  tipo=finca                         Property type
  hoxpedes=4                         Number of guests
  prezo_min=50                       Min price
  prezo_max=200                      Max price
  entrada=2024-11-15                 Check-in date
  saida=2024-11-20                   Check-out date
  comodidades=wifi,parking           Amenities
  ordenar=prezo_asc                  Sort order
```

**Sort Options**:
- `prezo_asc`: Price ascending
- `prezo_desc`: Price descending
- `recente`: Recently added
- `popular`: Most popular
- `valoracion`: Highest rated

---

### Pagination

```
/fincas?pagina=2&limite=20          Page 2, 20 per page
```

---

## URL Best Practices

### Do's ✅

1. **Use lowercase**: `/fincas` not `/Fincas`
2. **Use hyphens**: `/minas-fincas` not `/minas_fincas` or `/minasFincas`
3. **Be descriptive**: `/taboleiro/reservas-recibidas` not `/taboleiro/br`
4. **Be consistent**: Always use same terms
5. **Keep it short**: `/rexistro` not `/formulario-de-rexistro-de-usuario`

### Don'ts ❌

1. **Don't use special characters**: No `?` `&` `#` in path (only query string)
2. **Don't use spaces**: Encode as `-` or `%20`
3. **Don't use English**: `/login` ❌ use `/acceder` ✅
4. **Don't be ambiguous**: Be specific about the resource
5. **Don't use file extensions**: `/fincas` not `/fincas.html`

---

## Redirects (SEO)

### From Old URLs (if rebranding)

```
OLD (English)           NEW (Galician)          STATUS
───────────────────────────────────────────────────────
/login               →  /acceder               301
/register            →  /rexistro              301
/dashboard           →  /taboleiro             301
/properties          →  /fincas                301
/bookings            →  /reservas              301
/messages            →  /mensaxes              301
```

---

## 404 Page

```
/404                                Not found page
/erro-404                           Alternative
```

---

## Sitemap Structure

```xml
<!-- sitemap.xml -->
<urlset>
  <url>
    <loc>https://fincairbnb.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fincairbnb.com/fincas</loc>
    <priority>0.9</priority>
  </url>
  <!-- More URLs -->
</urlset>
```

---

## Implementation Notes

### Next.js App Router

```
app/
├── acceder/
│   └── page.tsx              // /acceder
├── rexistro/
│   └── page.tsx              // /rexistro
├── taboleiro/
│   ├── page.tsx              // /taboleiro
│   ├── perfil/
│   │   └── page.tsx          // /taboleiro/perfil
│   └── minas-fincas/
│       └── page.tsx          // /taboleiro/minas-fincas
└── fincas/
    ├── page.tsx              // /fincas
    └── [slug]/
        └── page.tsx          // /fincas/:slug
```

### Middleware for i18n (Future)

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'gl';
  
  // Redirect based on locale
  if (locale !== 'gl') {
    // Future: support multiple languages
    // /en/properties → /fincas for Galician
  }
}
```

---

## Glossary

Quick reference for English → Galician URL terms:

```
ENGLISH              GALICIAN
──────────────────────────────────────
about                acerca-de
account              conta
add                  engadir
admin                administracion
analytics            analise / estatísticas
archive              arquivar
booking              reserva
calendar             calendario
cancel               cancelar
confirm              confirmar
contact              contacto
create               crear
dashboard            taboleiro
delete               eliminar
edit                 editar
favorites            favoritas
forgot-password      recuperar-contrasinal
guest                hóspede
help                 axuda
history              historial
inbox                caixa-entrada
invoice              factura
login                acceder
logout               pechar-sesion
manage               xestionar
map                  mapa
messages             mensaxes
my-properties        minas-fincas
new                  nova / novo
notification         notificación
owner                propietario
past                 pasadas
payment              pagamento / pago
privacy              privacidade
profile              perfil
property             finca
received             recibidas
register             rexistro
review               valoración
search               buscar
security             seguridade
sent                 enviadas
settings             configuracion
subscription         subscrición
support              soporte / axuda
template             modelo
terms                termos
upcoming             próximas
user                 usuario
verify               verificar
```

---

**Last Updated**: October 2024  
**Maintained By**: Development & Content Team  
**Related**: `galician-language-policy.md`

