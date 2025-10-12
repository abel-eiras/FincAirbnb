# ✅ Credenciales Labrego Actualizadas

**Fecha**: 27 de enero de 2025  
**Milestone**: 04 - Dashboard Labrego  

---

## 🎯 **Cambio Realizado**

Se actualizaron las credenciales del usuario labrego principal para facilitar las pruebas del dashboard de labregos.

---

## 🔐 **Nueva Cuenta Labrego**

### **Usuario Labrego/a**
- **Nombre**: María Fernández
- **Email**: `maria@correo.gal` ✅
- **Contraseña**: `Contrasinal123` ✅
- **Rol**: Guest (Labrego/a)
- **ID**: `user-labrego-1`

### **Perfil**
- **Localización**: Santiago de Compostela, A Coruña
- **Bio**: "Labrega apaixonada pola agricultura ecolóxica. Busco fincas para cultivar hortalizas orgánicas."
- **Experiencia**: 
  - 3 alugamentos totais
  - 5 fincas favoritas
  - 2 avaliacións realizadas
  - Rating: 4.5 ⭐

---

## 📋 **Credenciales Disponibles**

### **1. Propietario**
```
Email: xose@correo.gal
Contraseña: Contrasinal123
Dashboard: Gestión de propiedades e negocio
```

### **2. Labrego** ⭐ NUEVO
```
Email: maria@correo.gal
Contraseña: Contrasinal123
Dashboard: Alugamentos, favoritas e avaliacións
```

---

## 🔄 **Archivos Modificados**

### **1. `mocks/users.json`**
- **Cambio**: Actualizado email de `maria@labrego.gal` → `maria@correo.gal`
- **Cambio**: Actualizada contraseña de `Labrego123` → `Contrasinal123`
- **ID**: `user-labrego-1`

### **2. `app/acceder/page.tsx`**
- **Cambio**: Actualizada sección de credenciales de prueba
- **Nueva UI**: Dos tarjetas diferenciadas:
  - 👨‍🌾 Propietario (azul)
  - 🌾 Labrego/a (verde)

### **3. `docs/CREDENCIALES_PRUEBA.md`**
- **Nuevo**: Documentación completa de credenciales
- **Incluye**: Contexto, terminología, datos mock disponibles

---

## 🧪 **Cómo Probar el Dashboard Labrego**

### **Paso 1: Acceder**
```
1. Ir a: http://localhost:3001/acceder
2. Usar: maria@correo.gal / Contrasinal123
3. Click en "Acceder"
```

### **Paso 2: Explorar Dashboard**
Verás:
- ✅ **Dashboard principal**: Estadísticas de cultivo, gastos, meses de experiencia
- ✅ **Próximas fincas**: Alugamentos futuros con detalles de cultivo
- ✅ **Fincas favoritas**: Propiedades guardadas para cultivar
- ✅ **Avaliacións pendentes**: Fincas cultivadas sin avaliar

### **Paso 3: Verificar Funcionalidades**
- 🌾 **Copy gallego** con retranca ("A terra non se cultiva sola!")
- 📊 **Estadísticas** de alugamentos, gastos, meses cultivados
- 🎨 **Badges** de experiencia (principiante → experto)
- 🌱 **Emojis** por tipo de cultivo (hortalizas 🥬, viñedo 🍇, etc.)
- 🔗 **Navegación** a páginas específicas (favoritas, avaliacións, etc.)

---

## 📊 **Datos Mock para María**

### **Alugamentos Activos (2)**
1. **Finca Tradicional Galega**
   - Tipo: Hortalizas 🥬
   - Inicio: 1 Marzo 2024
   - Duración: 6 meses
   - Prezo: 120€/mes
   - Total: 871€

2. **Viñedo Vista Miño**
   - Tipo: Viñedo 🍇
   - Inicio: 1 Abril 2024
   - Duración: 7 meses
   - Prezo: 300€/mes
   - Total: 2,541€

### **Alugamentos Completados (1)**
- **Finca con Frutais**
  - Tipo: Árbores froiteiros 🍎
  - Completado: 30 Xuño 2024
  - Pendente de avaliación ⚠️

### **Fincas Favoritas (3)**
- prop-1: Finca Tradicional Galega
- prop-3: Finca con Frutais
- prop-5: Finca Orgánica Monte Galiñeiro

---

## ✅ **Verificaciones Realizadas**

- ✅ **Compilación exitosa** sin errores
- ✅ **Datos mock** correctamente estructurados
- ✅ **UI actualizada** con credenciales visibles
- ✅ **Documentación** creada y organizada
- ✅ **Terminología** consistente en gallego

---

## 🎯 **Próximos Pasos**

Con esta cuenta podrás probar todas las funcionalidades del **Milestone 04: Dashboard Labrego**:

- ✅ Ver estadísticas de cultivo
- ✅ Gestionar alugamentos
- ✅ Guardar fincas favoritas
- ✅ Revisar avaliacións pendentes
- ✅ Explorar el copy con retranca gallega

---

**Estado**: ✅ **LISTO PARA PROBAR**

Ahora puedes acceder con `maria@correo.gal` / `Contrasinal123` y explorar completamente el dashboard de labregos con todos los datos mock configurados.
