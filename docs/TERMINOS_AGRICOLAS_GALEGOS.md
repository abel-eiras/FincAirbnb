# Termos Agrícolas Galegos - FincAirbnb

## Contexto

FincAirbnb é unha plataforma para alugar fincas rurais en Galicia para cultivos e actividades agrícolas. Non é un hotel nin un aloxamento tradicional, senón un servizo especializado no sector agrícola.

## Termos Utilizados

### Roles de Usuario

#### Propietario/a
- **Definición**: Quen posúe e aluga a finca
- **Contexto**: Dono/a da terra que a pon á disposición para cultivo
- **Uso**: Consistente co contexto rural galego

#### Labrego/a
- **Definición**: Quen aluga a finca para cultivar
- **Contexto**: Termo tradicional galego para quen traballa a terra
- **Alternativas consideradas**:
  - ❌ **Hóspede**: Asóciase a ocupación hotelera (camas, habitacións)
  - ✅ **Labrego/a**: Termo agrícola tradicional
  - ✅ **Campesiño/a**: Traballador/a rural
  - ✅ **Hortelán/lá**: Especialista en hortas

#### Administrador/a
- **Definición**: Xestiona a plataforma
- **Contexto**: Termo técnico apropiado

---

## Xustificación dos Termos

### Por que "Labrego/a" e non "Hóspede"?

#### ❌ Problema con "Hóspede"
- **Asociación hotelera**: Evoca camas, habitacións, aloxamento
- **Contexto incorrecto**: FincAirbnb non é un hotel
- **Descontextualizado**: Non reflicte a actividade agrícola

#### ✅ Beneficios de "Labrego/a"
- **Tradición galega**: Termo histórico e cultural
- **Contexto agrícola**: Específico para traballo da terra
- **Apropiado**: Reflicte a actividade real (cultivar, sachar, plantar)
- **Inclusivo**: Forma sen distinción de xénero

---

## Outros Termos Agrícolas

### Tipos de Propiedades
- **Finca**: Propiedade rural para cultivo
- **Pazo**: Propiedade rural tradicional galega
- **Casa Rural**: Aloxamento rural (se aplicable)
- **Hórreo**: Almacén tradicional de cereais
- **Cortiña**: Pequena finca ou horta

### Actividades
- **Cultivar**: Traballar a terra
- **Sachar**: Remover a terra
- **Plantar**: Colocar sementes ou plantas
- **Cosechar**: Recoller os froitos

### Equipamentos
- **Sacho**: Ferramenta para sachar
- **Capachos**: Cestos para recoller
- **Arado**: Ferramenta para arar
- **Regadeira**: Para regar as plantas

---

## Implementación Técnica

### Archivo de Traduccións
```typescript
// lib/translations.ts
export function translateUserRole(role: string): string {
  switch (role) {
    case 'owner':
      return 'Propietario/a';
    case 'guest':
      return 'Labrego/a'; // Término agrícola apropiado
    case 'admin':
      return 'Administrador/a';
    default:
      return role;
  }
}
```

### Uso no Dashboard
```tsx
// app/taboleiro/page.tsx
<span className="font-medium">Perfil:</span>
<span className="ml-2">{user?.role ? translateUserRole(user.role) : 'N/A'}</span>
```

---

## Consistencia Lingüística

### Principios
1. **Contexto agrícola**: Termos específicos para cultivo
2. **Tradición galega**: Linguaxe autóctona e cultural
3. **Inclusividade**: Formas sen xénero cando sexa posible
4. **Claridade**: Termos comprensibles e apropiados

### Aplicación
- **Interface de usuario**: Todo en galego
- **Documentación técnica**: Inglés
- **Documentación de negocio**: Español
- **Código**: Inglés (estándar internacional)

---

## Evolución Futura

### Posibles Melloras
- **Termos específicos por actividade**: Hortelán/lá, Viñateiro/a, etc.
- **Regionalismos**: Termos específicos por zona de Galicia
- **Estacionalidade**: Termos específicos por época do ano

### Consideracións
- **Escalabilidade**: Fácil cambiar termos
- **Consistencia**: Un só lugar para traduccións
- **Mantemento**: Actualizacións centralizadas

---

**Nota**: Esta documentación serve como referencia para manter a consistencia terminolóxica e cultural en toda a plataforma FincAirbnb.
