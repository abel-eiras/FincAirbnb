# 🌾 Milestone 04: Dashboard do Labrego/Labrega

## Resumen
**Objetivo**: Dashboard para labregos/labregas con as súas fincas alugadas, favoritas e próximas estancias mensuais.

**Duración**: 1 semana | **Prioridade**: Media | **Estado**: ✅ Completado

---

## Objetivos
- Vista principal dashboard labrego/labrega
- As miñas fincas alugadas (próximas, pasadas, canceladas)
- Fincas favoritas para cultivar
- Accións rápidas (buscar, mensaxear, avaliar fincas)

---

## Tareas

### 1. Dashboard Principal (`/taboleiro` - vista labrego)
**Componentes**:
- `LabregoDashboard.tsx` - Dashboard principal
- `ProximasFincas.tsx` - Próximas fincas alugadas
- `FincasFavoritas.tsx` - Favoritas para cultivar
- `AvaliacionsPendentes.tsx` - Avaliacións pendentes
- `BusquedaRapida.tsx` - Busca rápida de fincas

**Copy gallego con retranca**:
- "¡Ola, labrego! 🌾"
- "As túas fincas esperando..."
- "Fincas que te gustan para cultivar"
- "Non te esquezas de avaliar..."

### 2. As Miñas Fincas Alugadas (`/taboleiro/miñas-fincas`)
**Tabs**:
- **Próximas** - "Fincas que alugaches para cultivar"
- **Pasadas** - "Fincas que xa cultivaches"
- **Canceladas** - "Fincas que non puideches cultivar"

**Features**:
- Ver detalles da finca alugada
- Modificar alugamento (futuro)
- Cancelar alugamento
- Descargar confirmación
- Mensaxe ao propietario
- Deixar avaliación (se pasada)

**Copy gallego**:
- "Finca alugada para cultivar"
- "Prezo por mes: XXX€"
- "Período de cultivo: X meses"
- "Mensaxe ao propietario da finca"

### 3. Favoritas (`/taboleiro/favoritas`)
- Lista de fincas gardadas para cultivar (mock)
- Eliminar de favoritas
- Buscar en favoritas
- Ordenar por: prezo, tamaño, localización

**Copy gallego**:
- "Fincas que te gustan para cultivar"
- "Eliminar das favoritas"
- "Buscar fincas favoritas"

### 4. Avaliacións Pendentes
- Lista de fincas cultivadas sen avaliar
- Botón rápido para valorar
- Notificación se hai pendentes

**Copy gallego**:
- "Fincas que cultivaches e aínda non avaliaste"
- "Como foi cultivar nesta finca?"
- "Avalía a túa experiencia"

---

## Datos Mock
```typescript
// Usar bookings.json filtrado por guestId (renombrar a labregoId)
// Añadir campo "favorite" a properties
// Adaptar terminoloxía: "guest" → "labrego", "trip" → "cultivo"
```

---

## Terminoloxía Gallega

### **Usuarios:**
- ❌ "Huéspedes" → ✅ "Labregos/Labregas"
- ❌ "Guests" → ✅ "Labregos"

### **Alugamentos:**
- ❌ "Reservas" → ✅ "Alugamentos"
- ❌ "Bookings" → ✅ "Alugamentos"
- ❌ "Viajes" → ✅ "Cultivos/Estancias"
- ❌ "Trips" → ✅ "Cultivos"

### **Períodos:**
- ❌ "Noches" → ✅ "Meses"
- ❌ "Días" → ✅ "Meses"
- ❌ "Estancia" → ✅ "Período de cultivo"

### **Accións:**
- ❌ "Reservar" → ✅ "Alugar para cultivar"
- ❌ "Cancelar reserva" → ✅ "Cancelar alugamento"
- ❌ "Dejar review" → ✅ "Avaliar finca"

---

## Criterios de Aceptación
1. ✅ Vista específica para labregos/labregas
2. ✅ Alugamentos organizados por estado
3. ✅ Sistema de favoritas funcional
4. ✅ Avaliacións pendentes visibles
5. ✅ Terminoloxía gallega consistente
6. ✅ Copy con retranca gallega

**Milestone Anterior**: 03 | **Siguiente**: 05

---

## Notas Técnicas
- **Código simple e áxil** - Sen sobreinxeniería
- **Funcionalidades básicas** - Sen complexidade innecesaria
- **UX gallega** - Copy divertido e fresco
- **Contexto rural** - Fincas, cultivo, labregos
