# Traceability (Frontend): B3-FIX + B9 Pagos + B10 Notificacións + B11 Uploads + Produción

## Matriz

| Spec Req | Compoñente / Hook / Servizo | Endpoint BE | Notas |
|---|---|---|---|
| B3-FIX-RF-01 Crear alugamento vía API | `services/mockAlugamentos.ts` `createAlugamento()` | `POST /api/alugamentos` | substituíu localStorage |
| B3-FIX-RF-02 Confirmación sen localStorage | `app/alugamentos/[id]/confirmacion/page.tsx` | `GET /api/alugamentos/:id` | |
| B9-RF-01 Páxina de pago | `app/alugamentos/[id]/pagar/page.tsx` | `POST /api/payments/create-intent` | |
| B9-RF-02 Formulario Stripe | `components/payments/PaymentForm.tsx` | Stripe JS SDK | `confirmPayment` con redirect: if_required |
| B9-RF-03 Provider Stripe | `components/payments/StripeProvider.tsx` | — | locale: 'es' |
| B9-RF-04 Servizo pagos | `services/payments.ts` | `POST /api/payments/create-intent`, `GET /api/payments/alugamento/:id` | |
| B9-RF-05 Badge estado pago | `app/taboleiro/mos-alugamentos/page.tsx` | — | `getPagoBadge()` |
| B9-RF-06 Botón pagar agora | `app/taboleiro/mos-alugamentos/page.tsx` | — | só se status=confirmado e estadoPago=pendente |
| B10-RF-01 Hook notificacións | `hooks/useNotifications.ts` | `GET /api/notifications`, `GET /api/notifications/unread-count` | polling 30s |
| B10-RF-02 Campá notificacións | `components/notifications/NotificationBell.tsx` | — | badge con count |
| B10-RF-03 Panel notificacións | `components/notifications/NotificationPanel.tsx` | `PATCH /api/notifications/read-all` | click-outside |
| B10-RF-04 Item notificación | `components/notifications/NotificationItem.tsx` | `PATCH /api/notifications/:id/read` | date-fns gl locale |
| B10-RF-05 Integración Header | `components/Header.tsx` | — | NotificationBell tras auth |
| B10-RF-06 Servizo notificacións | `services/notifications.ts` | `/api/notifications/*` | |
| B11-RF-01 Upload directo Cloudinary | `lib/cloudinary.ts` `uploadToCloudinary()` | `POST /api/uploads/sign` | sinatura backend |
| B11-RF-02 Validación ficheiros | `lib/cloudinary.ts` `validateImageFile()` | — | max 5MB, jpg/png/webp |
| B11-RF-03 Compoñente PhotoUploader | `components/uploads/PhotoUploader.tsx` | — | drag-drop, preview, delete |
| B11-RF-04 Integración Step3Photos | `components/properties/form-steps/Step3Photos.tsx` | — | PhotoUploader + PhotoManager |
| B11-RF-05 Delete Cloudinary | `lib/cloudinary.ts` `deleteFromCloudinary()` | `DELETE /api/uploads/delete` | |
| PROD-01 SSR guard localStorage | `services/mockAuth.ts` | — | typeof window === 'undefined' |
| PROD-02 Docker standalone | `next.config.js` | — | output: 'standalone' |
| PROD-03 Dockerfile + .dockerignore | `.dockerignore`, `Dockerfile` | — | |

## Cambios de contrato

- Non breaking: novos servizos `/payments`, `/notifications`, `/uploads`
- Non breaking: `apiClient.delete()` acepta `body?: unknown`
- Breaking: `getCurrentUser()` devolve `null` en SSR (comportamento correcto)
- Fecha efectiva: 2026-04-02
