# Gestión Web GZ

Aplicación web de administración del ecosistema Golozur. Panel de gestión para ventas, compras, productos, reportes y dashboards. Interfaz responsive (web y móvil) conectada a la API gzapi.

---

## Características del proyecto

### Funcionalidades principales

- **Ventas**: Crear, editar y listar ventas con líneas de producto, impresión PDF individual y múltiple
- **Compras**: Registro de compras con items y generación automática
- **Productos**: CRUD, filtros, actualización de precios, impresión de etiquetas
- **Dashboard**: Gráficos y métricas con Recharts y MUI X Charts
- **Autenticación**: Login con JWT, persistencia en localStorage
- **Tiempo real**: Actualizaciones vía Socket.io
- **Responsive**: Vistas adaptadas para web y móvil (ContainerSaleWeb/ContainerSaleMobile)

### Stack tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 14 |
| UI | Material UI (MUI), styled-components, Emotion |
| Estado | Redux Toolkit |
| Formularios | Formik, Yup |
| Gráficos | Recharts, MUI X Charts |
| HTTP | Axios |
| PDF | jsPDF, html2canvas |
| Animaciones | Framer Motion |

### Estructura del proyecto

```
src/
├── app/              # Rutas Next.js (page.tsx por sección)
│   ├── home/         # Dashboard post-login
│   ├── sale/         # Ventas (newSale, editSale)
│   ├── buy/          # Compras (newBuy, editBuy)
│   └── product/      # Productos
├── components/       # Componentes reutilizables
│   ├── sale/         # Carrito, líneas de venta, impresión
│   ├── buy/          # Líneas de compra, modales
│   └── products/     # Listado, filtros, modales
├── hooks/            # useLocalStorage, useResize, useDate, etc.
├── interfaces/       # Tipos TypeScript
├── redux/            # Store, slices (user, sale, buy, loading, alert)
└── utils/            # Cliente API
```

### Requisitos de entorno

- Node.js
- Variable `NEXT_PUBLIC_API_URL` (o equivalente) apuntando a gzapi

### Scripts

```bash
npm run dev   # Desarrollo (Next.js)
npm run build # Build de producción
npm start     # Servir build
npm run lint  # ESLint
```

---

## Licencia

Este proyecto es **propietario** y está protegido por derechos de autor.  
**Prohibido su uso, copia, modificación o distribución sin autorización.**

Ver [LICENSE](./LICENSE) para más detalles.
