# 📧 Milestone B13: Emails Transaccionais (Resend)

**Data**: 2026-04-03  
**Prioridade**: Media | **Estado**: ✅ Completado  
**Depende de**: B1 (auth real) ✅, B3 (alugamentos reais) ✅, B9 (pagos Stripe) ✅

---

## Obxectivo

Implementar o envío de emails transaccionais para os tres eventos principais do sistema: benvida tras rexistro, confirmación de alugamento aceptado e recuperación de contrasinal. O backend xa ten o `TODO` marcado en `auth.routes.ts:100`.

---

## Provedor elixido: Resend

- **Plan gratuíto**: 3.000 emails/mes, 100/día — suficiente para MVP e TFG
- **SDK oficial**: `resend` (Node.js)
- **Vantaxes**: API moi simple, excelente DX, soporte para React Email (templates)
- **Dominio**: para o TFG podes enviar desde `onboarding@resend.dev` (dominio de proba) sen verificar dominio propio

---

## Fase 1 — Backend

### 1.1 Instalar dependencia

```bash
cd FincAirbnb_backend
npm install resend
```

### 1.2 Variables de entorno

```env
# FincAirbnb_backend/.env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=FincAirbnb <onboarding@resend.dev>
```

Para o TFG usa `onboarding@resend.dev` como FROM — é o dominio de proba de Resend que funciona sen verificación. En produción real usarías `noreply@tudominio.com` (require verificar o dominio en Resend).

### 1.3 Configuración e helper de email

```
FincAirbnb_backend/src/config/
└── email.ts          # Instancia Resend + función sendEmail

FincAirbnb_backend/src/shared/emails/
├── benvida.ts        # Template: benvida tras rexistro
├── alugamento.ts     # Template: alugamento aceptado/rexeitado
└── resetPassword.ts  # Template: recuperación de contrasinal
```

#### `src/config/email.ts`

```typescript
import { Resend } from "resend";
import { env } from "./env.js";

export const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY non configurado — email non enviado:", opts.subject);
    return;
  }

  const { error } = await resend.emails.send({
    from: env.FROM_EMAIL ?? "FincAirbnb <onboarding@resend.dev>",
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  if (error) {
    console.error("[email] Erro ao enviar email:", error);
    // Non lanzar excepción — o email é secundario, non debe bloquear a operación principal
  }
}
```

**Decisión importante**: `sendEmail` non lanza erros. Se falla o envío de email, a operación principal (rexistro, aceptar alugamento) complétase igualmente. O email é unha notificación secundaria.

### 1.4 Engadir `RESEND_API_KEY` e `FROM_EMAIL` ao `env.ts`

```typescript
// FincAirbnb_backend/src/config/env.ts — engadir:
RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
FROM_EMAIL: process.env.FROM_EMAIL ?? "FincAirbnb <onboarding@resend.dev>",
```

### 1.5 Templates HTML

Os templates son HTML en liña (strings TypeScript). Simple pero funcional para un TFG.

#### `src/shared/emails/benvida.ts`

```typescript
export function templateBenvida(name: string): { subject: string; html: string } {
  return {
    subject: "Benvido/a a FincAirbnb 🌿",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d6a4f;">Benvido/a, ${name}!</h1>
        <p>A túa conta en FincAirbnb foi creada correctamente.</p>
        <p>Agora podes explorar fincas rurais en Galicia e facer as túas reservas.</p>
        <a href="${process.env.FRONTEND_URL ?? "http://localhost:3000"}/fincas"
           style="background:#2d6a4f;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">
          Ver fincas dispoñibles
        </a>
        <p style="color:#666;font-size:12px;margin-top:32px;">FincAirbnb — Alugamento de fincas rurais en Galicia</p>
      </div>
    `,
  };
}
```

#### `src/shared/emails/alugamento.ts`

```typescript
export function templateAlugamentoAceptado(opts: {
  labregoName: string;
  fincaTitle: string;
  inicioTemporada: string;
  finTemporada: string;
  alugamentoId: string;
}): { subject: string; html: string } {
  const url = `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/taboleiro/mos-alugamentos`;
  return {
    subject: `Alugamento aceptado: ${opts.fincaTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d6a4f;">O teu alugamento foi aceptado ✅</h1>
        <p>Hola <strong>${opts.labregoName}</strong>,</p>
        <p>O propietario aceptou o teu alugamento de <strong>${opts.fincaTitle}</strong>.</p>
        <table style="border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:4px 12px 4px 0;color:#666;">Inicio temporada:</td><td><strong>${opts.inicioTemporada}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#666;">Fin temporada:</td><td><strong>${opts.finTemporada}</strong></td></tr>
        </table>
        <a href="${url}"
           style="background:#2d6a4f;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">
          Ver os meus alugamentos
        </a>
        <p style="color:#666;font-size:12px;margin-top:32px;">FincAirbnb — Alugamento de fincas rurais en Galicia</p>
      </div>
    `,
  };
}

export function templateAlugamentoRexeitado(opts: {
  labregoName: string;
  fincaTitle: string;
}): { subject: string; html: string } {
  return {
    subject: `Solicitude rexeitada: ${opts.fincaTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c0392b;">Solicitude non aceptada</h1>
        <p>Hola <strong>${opts.labregoName}</strong>,</p>
        <p>O propietario non puido aceptar a túa solicitude para <strong>${opts.fincaTitle}</strong> neste momento.</p>
        <p>Podes explorar outras fincas dispoñibles en Galicia.</p>
        <a href="${process.env.FRONTEND_URL ?? "http://localhost:3000"}/fincas"
           style="background:#2d6a4f;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">
          Ver outras fincas
        </a>
        <p style="color:#666;font-size:12px;margin-top:32px;">FincAirbnb — Alugamento de fincas rurais en Galicia</p>
      </div>
    `,
  };
}
```

#### `src/shared/emails/resetPassword.ts`

```typescript
export function templateResetPassword(opts: {
  name: string;
  resetToken: string;
}): { subject: string; html: string } {
  const url = `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/auth/nova-contrasinal?token=${opts.resetToken}`;
  return {
    subject: "Recuperación de contrasinal — FincAirbnb",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d6a4f;">Recuperar contrasinal</h1>
        <p>Hola <strong>${opts.name}</strong>,</p>
        <p>Recibiches esta mensaxe porque solicitaches un cambio de contrasinal. Se non foches ti, ignora este correo.</p>
        <a href="${url}"
           style="background:#2d6a4f;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">
          Cambiar contrasinal
        </a>
        <p style="color:#666;font-size:13px;margin-top:16px;">Este enlace caduca en 1 hora.</p>
        <p style="color:#666;font-size:12px;margin-top:32px;">FincAirbnb — Alugamento de fincas rurais en Galicia</p>
      </div>
    `,
  };
}
```

---

### 1.6 Integrar emails nos endpoints existentes

#### A) `POST /auth/register` → email de benvida

**Ficheiro**: `FincAirbnb_backend/src/modules/auth/auth.routes.ts`

Tras `const userObj = user.toObject();` (~liña 81), antes do `return created(...)`:

```typescript
import { sendEmail } from "../../config/email.js";
import { templateBenvida } from "../../shared/emails/benvida.js";

// Dentro de router.post("/register", ...):
const { subject, html } = templateBenvida(payload.name);
void sendEmail({ to: payload.email, subject, html }); // void: non awaitar, non bloquear
```

#### B) `PATCH /alugamentos/:id` → email ao labrego cando o propietario cambia status

**Ficheiro**: `FincAirbnb_backend/src/modules/alugamentos/alugamentos.routes.ts`

Localizar onde se fai o `updateOne` ou `findByIdAndUpdate` do status. Tras actualizar:

```typescript
import { sendEmail } from "../../config/email.js";
import { templateAlugamentoAceptado, templateAlugamentoRexeitado } from "../../shared/emails/alugamento.js";
import { UserModel } from "../../models/UserModel.js";
import { PropertyModel } from "../../models/PropertyModel.js";

// Tras o update, se o novo status é "confirmado" ou "cancelado":
if (newStatus === "confirmado" || newStatus === "cancelado") {
  const labrego = await UserModel.findById(alugamento.labregoId).lean() as any;
  const finca = await PropertyModel.findById(alugamento.propertyId).lean() as any;

  if (labrego?.email && finca) {
    const template = newStatus === "confirmado"
      ? templateAlugamentoAceptado({
          labregoName: labrego.name,
          fincaTitle: finca.title,
          inicioTemporada: alugamento.inicioTemporada,
          finTemporada: alugamento.finTemporada,
          alugamentoId: String(alugamento._id),
        })
      : templateAlugamentoRexeitado({ labregoName: labrego.name, fincaTitle: finca.title });

    void sendEmail({ to: labrego.email, subject: template.subject, html: template.html });
  }
}
```

#### C) `POST /auth/reset-password` → email con enlace de recuperación

**Ficheiro**: `FincAirbnb_backend/src/modules/auth/auth.routes.ts`

O endpoint actual (~liña 89) é un mock. Para implementalo completamente:

**Paso C1**: Engadir campo `resetToken` e `resetTokenExpiry` ao `UserModel`:
```typescript
// No schema de User (ou en UserModel con strict:false xa soporta campos extra)
// Gardar no documento: { resetToken: uuid, resetTokenExpiry: Date }
```

**Paso C2**: Substituír o `TODO` (~liña 100):
```typescript
import crypto from "crypto";
import { sendEmail } from "../../config/email.js";
import { templateResetPassword } from "../../shared/emails/resetPassword.js";

// Dentro de router.post("/reset-password", ...):
const resetToken = crypto.randomBytes(32).toString("hex");
const resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hora

await UserModel.findByIdAndUpdate((user as any)._id, { resetToken, resetTokenExpiry });

const { subject, html } = templateResetPassword({ name: (user as any).name, resetToken });
void sendEmail({ to: email, subject, html });
// A resposta non cambia: sempre devolve 200 para non revelar se existe o email
```

**Paso C3**: Engadir endpoint `POST /auth/nova-contrasinal` para consumir o token:
```typescript
router.post("/nova-contrasinal", async (req, res) => {
  const { token, newPassword } = req.body ?? {};
  if (!token || !newPassword) return fail(res, "Faltan datos", 400);

  const user: any = await UserModel.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() }
  }).lean();
  if (!user) return fail(res, "Token inválido ou caducado", 400);

  const hashed = await bcrypt.hash(String(newPassword), SALT_ROUNDS);
  await UserModel.findByIdAndUpdate(user._id, {
    password: hashed,
    resetToken: null,
    resetTokenExpiry: null
  });

  return ok(res, { message: "Contrasinal actualizada correctamente" });
});
```

---

## Fase 2 — Frontend (mínima para o TFG)

O frontend de recuperación de contrasinal xa ten o formulario de solicitude (`/auth/reset-password` ou similar). O único que hai que engadir é a páxina que consume o token do enlace de email.

### 2.1 Páxina `nova-contrasinal`

```
FincAirbnb_frontend/app/auth/nova-contrasinal/page.tsx
```

Esta páxina le o parámetro `?token=` da URL, mostra un formulario de nova contrasinal, e chama a `POST /auth/nova-contrasinal`.

```typescript
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiClient } from "@/lib/apiClient";

export default function NovaContrasinePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiClient.post("/auth/nova-contrasinal", { token, newPassword });
      setStatus("ok");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 p-6">
        <h1 className="text-2xl font-bold">Nova contrasinal</h1>
        {status === "ok" && <p className="text-green-600">Contrasinal cambiada. Redirixindo...</p>}
        {status === "error" && <p className="text-red-600">Token inválido ou caducado.</p>}
        <input
          type="password"
          placeholder="Nova contrasinal (mín. 8 caracteres)"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          minLength={8}
          required
          className="w-full border rounded px-3 py-2"
        />
        <button type="submit" className="w-full bg-galician-green text-white py-2 rounded">
          Cambiar contrasinal
        </button>
      </form>
    </div>
  );
}
```

---

## Orde de implementación recomendada

1. **Instalar `resend`** e configurar `email.ts` + vars de entorno
2. **Email de benvida** (máis sinxelo — un só punto de integración en `register`)
3. **Email de alugamento aceptado/rexeitado** (require acceder a User e Property)
4. **Email de reset-password** (require lóxica de token — máis complexo)

Os pasos 2 e 3 son independentes entre si e pódense facer en calquera orde.

---

## Variables de entorno

```env
# FincAirbnb_backend/.env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=FincAirbnb <onboarding@resend.dev>
FRONTEND_URL=http://localhost:3000
```

En produción:
```env
FRONTEND_URL=https://fincairbnb.vercel.app
FROM_EMAIL=FincAirbnb <noreply@tudominio.com>  # require dominio verificado en Resend
```

---

## Ficheiros a crear/modificar

| Ficheiro | Acción |
|---|---|
| `FincAirbnb_backend/src/config/email.ts` | Novo — instancia Resend + función `sendEmail` |
| `FincAirbnb_backend/src/config/env.ts` | Engadir `RESEND_API_KEY` e `FROM_EMAIL` |
| `FincAirbnb_backend/src/shared/emails/benvida.ts` | Novo — template HTML benvida |
| `FincAirbnb_backend/src/shared/emails/alugamento.ts` | Novo — templates aceptado/rexeitado |
| `FincAirbnb_backend/src/shared/emails/resetPassword.ts` | Novo — template recuperación |
| `FincAirbnb_backend/src/modules/auth/auth.routes.ts` | Integrar email en `register` e `reset-password` + novo endpoint `nova-contrasinal` |
| `FincAirbnb_backend/src/modules/alugamentos/alugamentos.routes.ts` | Integrar email no `PATCH` de status |
| `FincAirbnb_backend/.env` | Engadir `RESEND_API_KEY`, `FROM_EMAIL`, `FRONTEND_URL` |
| `FincAirbnb_frontend/app/auth/nova-contrasinal/page.tsx` | Novo — formulario de nova contrasinal |

---

## Verificación

- [ ] `RESEND_API_KEY` configurado (obtido en [resend.com](https://resend.com))
- [ ] `npm install resend` completado sen erros
- [ ] Rexistrar un usuario novo → email de benvida recibido no buzón real
- [ ] Propietario acepta alugamento → labrego recibe email de confirmación
- [ ] Propietario rexeita alugamento → labrego recibe email de notificación
- [ ] `POST /auth/reset-password` → email enviado con enlace de recuperación
- [ ] Enlace `?token=...` funciona en `/auth/nova-contrasinal` e cambia a contrasinal
- [ ] Token caducado (>1 hora) → resposta 400 "Token inválido ou caducado"
- [ ] Se `RESEND_API_KEY` non está configurado → `console.warn` pero sen erro 500
- [ ] `npx tsc --noEmit` sen erros tras os cambios
