# ✅ Actualización Termos Agrícolas - Labrego/a

## Problema Identificado
O termo **"Hóspede"** non era apropiado para o contexto de FincAirbnb:
- ❌ **Asociación hotelera**: Evoca camas, habitacións, aloxamento
- ❌ **Contexto incorrecto**: FincAirbnb é para alugar fincas, non cuartos
- ❌ **Descontextualizado**: Non reflicte a actividade agrícola real

## Solución Implementada

### Termo Actualizado ✅
- **Antes**: `guest` → `Hóspede` ❌
- **Despois**: `guest` → `Labrego/a` ✅

### Xustificación do Termo
**"Labrego/a"** é máis apropiado porque:
- ✅ **Tradición galega**: Termo histórico e cultural
- ✅ **Contexto agrícola**: Específico para traballo da terra
- ✅ **Apropiado**: Reflicte a actividade real (cultivar, sachar, plantar)
- ✅ **Inclusivo**: Forma sen distinción de xénero

---

## Cambios Realizados

### 1. Traduccións Actualizadas ✅
**Archivo**: `lib/translations.ts`
```typescript
case 'guest':
  return 'Labrego/a'; // Término agrícola apropiado para quien alquila fincas
```

### 2. Documentación Actualizada ✅
**Archivos modificados**:
- `AGENTS.MD` - "Guests (Labregos/Labregas)"
- `ACTUALIZACION_IDIOMA_DASHBOARD.md` - Traduccións actualizadas

### 3. Documentación Nova ✅
**Creado**: `docs/TERMINOS_AGRICOLAS_GALEGOS.md`
- **Contexto**: Explicación do uso de termos agrícolas
- **Xustificación**: Por que "Labrego/a" e non "Hóspede"
- **Termos adicionais**: Outros termos agrícolas relevantes

---

## Termos Agrícolas Implementados

### Roles de Usuario
```typescript
'owner' → 'Propietario/a'     // Dono/a da finca
'guest' → 'Labrego/a'         // Quen aluga para cultivar
'admin' → 'Administrador/a'   // Xestiona a plataforma
```

### Termos Adicionais (Preparados)
```typescript
// Tipos de propiedades
'finca' → 'Finca'
'pazo' → 'Pazo'
'casa_rural' → 'Casa Rural'
'horreo' → 'Hórreo'
'cortina' → 'Cortiña'

// Estados de reservas
'pending' → 'Pendente'
'confirmed' → 'Confirmada'
'completed' → 'Completada'
'cancelled' → 'Cancelada'
```

---

## Contexto Cultural

### FincAirbnb vs Hotel
| Aspecto | Hotel | FincAirbnb |
|---------|-------|------------|
| **Espazo** | Habitacións | Fincas rurais |
| **Actividade** | Durmir | Cultivar |
| **Equipamento** | Camas | Sachos, capachos |
| **Usuarios** | Hóspedes | Labregos |

### Termos Tradicionais Galegos
- **Labrego/a**: Quen traballa a terra
- **Campesiño/a**: Traballador/a rural
- **Hortelán/lá**: Especialista en hortas
- **Viñateiro/a**: Especialista en viñas

---

## Implementación Técnica

### Uso no Dashboard
```tsx
// Antes ❌
<span>Rol: Owner</span>

// Despois ✅
<span>Perfil: Propietario/a</span>
<span>Perfil: Labrego/a</span>
```

### Arquitectura Escalable
```typescript
// lib/translations.ts - Centralizado
export function translateUserRole(role: string): string {
  // Traduccións centralizadas
}

// Reutilizable en calquera componente
import { translateUserRole } from '@/lib/translations';
```

---

## Testing

### ✅ Verificación Visual
1. **Ir a** `http://localhost:3000/taboleiro`
2. **Login** con `xose@correo.gal` / `Contrasinal123`
3. **Verificar** que aparece "Perfil: Propietario/a"

### ✅ Casos de Prueba
- **Propietario**: Muestra "Propietario/a"
- **Labrego**: Mostraría "Labrego/a"
- **Admin**: Mostraría "Administrador/a"

---

## Beneficios da Solución

### ✅ Contexto Apropiado
- **Termos agrícolas**: Reflicten a actividade real
- **Cultura galega**: Tradición e identidade local
- **Claridade**: Usuarios entenden o contexto

### ✅ Escalabilidade
- **Arquitectura centralizada**: Fácil cambiar termos
- **Reutilizable**: Mesmo patrón para todas as traduccións
- **Mantemento**: Actualizacións nun só lugar

### ✅ Inclusividade
- **Formas sen xénero**: "/a" para inclusividade
- **Respecto cultural**: Termos apropiados e respectuosos
- **Accesibilidade**: Linguaxe clara e comprensible

---

## Próximos Pasos

### Inmediato
1. **Testing manual** co novo termo
2. **Verificar** consistencia en toda a aplicación

### Futuro
1. **Expandir** traduccións para outros contextos
2. **Considerar** termos específicos por actividade
3. **Documentar** máis termos agrícolas relevantes

---

## Arquivos Modificados

### ✅ Actualizados
- `lib/translations.ts` - Traducción principal
- `AGENTS.MD` - Documentación principal
- `ACTUALIZACION_IDIOMA_DASHBOARD.md` - Documentación de cambios

### ✅ Novos
- `docs/TERMINOS_AGRICOLAS_GALEGOS.md` - Guía de termos agrícolas

---

**Problema resuelto** ✅  
**Termos agrícolas apropiados** ✅  
**Contexto cultural respetado** ✅  
**Linguaxe inclusiva implementada** ✅
