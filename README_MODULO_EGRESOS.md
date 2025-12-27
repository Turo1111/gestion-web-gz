# 🚀 Módulo de Egresos - Guía Rápida de Uso

## ✅ Implementación Completada

El módulo de egresos ha sido implementado completamente con las siguientes funcionalidades:

### 📁 Archivos Creados

1. **Interfaces y Tipos** (`src/interfaces/expense.interface.ts`)
   - DTOs para crear egresos
   - Enums: ExpenseType, PaymentMethod
   - Interfaces para formularios y errores

2. **Servicio API** (`src/services/expense.service.ts`)
   - CRUD completo (crear, listar, actualizar, eliminar)
   - Integrado con apiClient (incluye auth automática)

3. **Redux** (`src/redux/expenseSlice.tsx`)
   - State management para egresos
   - Acciones: setExpenses, addExpense, updateExpense, etc.
   - Store actualizado en `store.tsx`

4. **Componentes UI**
   - `src/components/expense/ExpenseForm.tsx` - Formulario desktop
   - `src/components/expense/ExpenseFormMobile.tsx` - Formulario mobile
   - `src/app/expense/page.tsx` - Listado de egresos
   - `src/app/expense/newExpense/page.tsx` - Página nuevo egreso

5. **Analytics** (`src/utils/analytics.ts`)
   - Tracking de eventos: expense_created, expense_creation_error
   - Preparado para Google Analytics 4

6. **Dashboard Actualizado**
   - Nueva opción "EGRESOS" en el menú lateral
   - Icono: MdOutlineMoneyOff

---

## 🎯 Cómo Usar

### 1. Acceder al Módulo

- En el **Dashboard**, click en "**EGRESOS**" en el menú lateral
- Te lleva a `/expense` (listado de egresos)

### 2. Crear un Nuevo Egreso

1. Click en botón "**Nuevo Egreso**"
2. Completa el formulario:
   - **Fecha**: Por defecto viene con hoy (puedes cambiarla, pero no futuras)
   - **Monto**: Ingresa el monto con hasta 2 decimales (ej: 1234.56)
   - **Categoría**: Escribe o selecciona de las sugerencias (ej: Combustible, Sueldos)
   - **Tipo de Egreso**: Operativo (default), Personal, Otro Negocio
   - **Medio de Pago**: Efectivo, Transferencia, Tarjeta, Cheque, Otro
   - **Descripción**: (Opcional) Detalles adicionales (max 500 caracteres)
3. Click en "**Guardar**"
4. Verás un mensaje de éxito y serás redirigido al listado
5. El egreso aparecerá inmediatamente en la tabla

### 3. Ver Listado de Egresos

- Muestra todos los egresos con:
  - Fecha
  - Categoría
  - Tipo (con badge de colores)
  - Monto (formateado como moneda ARS)
  - Medio de pago
- Estadísticas en tarjetas superiores:
  - Total de egresos
  - Monto total acumulado

---

## 🔍 Características Destacadas

### ✨ Autocomplete de Categorías
Cuando escribes en "Categoría", aparecen sugerencias como:
- Combustible
- Sueldos
- Mantenimiento
- Alquiler
- Servicios
- Insumos
- Impuestos
- Transporte
- Otros

Puedes seleccionar una o escribir una nueva.

### ✅ Validaciones en Tiempo Real
- **Monto**: Solo acepta números positivos con máximo 2 decimales
- **Fecha**: No permite fechas futuras
- **Descripción**: Contador de caracteres (0/500)
- Los errores se muestran debajo de cada campo

### 📱 Responsive
- **Desktop** (>940px): Formulario en dos columnas, optimizado para pantalla grande
- **Mobile** (≤940px): Formulario en una columna, inputs y botones adaptados para táctil

### 🔔 Notificaciones
- **Éxito**: Alert verde con mensaje "Egreso registrado exitosamente"
- **Error**: Alert rojo con detalles del problema (campos faltantes, permisos, etc.)

---

## ⚙️ Configuración Necesaria

### Variables de Entorno

Asegúrate de tener en `.env.local`:

```env
NEXT_PUBLIC_DB_HOST=http://localhost:5000
```

### Backend Requerido

El backend debe estar corriendo en el puerto especificado con los siguientes endpoints:

- `POST /expense` - Crear egreso
- `GET /expense` - Listar egresos
- `GET /expense/:id` - Obtener egreso por ID

### Permisos

El usuario autenticado debe tener el permiso `create_expense` en el backend.

---

## 🐛 Solución de Problemas Comunes

### "No tienes permisos para crear egresos"
**Solución**: Contactar al administrador para asignar el permiso `create_expense` a tu usuario.

### El formulario no valida correctamente
**Revisión**:
- Monto debe ser mayor a 0
- Fecha no puede ser futura
- Categoría debe tener al menos 2 caracteres
- Tipo de egreso y medio de pago son obligatorios

### No aparece en el menú "EGRESOS"
**Solución**: Refresca la página con `Ctrl+F5` para limpiar caché.

---

## 📊 Próximas Funcionalidades (Roadmap)

- [ ] **Editar egreso**: Modificar egresos existentes
- [ ] **Eliminar egreso**: Soft delete con confirmación
- [ ] **Filtros avanzados**: Por fecha, tipo, categoría, medio de pago
- [ ] **Exportar a Excel**: Descargar listado de egresos
- [ ] **Gráficos**: Visualización de gastos por categoría/tipo
- [ ] **Categorías maestras**: Gestión de categorías desde admin
- [ ] **Centro de costo**: Asignación de egresos a centros de costo
- [ ] **Comprobantes**: Adjuntar fotos/PDFs de facturas

---

## 📝 Casos de Uso Ejemplo

### Caso 1: Cargar Combustible
1. Ir a "Nuevo Egreso"
2. Fecha: (mantener hoy)
3. Monto: 15000
4. Categoría: Combustible (seleccionar de sugerencias)
5. Tipo: Operativo
6. Medio de Pago: Efectivo
7. Descripción: "Carga de nafta camioneta de reparto"
8. Guardar

### Caso 2: Registrar Sueldo
1. Ir a "Nuevo Egreso"
2. Fecha: (seleccionar día de pago)
3. Monto: 250000
4. Categoría: Sueldos
5. Tipo: Operativo
6. Medio de Pago: Transferencia
7. Descripción: "Sueldo mensual empleado Juan Pérez"
8. Guardar

### Caso 3: Gasto Personal
1. Ir a "Nuevo Egreso"
2. Fecha: (mantener hoy)
3. Monto: 5000
4. Categoría: Otros
5. Tipo: Personal
6. Medio de Pago: Efectivo
7. Descripción: (dejar vacío o completar)
8. Guardar

---

## 📞 Contacto y Soporte

Si encuentras algún problema o tienes sugerencias:
1. Revisa la documentación completa en `/Documentacion/Modulo_Egresos_Implementacion.md`
2. Crea un ticket siguiendo el lineamiento en `/Documentacion/Lineamiento_Creacion_Tickets.md`
3. Contacta al equipo de desarrollo

---

## ✅ Checklist de Verificación Post-Implementación

- [x] Interfaces TypeScript creadas
- [x] Servicio API implementado
- [x] Redux slice configurado
- [x] Componentes de formulario (desktop + mobile)
- [x] Página de listado
- [x] Menú Dashboard actualizado
- [x] Validaciones client-side
- [x] Analytics integrado
- [x] Documentación completa
- [ ] Backend corriendo y conectado
- [ ] Variable de entorno configurada
- [ ] Permisos de usuario asignados
- [ ] Pruebas E2E ejecutadas

---

**¡El módulo de egresos está listo para usar! 🎉**

Cualquier duda, consulta la documentación técnica completa.
