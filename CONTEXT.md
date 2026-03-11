# FabProject Panel - Context Documentation

## 1. ¿Qué es FabProject?

FabProject es una plataforma SaaS que automatiza el proceso de pedidos para restaurantes mediante inteligencia artificial. Permite a los restaurantes recibir y gestionar pedidos automáticamente a través de WhatsApp, optimizando operaciones y enfocándose en la cocina.

## 2. Stack Tecnológico

- **Frontend**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS con tema oscuro personalizado
- **HTTP Client**: Axios con interceptores
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **Autenticación**: js-cookie para manejo de tokens
- **Backend**: Node.js/Express (API externa)
- **Base de Datos**: PostgreSQL

## 3. Configuración del API

### Base URL
```javascript
// src/lib/api.js
const API_BASE_URL = "https://manlessly-unparadoxal-leeann.ngrok-free.dev";
```

### Headers e Interceptor
```javascript
// Header ngrok-skip-browser-warning para evitar redirecciones
api.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

// Interceptor JWT - agrega token automáticamente
api.interceptors.request.use((config) => {
  const token = getToken(); // de lib/auth.js
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 4. Autenticación

### Sistema de Tokens
- **Cookie**: `js-cookie` (`fabp_token` cookie)
- **Librería**: `src/lib/auth.js`

### Funciones Principales
```javascript
// src/lib/auth.js
import Cookies from 'js-cookie';

const TOKEN_KEY = 'fabp_token';

export const setToken = (token) => {
  // Expira en 7 días
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
};

export const getToken = () => Cookies.get(TOKEN_KEY);

export const removeToken = () => Cookies.remove(TOKEN_KEY);

export const isAuthenticated = () => !!getToken();
```

## 5. Endpoints del Backend

### Autenticación
- `POST /auth/login` - Login de restaurante
  ```javascript
  { email: string, password: string }
  ```

### Restaurantes
- `GET /restaurantes/mi-restaurante` - Obtener datos del restaurante autenticado
- `PUT /restaurantes/mi-restaurante` - Actualizar datos del restaurante

### Pedidos
- `GET /pedidos` - Listar pedidos del restaurante
- `PUT /pedidos/:id/estado` - Cambiar estado de pedido
  ```javascript
  { estado: "nuevo"|"confirmado"|"en_preparacion"|"listo"|"entregado"|"cancelado" }
  ```

### Menú
- `GET /menu` - Obtener menú del restaurante (categorías y productos)
- `POST /menu/categoria` - Crear categoría
- `PUT /menu/categoria/:id` - Actualizar categoría
- `DELETE /menu/categoria/:id` - Eliminar categoría
- `POST /menu/producto` - Crear producto
- `PUT /menu/producto/:id` - Actualizar producto
- `DELETE /menu/producto/:id` - Eliminar producto
- `PUT /menu/producto/:id/disponibilidad` - Toggle disponibilidad

### Métricas (Dashboard)
- `GET /pedidos/metricas` - Estadísticas del restaurante

> Nota: el endpoint correcto del dashboard es `/pedidos/metricas` (no `/metricas/dashboard`).

## 6. Schema de Base de Datos

### Restaurantes
```sql
restaurantes (
  id, nombre, email, password, telefono, direccion,
  ciudad, categoria, whatsapp_url, creado_en, actualizado_en
)
```

### Categorías Menú
```sql
categorias_menu (
  id, restaurante_id, nombre, descripcion, orden, creada_en
)
```

### Productos
```sql
productos (
  id, categoria_id, nombre, descripcion, precio, disponible,
  imagen_url, creado_en, actualizado_en
)
```

### Pedidos
```sql
pedidos (
  id, restaurante_id, cliente_nombre, cliente_telefono,
  cliente_direccion, estado, total, items, creado_en,
  actualizado_en
)
```

### Items de Pedido
```sql
pedido_items (
  id, pedido_id, producto_id, cantidad, precio_unitario,
  subtotal
)
```

## 7. Convenciones de Diseño UI

### Colores (Tema Oscuro)
```css
/* Primarios */
bg-gray-900 (fondo principal)
bg-gray-800 (cards, panels)
bg-gray-700 (hover states)
text-white (texto principal)
text-gray-400 (texto secundario)
text-gray-500 (placeholder)

/* Acentos */
bg-blue-600 (botones primarios)
bg-blue-500/20 (hover states)
border-blue-500 (focus states)
ring-blue-500/20 (focus rings)

/* Estados */
bg-green-500 (éxito)
bg-red-500 (error)
bg-yellow-500 (warning)
```

### Estilos de Componentes

#### Cards
```jsx
<div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-apple p-6">
  {/* contenido */}
</div>
```

#### Botones
```jsx
// Primario
<button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-apple hover:shadow-apple-lg active:scale-[0.98]">

// Secundario
<button className="px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-2xl font-semibold hover:bg-gray-700 transition-all">
```

#### Inputs
```jsx
<input
  className="w-full px-4 py-3 rounded-2xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
  placeholder="..."
/>
```

#### Badges
```jsx
<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-blue-100 text-blue-700 border-blue-200">
  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-soft" />
  Estado
</span>
```

### Sombras y Animaciones
```css
shadow-apple: 0 4px 14px 0 rgba(0, 0, 0, 0.15)
shadow-apple-lg: 0 10px 40px 0 rgba(0, 0, 0, 0.2)
shadow-apple-xl: 0 20px 60px 0 rgba(0, 0, 0, 0.25)

animate-fade-in: opacity 0 animation-fade-in 0.5s ease-out
animate-scale-in: scale 0.95 animation-scale-in 0.3s ease-out
animate-slide-up: transform translateY(20px) animation-slide-up 0.4s ease-out
```

## 8. Estructura de Carpetas

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── dashboard/         # Dashboard principal
│   ├── pedidos/           # Gestión de pedidos
│   ├── menu/              # Gestión de menú
│   ├── configuracion/     # Configuración
│   │   ├── general/
│   │   └── ia/
│   ├── perfil/            # Perfil del restaurante
│   ├── login/            # Login
│   ├── onboarding/       # Onboarding
│   ├── landing/          # Landing page
│   └── globals.css       # Estilos globales
├── components/
│   ├── layout/           # Layout components
│   │   ├── PanelLayout.js
│   │   └── Sidebar.js
│   └── ui/               # UI components reutilizables
│       └── Skeleton.js   # Skeleton loading
├── lib/                  # Utilidades
│   ├── api.js           # Cliente HTTP
│   └── auth.js          # Autenticación
└── middleware.js        # Middleware Next.js
```

## 9. Componentes Reutilizables

### PanelLayout
```jsx
// Layout principal para páginas autenticadas
<PanelLayout>
  {/* children */}
</PanelLayout>
```
- Incluye sidebar responsive
- Manejo de autenticación
- Skeleton loading inicial

### Sidebar
- Navegación principal
- Estados hover y active
- Responsive con overlay móvil
- Indicador de conexión del bot

### Skeleton Components
```jsx
import { Skeleton, SkeletonCard, SkeletonChart, SkeletonListItem } from "@/components/ui/Skeleton";
```
- Skeleton base
- SkeletonCard para productos
- SkeletonChart para gráficos
- SkeletonListItem para tablas

### Modales
- ModalProducto (crear/editar productos)
- DetallePedido (ver detalles de pedido)
- Todos con backdrop y animaciones

## 10. Reglas de Código

### Formularios
- **NO usar `<form>`** - Manejar con `onSubmit` manual
- Validación en tiempo real con `useState`
- Prevenir default con `e.preventDefault()`

### Manejo de Errores
```jsx
try {
  await api.post('/endpoint', data);
  mostrarToast('Éxito');
} catch (err) {
  console.error(err);
  mostrarToast('Error al procesar');
}
```

### Loading States
- Usar skeletons en lugar de spinners
- Estados de carga por componente
- Botones con `disabled` y animaciones

### Fechas y Números
```jsx
// Fechas en español Argentina
new Date(date).toLocaleString("es-AR", {
  day: "2-digit", 
  month: "2-digit", 
  hour: "2-digit", 
  minute: "2-digit"
});

// Precios formateados
precio.toLocaleString("es-AR", {
  style: "currency",
  currency: "ARS"
});
```

### Nombres de Variables
- Componentes: PascalCase
- Funciones: camelCase
- Constantes: UPPER_SNAKE_CASE
- Estados: `loading`, `error`, `data` prefijos

### Estructura de Componentes
```jsx
function ComponentName() {
  // 1. States
  const [state, setState] = useState();
  
  // 2. Effects
  useEffect(() => {}, []);
  
  // 3. Handlers
  const handleSubmit = () => {};
  
  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## 11. ¿Qué es FabProject-Admin?

FabProject-Admin es el panel de administración interna del SaaS FabProject. A diferencia de fabproject-panel (que usan los restaurantes), fabproject-admin es para:

- **Gestionar todos los clientes** (restaurantes) del SaaS
- **Monitorear métricas globales** de toda la plataforma
- **Administrar suscripciones** y pagos
- **Soporte técnico** a clientes
- **Configuración del sistema** a nivel global

**Diferencias clave con fabproject-panel:**
- Multi-tenant (maneja múltiples restaurantes)
- Roles de administrador vs cliente
- Métricas agregadas de todos los clientes
- Funcionalidades de billing y soporte

## 12. Credenciales de Prueba

### API URL
```
https://manlessly-unparadoxed-1eeann.negr0k-free.dev
```

### Usuario de Prueba
```javascript
{
  "email": "test@restaurant.com",
  "password": "password123"
}
```

### Headers Requeridos
```javascript
{
  "ngrok-skip-browser-warning": "true",
  "Authorization": "Bearer <token>"
}
```

### Notas de Desarrollo
- El backend usa ngrok para desarrollo local
- Los tokens JWT expiran en 7 días
- Todas las respuestas usan formato JSON
- Errores HTTP con mensajes descriptivos

---

## Recomendaciones para FabProject-Admin

1. **Mantener la misma estructura de carpetas** para consistencia
2. **Reutilizar componentes UI** (PanelLayout, Skeleton, etc.)
3. **Seguir las mismas convenciones de diseño** (colores, sombras, animaciones)
4. **Implementar el mismo sistema de autenticación** pero con roles de admin
5. **Usar el mismo cliente API** con endpoints diferentes para admin
6. **Mantener el tema oscuro** y estilo visual consistente
7. **Implementar skeletons** para todos los estados de carga
8. **Seguir las mismas reglas de código** (no forms, manejo de errores, etc.)
## 13. Cambios recientes en el panel (documentación automática)

- ✅ **Sidebar móvil oculto de base**: en móviles el sidebar queda oculto (solo se muestra el botón “hamburguesa”) y al abrirlo se despliega completo (texto + sub-items). Se implementó usando `isOpen`/`onClose` desde `PanelLayout` hacia `Sidebar`.
- ✅ **Fix de expansión en PC**: el sidebar ahora se expande correctamente al hover (pasa de `w-20` a `w-64` en desktop) y vuelve a colapsar al salir del hover. Esto se logró ajustando `widthClass` para que combine `lg:hover:w-64` con estado de `isOpen` para mobile.
- ✅ **Dashboard usa endpoint correcto**: ahora las métricas se cargan desde `GET /metricas/dashboard` (antes `/pedidos/metricas`). Si la API no responde (404/500), el dashboard muestra un mensaje claro indicando la URL que se intentó y sugiere revisar el `NEXT_PUBLIC_API_URL` y que el backend esté corriendo.
- ✅ **API Base URL fallback**: `src/lib/api.js` ahora usa `process.env.NEXT_PUBLIC_API_URL` cuando esté disponible, y sino cae al valor por defecto `https://manlessly-unparadoxed-1eeann.negr0k-free.dev`. Además, los componentes ahora muestran esa URL en el mensaje de error para facilitar debugging.
- ℹ️ **Nota importante**: el backend debe estar en funcionamiento y accesible desde la URL configurada. Si la URL del ngrok cambia (por ejemplo, al volver a abrir el túnel), actualizá `NEXT_PUBLIC_API_URL` en `.env` y reiniciá el frontend. En este proyecto, la URL correcta del backend (según la documentación) es `https://manlessly-unparadoxal-leeann.ngrok-free.dev`.
- ✅ **Botones de menú funcionan**: el botón “Nueva categoría” abre un modal de creación; el botón “Nuevo producto” abre el modal de producto (o solicita crear categoría si no hay ninguna). Ahora el modal de producto envía `categoria_id` en lugar de `menu_id`.
- ✅ **Fix de `tbody` anidado**: se corrigió el renderizado de la tabla de pedidos para evitar `<tbody>` dentro de otro `<tbody>`, eliminando el error de “hydration” en consola.
- ✅ **Skeleton de tabla de pedidos**: se reemplazó el uso de `SkeletonListItem` dentro de `<tbody>` por filas placeholder válidas (`<tr><td>...</td></tr>`) para mantener HTML válido y evitar warning de React.
Este contexto debería ser suficiente para que un agente de IA comience a desarrollar fabproject-admin manteniendo total consistencia con el panel existente.
