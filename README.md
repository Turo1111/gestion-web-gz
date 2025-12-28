# 📦 GESTION-WEB-GZ

Sistema de gestión empresarial web para Golozur, una plataforma integral para la administración de productos, ventas y compras.

---

## 📋 Descripción General

**Gestion-Web-GZ** es una aplicación web moderna desarrollada con Next.js 14 que permite la gestión completa de un negocio de distribución. El sistema integra funcionalidades para:

- 🏠 **Dashboard con estadísticas en tiempo real** - Visualización de métricas de ventas y compras
- 📦 **Gestión de productos** - CRUD completo con categorías, marcas y proveedores
- 💰 **Gestión de ventas** - Creación, edición e impresión de ventas
- 🛒 **Gestión de compras** - Administración de compras a proveedores
- 📊 **Reportes y gráficos** - Análisis de datos con diferentes intervalos temporales
- 🔐 **Autenticación de usuarios** - Sistema de login con JWT

---

## 🛠️ Tecnologías Utilizadas

### Core
- **Next.js 14.1.4** - Framework React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript 5.3.2** - Tipado estático
- **Styled Components 6.1.13** - Estilos CSS-in-JS

### Estado y Datos
- **Redux Toolkit 2.2.5** - Gestión de estado global
- **React Redux 9.1.2** - Integración de Redux con React
- **Axios 1.6.2** - Cliente HTTP para API requests
- **Socket.io Client 4.7.5** - Comunicación en tiempo real

### UI y Visualización
- **Material-UI 5.16.7** - Componentes de UI
- **MUI X Charts 7.13.0** - Gráficos y visualizaciones
- **MUI X Date Pickers 7.17.0** - Selectores de fecha
- **Recharts 2.15.0** - Biblioteca de gráficos
- **Framer Motion 11.11.11** - Animaciones
- **React Icons 5.2.1** - Biblioteca de iconos
- **React Random Avatars 1.3.1** - Generación de avatares

### Formularios y Validación
- **Formik 2.4.5** - Manejo de formularios
- **Yup 1.4.0** - Validación de esquemas

### Utilidades
- **date-fns 2.28.0** - Manipulación de fechas
- **html2canvas 1.4.1** - Captura de screenshots
- **jspdf 2.5.1** - Generación de PDFs
- **Mongoose 8.5.3** - ODM para MongoDB (tipado)

---

## 📁 Estructura del Proyecto

```
gestion-web-gz/
│
├── public/                          # Archivos públicos estáticos
│   ├── bgcircle.jpg
│   ├── next.svg
│   └── vercel.svg
│
├── src/
│   ├── app/                         # Rutas de la aplicación (App Router)
│   │   ├── page.tsx                 # Página de login (/)
│   │   ├── layout.tsx               # Layout principal con Provider
│   │   ├── globals.css              # Estilos globales
│   │   │
│   │   ├── home/                    # Dashboard principal
│   │   │   └── page.tsx             # Estadísticas y gráficos
│   │   │
│   │   ├── product/                 # Módulo de productos
│   │   │   └── page.tsx             # Lista de productos
│   │   │
│   │   ├── sale/                    # Módulo de ventas
│   │   │   ├── page.tsx             # Lista de ventas
│   │   │   ├── newSale/             # Nueva venta
│   │   │   │   └── page.tsx
│   │   │   └── editSale/            # Editar venta
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   └── buy/                     # Módulo de compras
│   │       ├── page.tsx             # Lista de compras
│   │       ├── newBuy/              # Nueva compra
│   │       │   └── page.tsx
│   │       └── editBuy/             # Editar compra
│   │           └── [id]/
│   │               └── page.tsx
│   │
│   ├── components/                  # Componentes reutilizables
│   │   ├── Alert.tsx                # Sistema de alertas
│   │   ├── AnimatedNumber.tsx       # Animación de números
│   │   ├── Button.tsx               # Botón personalizado
│   │   ├── ButtonUI.tsx             # Botón UI alternativo
│   │   ├── Burger.tsx               # Menú hamburguesa
│   │   ├── Confirm.tsx              # Diálogo de confirmación
│   │   ├── CustomDataSet.tsx        # Selector de rango de fechas
│   │   ├── Dashboard.tsx            # Layout con navegación lateral
│   │   ├── Input.tsx                # Input de texto
│   │   ├── InputSelect.tsx          # Select personalizado
│   │   ├── InputSelectAdd.tsx       # Select con opción de agregar
│   │   ├── Loading.tsx              # Pantalla de carga
│   │   ├── MiniLoading.tsx          # Indicador de carga pequeño
│   │   ├── Modal.tsx                # Modal genérico
│   │   ├── ModalLoading.tsx         # Modal de carga
│   │   ├── ModalUnfolding.tsx       # Modal desplegable
│   │   ├── Logo.tsx                 # Logo de la aplicación
│   │   ├── Search.tsx               # Barra de búsqueda
│   │   ├── SelectBox.tsx            # Caja de selección
│   │   ├── SimpleCheckbox.tsx       # Checkbox simple
│   │   ├── Table.tsx                # Tabla genérica
│   │   │
│   │   ├── buy/                     # Componentes de compras
│   │   │   ├── AddBuyItem.tsx       # Agregar ítem a compra
│   │   │   ├── ContainerBuyMobile.tsx  # Vista móvil de compra
│   │   │   ├── ContainerBuyWeb.tsx  # Vista web de compra
│   │   │   ├── InfoBuy.tsx          # Información de compra
│   │   │   ├── ItemLineaCompra.tsx  # Ítem individual
│   │   │   ├── LineaCompra.tsx      # Línea de compra
│   │   │   ├── ListLineaCompra.tsx  # Lista de líneas
│   │   │   └── ModalAutoGenerate.tsx # Auto-generación
│   │   │
│   │   ├── products/                # Componentes de productos
│   │   │   ├── FilterProduct.tsx    # Filtro de productos
│   │   │   ├── ItemsProducts.tsx    # Ítem de producto
│   │   │   ├── ModalProduct.tsx     # Modal de detalles
│   │   │   ├── NewProduct.tsx       # Crear producto
│   │   │   ├── PrintProduct.tsx     # Imprimir productos
│   │   │   └── UpdatePrice.tsx      # Actualizar precios
│   │   │
│   │   └── sale/                    # Componentes de ventas
│   │       ├── ContainerSaleMobile.tsx  # Vista móvil
│   │       ├── ContainerSaleWeb.tsx # Vista web
│   │       ├── FindProductSale.tsx  # Buscar producto
│   │       ├── InfoSale.tsx         # Info de venta
│   │       ├── ItemLineaVenta.tsx   # Ítem de venta
│   │       ├── LineaVenta.tsx       # Línea de venta
│   │       ├── ListLineaVenta.tsx   # Lista de líneas
│   │       ├── ModalPrintSale.tsx   # Modal de impresión
│   │       ├── PrintMultipleSale.tsx # Impresión múltiple
│   │       └── PrintSale.tsx        # Imprimir venta
│   │
│   ├── hooks/                       # Custom Hooks
│   │   ├── useDate.tsx              # Hook para manejo de fechas
│   │   ├── useInternetStatus.tsx    # Detectar conexión a internet
│   │   ├── useLocalStorage.tsx      # Persistencia en localStorage
│   │   ├── useOutsideClick.tsx      # Detectar clicks externos
│   │   └── useResize.tsx            # Detectar cambios de tamaño
│   │
│   ├── interfaces/                  # Definiciones de TypeScript
│   │   ├── auth.interface.ts        # Tipos de autenticación
│   │   ├── buy.interface.ts         # Tipos de compras
│   │   ├── product.interface.ts     # Tipos de productos
│   │   └── sale.interface.ts        # Tipos de ventas
│   │
│   ├── redux/                       # Estado global Redux
│   │   ├── store.tsx                # Configuración del store
│   │   ├── hook.tsx                 # Hooks tipados de Redux
│   │   ├── alertSlice.tsx           # Estado de alertas
│   │   ├── buySlice.tsx             # Estado de compras
│   │   ├── loadingSlice.tsx         # Estado de carga
│   │   ├── saleSlice.tsx            # Estado de ventas
│   │   └── userSlice.tsx            # Estado de usuario
│   │
│   └── utils/                       # Utilidades
│       └── client.tsx               # Cliente Axios configurado
│
├── .eslintrc.json                   # Configuración ESLint
├── .gitignore                       # Archivos ignorados por Git
├── next.config.mjs                  # Configuración de Next.js
├── next.config.ts                   # Configuración TypeScript
├── package.json                     # Dependencias y scripts
├── postcss.config.mjs               # Configuración PostCSS
├── tsconfig.json                    # Configuración TypeScript
└── README.md                        # Este archivo
```

---

## 🏗️ Arquitectura de la Aplicación

### 1. **App Router (Next.js 14)**
La aplicación utiliza el nuevo sistema de rutas de Next.js basado en carpetas dentro de `src/app/`.

### 2. **Redux para Estado Global**
Se utiliza Redux Toolkit para gestionar el estado de:
- Usuario autenticado
- Alertas del sistema
- Estado de carga (loading)
- Ventas en proceso
- Compras en proceso

### 3. **Styled Components**
Todos los estilos están implementados con Styled Components, permitiendo:
- Estilos con scope por componente
- Props dinámicas para estilos
- Temas y variables CSS-in-JS

### 4. **Axios Client con Interceptores**
Cliente HTTP configurado con:
- Base URL desde variables de entorno
- Interceptor para agregar token JWT automáticamente
- Manejo de errores centralizado

### 5. **Socket.io para Tiempo Real**
Actualización automática de datos cuando:
- Se crea/edita un producto
- Se registra una venta
- Se registra una compra

---

## 🔑 Módulos Principales

### 🔐 **Autenticación**

**Ubicación:** `src/app/page.tsx`

**Funcionalidad:**
- Login con nickname y contraseña
- Validación con Formik y Yup
- Almacenamiento de token JWT en localStorage
- Redirección automática a `/home` tras login exitoso

**Flujo:**
1. Usuario ingresa credenciales
2. Se envía POST a `/auth/login`
3. Se recibe token JWT
4. Token se guarda en localStorage y Redux
5. Redirección a dashboard

---

### 🏠 **Dashboard / Home**

**Ubicación:** `src/app/home/page.tsx`

**Funcionalidad:**
- Visualización de estadísticas de ventas y compras
- Selección de intervalos: Diario, Semanal, Mensual, Anual, Personalizado
- Gráficos de barras comparativos (Recharts)
- Tarjetas animadas con métricas clave:
  - Cantidad de transacciones
  - Total en dinero
  - Intervalo temporal
- Switch entre vista de ventas y compras
- Lista de últimos movimientos

**Endpoints utilizados:**
- `GET /dataset/daily` (weekly, monthly, annually)
- `GET /dataset/custom/:startDate/:endDate`

**Componentes principales:**
- `CustomDataSet` - Selector de rango de fechas
- `ButtonUI` - Botones de intervalos
- `AnimatedNumber` - Animación de números

---

### 📦 **Gestión de Productos**

**Ubicación:** `src/app/product/page.tsx`

**Funcionalidad:**
- Listado de productos con scroll infinito
- Búsqueda en tiempo real
- Filtros por categoría, marca y proveedor
- Creación de nuevos productos
- Edición de productos existentes
- Actualización masiva de precios
- Impresión de catálogo

**Endpoints utilizados:**
- `POST /product/skip` - Paginación
- `POST /product/search` - Búsqueda con filtros
- Socket: `product` - Actualizaciones en tiempo real

**Componentes:**
- `ItemsProducts` - Card de producto individual
- `ModalProduct` - Detalles y edición
- `NewProduct` - Crear producto
- `UpdatePrice` - Actualizar precios
- `PrintProduct` - Imprimir catálogo
- `FilterProduct` - Filtros avanzados

**Estructura de Producto:**
```typescript
interface Product {
  _id: string
  descripcion: string
  stock: number
  codigoBarra?: string
  peso?: { cantidad: number, unidad: string }
  bulto?: number
  sabor?: string
  precioCompra?: number
  precioUnitario: number
  precioDescuento?: number
  precioBulto?: number
  categoria: string | ObjectId
  marca: string | ObjectId
  proveedor: string | ObjectId
  path?: string
}
```

---

### 💰 **Gestión de Ventas**

**Ubicación:** `src/app/sale/`

#### **Lista de Ventas** (`page.tsx`)

**Funcionalidad:**
- Listado de ventas con scroll infinito
- Búsqueda por cliente o fecha
- Selección múltiple para impresión masiva
- Edición de ventas
- Impresión individual o múltiple de comprobantes
- Información detallada de cada venta

**Endpoints:**
- `POST /sale/skip` - Paginación
- `POST /sale/search` - Búsqueda
- `GET /sale/print/:id` - Imprimir una venta (PDF)
- `POST /sale/print` - Imprimir múltiples ventas (PDF)
- Socket: `sale` - Nuevas ventas en tiempo real

#### **Nueva Venta** (`newSale/page.tsx`)

**Funcionalidad:**
- Selección de cliente
- Búsqueda y agregado de productos
- Modificación de cantidades
- Ajuste de precios por producto
- Cálculo automático de totales
- Responsive (vista web y móvil)

**Componentes:**
- `ContainerSaleWeb` / `ContainerSaleMobile`
- `FindProductSale` - Búsqueda de productos
- `ListLineaVenta` - Lista de ítems
- `ItemLineaVenta` - Ítem individual con controles

**Redux Slice:** `saleSlice`

**Acciones disponibles:**
- `addItemSale` - Agregar producto
- `deleteItemSale` - Eliminar producto
- `upQTYSale` / `downQTYSale` - Incrementar/decrementar cantidad (+1/-1)
- `upQTY10Sale` / `downQTY10Sale` - Incrementar/decrementar cantidad (+10/-10)
- `onChangePrecioUnitarioSale` - Cambiar precio unitario
- `onChangeClientSale` - Cambiar cliente
- `resetSale` - Limpiar venta

#### **Editar Venta** (`editSale/[id]/page.tsx`)

**Funcionalidad:**
- Carga de venta existente
- Modificación de ítems
- Actualización en base de datos

**Endpoint:**
- `GET /sale/:id` - Obtener venta
- `PUT /sale/:id` - Actualizar venta

---

### 🛒 **Gestión de Compras**

**Ubicación:** `src/app/buy/`

**Funcionalidad similar a Ventas:**
- Lista de compras (`page.tsx`)
- Nueva compra (`newBuy/page.tsx`)
- Editar compra (`editBuy/[id]/page.tsx`)

**Componentes:**
- `ContainerBuyWeb` / `ContainerBuyMobile`
- `AddBuyItem` - Agregar producto a compra
- `ListLineaCompra` - Lista de ítems
- `ItemLineaCompra` - Ítem individual
- `InfoBuy` - Información de compra
- `ModalAutoGenerate` - Auto-generación de compras

**Redux Slice:** `buySlice` (estructura similar a `saleSlice`)

**Estructura de Compra:**
```typescript
interface Buy {
  _id?: string
  estado: string
  user?: ObjectId
  proveedor: string
  total: number
  createdAt: string
  itemsBuy: ItemBuy[]
}

interface ItemBuy {
  idProducto: string
  cantidad: number
  total: number
  precio: number
  estado: boolean
}
```

---

## 🎨 Componentes UI Compartidos

### **Dashboard.tsx**
Layout principal con:
- Sidebar con navegación
- Header responsive
- Menú hamburguesa en móvil
- Avatar de usuario
- Logout
- Verificación de autenticación

### **Alert.tsx**
Sistema de notificaciones con Redux:
- Tipos: success, warning, error, info
- Auto-cierre configurable
- Animaciones con framer-motion

### **ModalLoading.tsx**
Modal de carga global controlado por Redux:
```typescript
dispatch(setLoading(true))  // Mostrar
dispatch(setLoading(false)) // Ocultar
```

### **Button / ButtonUI**
Botones personalizados con:
- Estilos consistentes
- Loading state
- Soporte para Link de Next.js

### **Input / InputSelect**
Inputs con:
- Labels flotantes
- Validación visual
- Integración con Formik

### **Search.tsx**
Barra de búsqueda con:
- Debounce opcional
- Icono de búsqueda
- Limpieza rápida

---

## 🔧 Custom Hooks

### **useLocalStorage**
```typescript
const [value, setValue, clearValue] = useLocalStorage("key", defaultValue)
```
Sincroniza estado con localStorage automáticamente.

### **useResize**
```typescript
const { ancho, alto } = useResize()
```
Detecta cambios en el tamaño de la ventana para responsive.

### **useDate**
Utilidad para formateo de fechas con date-fns.

### **useInternetStatus**
Detecta si hay conexión a internet.

### **useOutsideClick**
Detecta clicks fuera de un elemento (útil para cerrar modales).

---

## 🔄 Estado Global (Redux)

### **Store Configuration** (`store.tsx`)
```typescript
{
  user: UserWithToken,     // Usuario autenticado
  loading: boolean,        // Estado de carga global
  alert: Alert,            // Alertas del sistema
  sale: Sale,              // Venta en proceso
  buy: Buy                 // Compra en proceso
}
```

### **Slices:**

#### **userSlice**
- `setUser(user)` - Guardar usuario
- `clearUser()` - Limpiar usuario

#### **loadingSlice**
- `setLoading(boolean)` - Mostrar/ocultar loading

#### **alertSlice**
- `setAlert({ message, type })` - Mostrar alerta

#### **saleSlice**
Estado y operaciones de venta en proceso (ver sección de Ventas).

#### **buySlice**
Estado y operaciones de compra en proceso (similar a saleSlice).

---

## 🌐 Integración con API

### **Cliente Axios** (`utils/client.tsx`)

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_HOST
})

// Interceptor para agregar token JWT
apiClient.interceptors.request.use(async (config) => {
  const token = window.localStorage.getItem('user')
  if (token) {
    const tokenParsed = JSON.parse(token)
    config.headers.Authorization = `Bearer ${tokenParsed.token}`
  }
  return config
})
```

### **Socket.io Client**

Configuración para tiempo real:
```typescript
const socket = io(process.env.NEXT_PUBLIC_DB_HOST)

socket.on('product', (data) => {
  // Actualizar producto en tiempo real
})

socket.on('sale', (data) => {
  // Nueva venta en tiempo real
})
```

---

## 🚀 Instalación y Configuración

### **Requisitos Previos**
- Node.js 18 o superior
- npm o pnpm
- API Backend en ejecución

### **Pasos de Instalación**

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd gestion-web-gz
```

2. **Instalar dependencias:**
```bash
npm install
# o
pnpm install
```

3. **Configurar variables de entorno:**

Crear archivo `.env.local` en la raíz:
```env
NEXT_PUBLIC_DB_HOST=http://localhost:3001
```

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

5. **Construir para producción:**
```bash
npm run build
npm start
```

---

## 📜 Scripts Disponibles

```json
{
  "dev": "next dev",           // Servidor de desarrollo
  "build": "next build",       // Construir para producción
  "start": "next start",       // Servidor de producción
  "lint": "next lint",         // Linter ESLint
  "tsc": "tsc"                 // Verificar tipos TypeScript
}
```

---

## 🎯 Flujos de Trabajo Principales

### **Flujo de Autenticación**
```
Login → Validación → Obtener Token → Guardar en localStorage y Redux → Redirect a /home
```

### **Flujo de Creación de Venta**
```
1. Usuario navega a /sale/newSale
2. Ingresa nombre de cliente (Redux: onChangeClientSale)
3. Busca productos (componente FindProductSale)
4. Agrega productos (Redux: addItemSale)
5. Modifica cantidades (Redux: upQTYSale, downQTYSale)
6. Ajusta precios si es necesario (Redux: onChangePrecioUnitarioSale)
7. Revisa total calculado automáticamente
8. Envía venta (POST /sale)
9. Socket.io notifica a otros clientes
10. Redirect a /sale (lista de ventas)
```

### **Flujo de Scroll Infinito**
```
1. Se cargan primeros 25 registros (skip: 0, limit: 25)
2. IntersectionObserver detecta cuando se llega al final
3. Se incrementa skip en 25 (skip: 25, limit: 25)
4. Se cargan siguientes 25 registros
5. Se agregan al array existente (sin duplicados)
6. Se repite hasta que data.length === longArray
```

### **Flujo de Actualización en Tiempo Real**
```
1. Cliente A crea/edita un producto
2. Backend emite evento socket 'product'
3. Todos los clientes conectados reciben el evento
4. React actualiza el estado local sin hacer request
5. UI se actualiza automáticamente
```

---

## 📱 Responsive Design

La aplicación es completamente responsive con breakpoints:

- **Desktop:** > 940px - Sidebar fijo, vista completa
- **Tablet:** 500px - 940px - Sidebar colapsable
- **Mobile:** < 500px - Vista móvil optimizada, menú hamburguesa

Componentes adaptativos:
- `ContainerSaleWeb` / `ContainerSaleMobile`
- `ContainerBuyWeb` / `ContainerBuyMobile`
- Dashboard con sidebar responsive

---

## 🎨 Paleta de Colores

```css
/* Colores principales */
--primary-blue: #3764A0
--primary-orange: #FA9B50
--success-green: #99BC85
--danger-red: #DC8686
--text-dark: #252525
--text-gray: #716A6A
--bg-light: #f1f1f1
--border-gray: #d9d9d9
```

---

## 🔒 Seguridad

- **JWT Token:** Almacenado en localStorage
- **Interceptores Axios:** Token agregado automáticamente a todas las requests
- **Protección de rutas:** Dashboard verifica autenticación en cada render
- **Variables de entorno:** URLs sensibles en `.env.local`

---

## 📊 Características Técnicas Destacadas

### **1. Scroll Infinito con IntersectionObserver**
Implementación eficiente de paginación sin bibliotecas externas.

### **2. Animaciones Suaves**
Uso de Framer Motion para transiciones y animaciones de números.

### **3. Impresión de PDFs**
Generación de PDFs en el backend y descarga en el cliente.

### **4. Actualización en Tiempo Real**
Socket.io para sincronización automática entre usuarios.

### **5. Gestión de Estado Compleja**
Redux Toolkit para operaciones de ventas/compras con cálculos automáticos.

### **6. Búsqueda en Tiempo Real**
Búsqueda sin debounce con renderizado condicional.

### **7. Theming Consistente**
Styled Components con props dinámicas para temas coherentes.

---

## 🐛 Debugging

### **Redux DevTools**
Activar extensión de Redux DevTools en el navegador para inspeccionar el estado.

### **Console Logs**
La aplicación incluye logs en puntos críticos:
```typescript
console.log('siempre estoy en dashboard')
console.log("dataset", r.data)
console.log("error getSale", e)
```

### **React Strict Mode**
Desactivado en `next.config.mjs` para evitar doble render:
```javascript
reactStrictMode: false
```

---

## 📈 Optimizaciones

1. **Paginación:** Carga incremental de datos (25 registros por vez)
2. **Memoización:** Uso de useCallback para funciones de scroll
3. **Code Splitting:** Next.js automáticamente divide el código por rutas
4. **Lazy Loading:** Componentes modales cargados condicionalmente
5. **Socket Management:** Desconexión automática en cleanup de useEffect

---

## 🤝 Convenciones de Código

- **Componentes:** PascalCase (`Dashboard.tsx`)
- **Hooks:** camelCase con prefijo `use` (`useLocalStorage.tsx`)
- **Interfaces:** PascalCase (`Product`, `Sale`)
- **Redux Actions:** camelCase (`addItemSale`, `setLoading`)
- **Styled Components:** PascalCase (`ContainerLogin`, `ItemLi`)
- **Archivos:** kebab-case para carpetas, PascalCase para componentes

---

## 🛣️ Roadmap Futuro

- [ ] Implementar i18n (internacionalización)
- [ ] Agregar tests unitarios y e2e
- [ ] Implementar modo offline con Service Workers
- [ ] Agregar tema oscuro
- [ ] Mejorar accesibilidad (WCAG)
- [ ] Dashboard de administración de usuarios
- [ ] Reportes avanzados en Excel
- [ ] Integración con sistemas de facturación

---

## 📞 Soporte

Para consultas o reportes de bugs, contactar al equipo de desarrollo.

---

## 📄 Licencia

Proyecto privado de Golozur - Todos los derechos reservados.

---

**Última actualización:** Diciembre 2025  
**Versión:** 0.1.0  
**Mantenido por:** Equipo de Desarrollo Golozur
