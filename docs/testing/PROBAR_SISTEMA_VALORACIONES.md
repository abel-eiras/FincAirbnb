# 🧪 Cómo Probar el Sistema de Valoraciones - FincAirbnb

**Fecha**: 27 de enero de 2025  
**Milestone**: 08 - Sistema de Reviews  
**Estado**: ✅ Listo para probar  

---

## 🎯 **Datos Mock Creados**

Se ha creado un **alugamento completado** específico para probar el sistema de valoraciones:

### **Alugamento de Prueba**

```json
{
  "id": "alug-8",
  "propertyId": "prop-1",
  "propertyTitle": "Finca orgánica en Ponteareas",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "duration": 12,
  "status": "completed",
  "labregoData": {
    "name": "María Fernández",
    "email": "maria@correo.gal"
  }
}
```

**Características**:
- ✅ **Estado**: `completed` (completado)
- ✅ **Usuario**: María Fernández (maria@correo.gal)
- ✅ **Propiedad**: prop-1 (Finca orgánica en Ponteareas)
- ✅ **Duración**: 12 meses (enero - diciembre 2024)
- ✅ **Fecha de inicio**: 1 de enero de 2024
- ✅ **Fecha de fin**: 31 de diciembre de 2024

---

## 📝 **Pasos para Probar el Sistema**

### **Paso 1: Iniciar la Aplicación**

```bash
npm run dev
```

Abre tu navegador en: `http://localhost:3000`

---

### **Paso 2: Iniciar Sesión como Labrego**

**Credenciales**:
- **Email**: `maria@correo.gal`
- **Contraseña**: `Contrasinal123`

**Ruta de login**: 
- `/acceder` o `/login`

---

### **Paso 3: Ir a "Os Meus Alugamentos"**

**Opciones para acceder**:

1. **Desde el Taboleiro**:
   - Después de iniciar sesión → Dashboard
   - Click en botón **"Os Meus Alugamentos"** en "Accións Rápidas"

2. **Desde el menú de usuario**:
   - Click en el avatar en la esquina superior derecha
   - Seleccionar **"Os Meus Alugamentos"**

3. **URL directa**:
   - `http://localhost:3000/taboleiro/mos-alugamentos`

---

### **Paso 4: Localizar el Alugamento Completado**

En la página "Os Meus Alugamentos" deberías ver:

**Filtros disponibles**:
- Todos
- Pendente
- Aceptado
- Rexeitado
- Completado ⭐ **← Seleccionar este**
- Cancelado

**Características del alugamento**:
- ✅ **Badge verde**: "Completado"
- ✅ **Título**: "Finca orgánica en Ponteareas"
- ✅ **Duración**: 12 meses
- ✅ **Botón amarillo**: **"Valorar Finca"** ⭐

---

### **Paso 5: Click en "Valorar Finca"**

Al hacer click en el botón **"Valorar Finca"**, serás redirigido a:

**URL**: `/alugamentos/alug-8/valorar`

**Deberías ver**:
- ✅ Header con información de la propiedad
- ✅ Imagen de la finca
- ✅ Título: "Finca orgánica en Ponteareas"
- ✅ Formulario completo de valoración

---

### **Paso 6: Completar el Formulario de Valoración**

#### **6.1 Rating General** (Requerido)
- Click en las estrellas para valorar (1-5)
- Ejemplo: Selecciona **5 estrellas**

#### **6.2 Valoración por Categorías** (Requerido)
Para cada categoría, selecciona las estrellas:

- **Limpeza**: 5 estrellas
- **Comunicación**: 5 estrellas
- **Precisión**: 4 estrellas
- **Localización**: 5 estrellas
- **Calidade-prezo**: 4 estrellas

#### **6.3 Título** (Opcional)
Ejemplo: *"Unha experiencia maravillosa de cultivo!"*

#### **6.4 Comentario** (Requerido - mínimo 50 caracteres)
Ejemplo:
```
A finca é perfecta para cultivar hortalizas ecolóxicas. O propietario foi 
moi atento e sempre estivo dispoñible para resolver dúbidas. A terra é 
fértil e o acceso é moi bo. Totalmente recomendable para calquera labrego 
que busque unha finca ben mantida e nun ambiente tranquilo.
```

#### **6.5 Recomendarías esta finca?**
- Toggle: **Activado** (Sí)

---

### **Paso 7: Enviar Valoración**

1. Verifica que el comentario tenga al menos 50 caracteres
2. Click en botón **"Enviar valoración"**
3. Deberías ver:
   - ✅ Spinner de carga
   - ✅ Mensaje de éxito: "¡Valoración enviada!"
   - ✅ Redirección automática al taboleiro

---

### **Paso 8: Verificar la Valoración**

#### **8.1 En la Página de la Propiedad**

**URL**: `/fincas/prop-1`

**Ruta de navegación**:
1. Ir a "Buscar Fincas" (desde el header o menú)
2. Click en "Finca orgánica en Ponteareas"
3. Scroll hacia abajo hasta la sección **"Avaliacións dos labregos"**

**Deberías ver**:
- ✅ **Rating promedio** actualizado
- ✅ **Total de valoraciones** incrementado
- ✅ **Rating breakdown** con distribución
- ✅ **Tu valoración** en la lista de reviews
- ✅ **Ratings por categorías** visibles

#### **8.2 Contenido de la Review**

Tu review debería mostrar:
- ✅ Avatar y nombre: "María Fernández"
- ✅ Rating de 5 estrellas (o el que seleccionaste)
- ✅ Fecha de la valoración
- ✅ Badge "Recomenda" (si activaste la recomendación)
- ✅ Título de la review
- ✅ Comentario completo
- ✅ Botones: "Útil", "Reportar"

---

## 🔄 **Flujos Adicionales para Probar**

### **1. Intentar Valorar un Alugamento No Completado**

**Objetivo**: Verificar que solo se puede valorar alugamentos completados

**Pasos**:
1. En "Os Meus Alugamentos", busca un alugamento con estado "Aceptado"
2. **NO** debería aparecer el botón "Valorar Finca"
3. Solo debería aparecer "Contactar Propietario" y/o "Cancelar Alugamento"

---

### **2. Marcar Review como Útil**

**Objetivo**: Probar el sistema de votos útiles

**Pasos**:
1. Ve a la página de la propiedad (`/fincas/prop-1`)
2. Scroll hasta tu review
3. Click en botón **"Útil"**
4. El contador debería incrementarse: "Útil (1)"
5. El botón debería deshabilitarse

---

### **3. Filtrar y Ordenar Reviews**

**Objetivo**: Probar filtros y ordenación

**Pasos**:

#### **Filtros**:
1. En la página de la propiedad, localiza la sección de reviews
2. Usa el dropdown **"Filtrar:"**
3. Selecciona diferentes opciones:
   - Todas
   - 5 ⭐
   - 4 ⭐
   - etc.
4. La lista debería actualizarse según el filtro

#### **Ordenación**:
1. Usa el dropdown **"Ordenar:"**
2. Selecciona diferentes opciones:
   - Máis recentes
   - Máis útiles
   - Rating alto
   - Rating baixo
3. La lista debería reordenarse

---

### **4. Responder a una Review (Como Propietario)**

**Objetivo**: Probar el sistema de respuestas

**Pasos**:
1. Cierra sesión (logout)
2. Inicia sesión como propietario:
   - **Email**: `xose@correo.gal`
   - **Contraseña**: `Contrasinal123`
3. Ve a la página de tu propiedad (`/fincas/prop-1`)
4. Localiza la review de María
5. Click en botón **"Responder"**
6. Escribe una respuesta (10-500 caracteres)
7. Click en **"Enviar resposta"**
8. La respuesta debería aparecer debajo de la review

**Ejemplo de respuesta**:
```
Moitas grazas, María! Foi un pracer ter a ti como labrega nesta finca. 
As túas hortalizas ecolóxicas foron un éxito! Espero que volvas pronto. 
Un saúdo!
```

---

## 🐛 **Casos de Error a Verificar**

### **1. Comentario Muy Corto**

**Pasos**:
1. En el formulario de valoración
2. Escribe menos de 50 caracteres
3. Intenta enviar
4. **Resultado esperado**: Error "O comentario debe ter polo menos 50 caracteres"

---

### **2. Sin Rating**

**Pasos**:
1. No selecciones ninguna estrella
2. Completa el resto del formulario
3. Intenta enviar
4. **Resultado esperado**: Botón de envío deshabilitado

---

### **3. Acceso Directo sin Permisos**

**Pasos**:
1. Intenta acceder a `/alugamentos/alug-8/valorar` sin estar logueado
2. **Resultado esperado**: Redirección a login

**O**:

1. Intenta acceder con un usuario propietario (xose@correo.gal)
2. **Resultado esperado**: Mensaje de error de permisos

---

## 📊 **Checklist de Funcionalidades**

### **Formulario de Valoración**
- [ ] Rating general funciona (1-5 estrellas)
- [ ] Ratings por categorías funcionan
- [ ] Título se puede escribir (opcional)
- [ ] Comentario valida longitud mínima (50 caracteres)
- [ ] Comentario valida longitud máxima (1000 caracteres)
- [ ] Toggle de recomendación funciona
- [ ] Botón de envío se habilita/deshabilita según validaciones
- [ ] Spinner de carga aparece al enviar
- [ ] Mensaje de éxito aparece
- [ ] Redirección funciona después de enviar
- [ ] Botón "Cancelar" vuelve a la página anterior

### **Visualización de Reviews**
- [ ] Rating breakdown muestra estadísticas correctas
- [ ] Gráfico de distribución es correcto
- [ ] Promedios por categorías son precisos
- [ ] Filtros funcionan correctamente
- [ ] Ordenación funciona correctamente
- [ ] Reviews individuales se muestran completas
- [ ] Avatar y nombre del reviewer se muestran
- [ ] Fecha se muestra en formato correcto
- [ ] Badge "Recomenda" aparece si corresponde
- [ ] Botón "Útil" funciona
- [ ] Contador de votos útiles se actualiza

### **Sistema de Respuestas**
- [ ] Solo propietarios pueden responder
- [ ] Formulario de respuesta valida longitud
- [ ] Respuesta se guarda correctamente
- [ ] Respuesta se muestra en la review
- [ ] Consejos para propietarios se muestran

### **Integración**
- [ ] Botón "Valorar Finca" aparece solo en alugamentos completados
- [ ] Navegación entre páginas funciona
- [ ] Estados de carga se muestran
- [ ] Errores se manejan correctamente
- [ ] Datos persisten en localStorage

---

## 🎯 **Resultados Esperados**

Al completar todas las pruebas, deberías haber verificado:

✅ **Creación de reviews** funciona correctamente  
✅ **Visualización** de reviews es completa y correcta  
✅ **Filtros y ordenación** funcionan como esperado  
✅ **Respuestas de propietarios** funcionan  
✅ **Validaciones** previenen datos incorrectos  
✅ **Permisos** se verifican correctamente  
✅ **UX/UI** es intuitiva y responsive  
✅ **Navegación** es fluida y sin errores  

---

## 📝 **Notas Importantes**

1. **Datos Mock**: Todos los datos se guardan en `localStorage`, así que persisten entre recargas pero se pierden al limpiar el navegador.

2. **Alugamento de Prueba**: El alugamento `alug-8` está configurado con fecha de fin en el pasado (31 de diciembre de 2024) para que aparezca el botón de valorar.

3. **Reviews Múltiples**: Puedes crear múltiples reviews para la misma propiedad desde diferentes usuarios para probar el sistema completo.

4. **Propietario**: Para probar las respuestas, usa las credenciales de Xosé (xose@correo.gal / Contrasinal123).

5. **Recarga de Página**: Si no ves cambios inmediatos, recarga la página para asegurar que los datos se carguen desde localStorage.

---

**¡Disfruta probando el sistema de valoraciones! 🌟**

Si encuentras algún error o comportamiento inesperado, documéntalo con:
- Pasos para reproducir
- Comportamiento esperado vs actual
- Capturas de pantalla si es posible







