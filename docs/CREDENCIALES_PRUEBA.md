# 🔐 Credenciales de Proba - FincAirbnb

## 📋 Contas Dispoñibles

### 👨‍🌾 **Propietario de Fincas**

**Usuario**: Xosé Manuel García  
**Email**: `xose@correo.gal`  
**Contrasinal**: `Contrasinal123`  
**Rol**: Owner (Propietario)

**Funcionalidades**:
- ✅ Dashboard de propietario con estatísticas
- ✅ Xestión de propiedades (crear, editar, eliminar)
- ✅ Gráficos de ingresos e ocupación
- ✅ Próximas reservas e actividade recente
- ✅ Accións rápidas para xestión

**Propiedades**: 2 fincas rexistradas

---

### 🌾 **Labrego/a (Cliente que aluga fincas)**

**Usuario**: María Fernández  
**Email**: `maria@correo.gal`  
**Contrasinal**: `Contrasinal123`  
**Rol**: Guest (Labrego/a)

**Funcionalidades**:
- ✅ Dashboard de labrego con estatísticas de cultivo
- ✅ Próximas fincas alugadas para cultivar
- ✅ Fincas favoritas gardadas
- ✅ Avaliacións pendentes de fincas cultivadas
- ✅ Accións rápidas (buscar, favoritas, etc.)

**Estatísticas**:
- **Alugamentos totais**: 3
- **Fincas favoritas**: 5
- **Avaliacións**: 2
- **Rating**: 4.5 ⭐

---

## 🚀 Como Usar

### **1. Acceder á Plataforma**
```
URL: http://localhost:3001/acceder
```

### **2. Introducir Credenciales**
- **Propietario**: `xose@correo.gal` / `Contrasinal123`
- **Labrego**: `maria@correo.gal` / `Contrasinal123`

### **3. Explorar o Dashboard**
- **Propietario**: Verás estatísticas de negocio, gráficos e propiedades
- **Labrego**: Verás fincas alugadas, favoritas e avaliacións pendentes

---

## 📊 Datos Mock Dispoñibles

### **Para María (Labrego)**

#### **Alugamentos Activos**:
1. **Finca Tradicional Galega** (Ponteareas)
   - Tipo: Hortalizas
   - Duración: 6 meses (Marzo - Agosto 2024)
   - Prezo: 120€/mes
   - Estado: Confirmado

2. **Viñedo Vista Miño** (Salvaterra de Miño)
   - Tipo: Viñedo
   - Duración: 7 meses (Abril - Outubro 2024)
   - Prezo: 300€/mes
   - Estado: Confirmado

#### **Alugamentos Completados**:
- **Finca con Frutais** (Ponteareas)
  - Cultivada de Xaneiro a Xuño 2024
  - Pendente de avaliación ⚠️

#### **Fincas Favoritas**:
- 3 fincas gardadas para cultivar no futuro

---

## 🌍 Contexto e Terminoloxía

### **Adaptación ao Contexto Rural Gallego**

Este é un marketplace de **fincas rurais para cultivo**, non de aloxamento turístico:

- ❌ "Huéspedes" → ✅ **"Labregos/Labregas"**
- ❌ "Reservas" → ✅ **"Alugamentos"**
- ❌ "Noches" → ✅ **"Meses"**
- ❌ "Check-in/Check-out" → ✅ **"Inicio/Fin de cultivo"**
- ❌ "Reviews" → ✅ **"Avaliacións"**

### **Copy con Retranca Gallega**

Exemplos de copy usado na interface:
- 🌾 "¡Ola, labrego! A terra non se cultiva sola!"
- 🌱 "Non tes fincas próximas. ¿Que tal buscar unha nova para cultivar?"
- 💚 "Fincas que che gustan para cultivar"
- ⭐ "Fincas que cultivaches e aínda non avaliaste"
- 🎯 "A terra está esperando... ¡Á traballo!"

---

## 🔄 Cambio de Conta

Para cambiar de conta durante as probas:

1. **Pechar sesión** (botón "Pechar sesión" no dashboard)
2. **Acceder de novo** con outras credenciales
3. **Explorar** as funcionalidades específicas de cada rol

---

## 📝 Notas para Desenvolvemento

### **Sistema de Autenticación Mock**
- **localStorage**: Tokens gardados en `fincairbnb_token` e `fincairbnb_user`
- **Validación**: Simulada con delay de 500ms
- **Datos**: Arquivo `mocks/users.json`

### **Alugamentos Mock**
- **Arquivo**: `mocks/alugamentos.json`
- **Servizo**: `services/mockAlugamentos.ts`
- **Total**: 7 alugamentos de exemplo

---

## 🎯 Próximos Pasos

- [ ] **Milestone 05**: Catálogo público de fincas con busca
- [ ] **Milestone 06**: Páxina de detalle de finca
- [ ] **Milestone 07**: Sistema de reservas completo
- [ ] **Milestone 08**: Sistema de avaliacións
- [ ] **Milestone 09**: Sistema de mensaxería
- [ ] **Milestone 10**: Perfís e configuración

---

**Última actualización**: 27 de xaneiro de 2025  
**Versión**: Milestone 04 - Dashboard Labrego Completado ✅
