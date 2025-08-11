# Sistema de Administración Geoespacial – Frontend

## Descripción General

Este frontend es un sistema integral de administración geoespacial construido con **React**, **TypeScript**, **Vite**, y **Leaflet**. Proporciona una interfaz web interactiva para gestionar divisiones administrativas geográficas jerárquicas (Estados → Municipios → Parroquias) y sus subdivisiones espaciales (Cuadrantes y Circuitos Comunales), junto con Puntos de Interés que pueden asociarse espacialmente con estas entidades. El sistema está diseñado para trabajar perfectamente con **Leaflet** para visualización interactiva de mapas y la API del backend para gestión de datos geoespaciales, autenticación y control de acceso basado en roles. Cuenta con interacción integral de datos basada en mapas, visualización de límites espaciales y gestión de datos geoespaciales en tiempo real.

### Características Principales

- **Interfaz de Mapa Interactiva** con Leaflet para visualizar y gestionar límites geográficos, cuadrantes, circuitos comunales y puntos de interés
- **Operaciones CRUD Completas** vía interfaz intuitiva para entidades geográficas (estados, municipios, parroquias, cuadrantes, circuitos comunales, puntos de interés), usuarios, roles y permisos
- **Visualización de Datos Espaciales** con renderizado GeoJSON, edición de límites y visualización de relaciones espaciales
- **Interacción de Mapa en Tiempo Real** para crear, editar y gestionar límites espaciales directamente en el mapa
- **Interfaz de Asociación Espacial Automática** para Puntos de Interés con retroalimentación visual cuando caen dentro de Cuadrantes o Circuitos Comunales
- **Interfaz de Control de Acceso Basado en Roles** con renderizado de UI basado en permisos y acceso a características
- **Autenticación JWT** con gestión segura de tokens y manejo de sesiones
- **Dashboard Integral** con análisis espaciales, gestión de flotas y supervisión administrativa
- **Integración con Leaflet** con controles personalizados, herramientas de dibujo e interfaces de consulta espacial
- **Diseño Responsivo** optimizado para interacción de mapas en escritorio y uso móvil en campo
- **TypeScript** para seguridad de tipos y mejor experiencia de desarrollo

### Stack Tecnológico

**Dependencias Principales:**

- **React** con **TypeScript** para desarrollo de UI basado en componentes
- **Vite** para servidor de desarrollo rápido y builds de producción optimizados
- **Leaflet** para visualización de mapas interactivos e interacción con datos geoespaciales
- **React-Leaflet** para integración de React con mapas Leaflet
- **Redux Toolkit** para gestión de estado predecible
- **React Router Dom** para enrutamiento del lado del cliente y navegación

**Integración Geoespacial:**

- **Leaflet** para renderizado de mapas interactivos e interacción del usuario
- **Leaflet Draw** para crear y editar límites espaciales
- **GeoJSON** procesamiento para visualización de datos espaciales
- **Turf.js** para análisis espacial y operaciones geométricas
- **Proj4js** para transformaciones de sistemas de coordenadas

**UI/UX y Estilos:**

- **Material UI** con temas personalizados optimizados para interfaces de mapas
- **Leaflet CSS** para estilos de mapas y controles
- **Diseño Responsivo** con consideraciones móviles centradas en mapas
- **Controles de Mapa Personalizados** para gestión de datos espaciales

**Gestión de Datos:**

- **Axios** para comunicación API con endpoints de datos espaciales
- **React Query** para caché eficiente de datos geoespaciales y sincronización
- **Validación GeoJSON** para integridad de datos espaciales
- **Actualizaciones en Tiempo Real** para edición espacial colaborativa

**Herramientas de Desarrollo:**

- **ESLint** con reglas específicas de TypeScript y React-Leaflet
- **Prettier** para formateo consistente de código
- **TypeScript** modo estricto para seguridad de tipos de datos espaciales
- **Definiciones TypeScript de Leaflet** para tipado de interacción de mapas

## Instalación y Configuración

### Prerrequisitos

- **Node.js** (v16 o superior)
- Gestor de paquetes **Yarn**
- **API Backend** ejecutándose con soporte PostGIS (ver documentación del backend para configuración)
- **Navegador Web Moderno** con soporte WebGL para renderizado óptimo de mapas

### Configuración de Entorno

Crea un archivo `.env` en el directorio frontend con las siguientes variables:

```env
# Configuración de API Backend
VITE_API_BASE_URL=http://localhost:4000
VITE_API_TIMEOUT=30000

# Configuración de Mapa
VITE_DEFAULT_MAP_CENTER_LAT=10.4806
VITE_DEFAULT_MAP_CENTER_LNG=-66.9036
VITE_DEFAULT_MAP_ZOOM=7
VITE_MAX_MAP_ZOOM=18
VITE_MIN_MAP_ZOOM=5

# Configuración de Servidor de Tiles
VITE_TILE_SERVER_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_TILE_SERVER_ATTRIBUTION=© OpenStreetMap contributors

# Banderas de Características
VITE_ENABLE_SPATIAL_EDITING=true
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_OFFLINE_MODE=false

# Entorno
NODE_ENV=development
```

### Pasos de Instalación

1. **Navegar al directorio frontend:**

   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**

   ```bash
   yarn install
   ```

3. **Instalar dependencias geoespaciales adicionales:**

   ```bash
   yarn add leaflet react-leaflet @types/leaflet leaflet-draw @turf/turf proj4
   ```

4. **Iniciar el servidor de desarrollo:**

   ```bash
   yarn dev
   ```

5. **Construir para producción:**
   ```bash
   yarn build
   ```

El servidor de desarrollo se iniciará en `http://localhost:5173` con la interfaz de mapa interactiva.

## Scripts Disponibles

- **`yarn dev`** - Iniciar servidor de desarrollo con reemplazo de módulos en caliente usando Vite
- **`yarn build`** - Construir la aplicación para producción (compilación TypeScript + build Vite)
- **`yarn lint`** - Ejecutar ESLint con auto-corrección para archivos JavaScript, JSX, TypeScript y TSX
- **`yarn preview`** - Previsualizar el build de producción localmente

## Estructura del Proyecto

```
frontend/
├── public/                          # Recursos estáticos y recursos de mapas
│   ├── map-icons/                   # Marcadores de mapas personalizados e iconos
│   ├── tile-cache/                  # Almacenamiento de tiles de mapas offline
│   └── favicon.ico                  # Favicon de la aplicación
├── src/
│   ├── assets/                      # Recursos estáticos y recursos espaciales
│   │   ├── map-styles/              # CSS personalizado de Leaflet y temas
│   │   ├── spatial-icons/           # Iconos para diferentes tipos de entidades
│   │   └── default-boundaries/      # Archivos de límites GeoJSON por defecto
│   ├── components/                  # Componentes UI reutilizables y de mapas
│   │   ├── map/                     # Componentes específicos de mapas
│   │   │   ├── LeafletMap.tsx       # Componente principal de mapa interactivo
│   │   │   ├── MapControls.tsx      # Botones de control de mapa personalizados
│   │   │   ├── DrawingTools.tsx     # Herramientas de dibujo de límites espaciales
│   │   │   ├── LayerManager.tsx     # Controles de visibilidad de capas de mapa
│   │   │   ├── SpatialSearch.tsx    # Interfaz de consulta espacial
│   │   │   └── CoordinateDisplay.tsx # Visualización de coordenadas del mouse
│   │   ├── spatial/                 # Componentes de datos espaciales
│   │   │   ├── BoundaryEditor.tsx   # Edición de límites GeoJSON
│   │   │   ├── PointOfInterestMarker.tsx # Marcadores de mapas POI
│   │   │   ├── QuadrantLayer.tsx    # Visualización de límites de cuadrantes
│   │   │   ├── CircuitLayer.tsx     # Visualización de circuitos comunales
│   │   │   └── SpatialAssociation.tsx # UI de relación espacial automática
│   │   ├── forms/                   # Formularios de gestión de entidades
│   │   │   ├── StateForm.tsx        # Creación/edición de estados
│   │   │   ├── MunicipalityForm.tsx # Gestión de municipios
│   │   │   ├── ParishForm.tsx       # Gestión de parroquias
│   │   │   ├── QuadrantForm.tsx     # Cuadrante con edición espacial
│   │   │   ├── CircuitForm.tsx      # Gestión de circuitos comunales
│   │   │   ├── CommuneForm.tsx      # Gestión de comunas
│   │   │   ├── CouncilForm.tsx      # Gestión de consejos comunales
│   │   │   ├── POIForm.tsx          # Punto de interés con selector de mapa
│   │   │   ├── OrganismForm.tsx     # Gestión de organismos
│   │   │   ├── ResponsibleForm.tsx  # Gestión de personas responsables
│   │   │   ├── UserForm.tsx         # Gestión de usuarios
│   │   │   └── RoleForm.tsx         # Gestión de roles y permisos
│   │   ├── tables/                  # Componentes de listado de datos
│   │   │   ├── StatesTable.tsx      # Listado de estados con vista previa de mapa
│   │   │   ├── MunicipalitiesTable.tsx # Municipios con jerarquía
│   │   │   ├── ParishesTable.tsx    # Parroquias con información espacial
│   │   │   ├── QuadrantsTable.tsx   # Cuadrantes con datos de flota
│   │   │   ├── CircuitsTable.tsx    # Listado de circuitos comunales
│   │   │   ├── CommunesTable.tsx    # Listado de comunas
│   │   │   ├── CouncilsTable.tsx    # Listado de consejos comunales
│   │   │   ├── POITable.tsx         # Puntos de interés con coordenadas
│   │   │   ├── OrganismsTable.tsx   # Listado de organismos
│   │   │   ├── ResponsiblesTable.tsx # Personas responsables
│   │   │   ├── UsersTable.tsx       # Tabla de gestión de usuarios
│   │   │   └── RolesTable.tsx       # Tabla de roles y permisos
│   │   ├── dashboard/               # Componentes de dashboard
│   │   │   ├── SpatialOverview.tsx  # Vista general del dashboard basada en mapas
│   │   │   ├── FleetManagement.tsx  # Estadísticas y gestión de flotas
│   │   │   ├── EntityStats.tsx      # Estadísticas de entidades geográficas
│   │   │   └── RecentActivity.tsx   # Cambios recientes de datos espaciales
│   │   └── common/                  # Componentes UI compartidos
│   │       ├── ProtectedRoute.tsx   # Wrapper de protección de rutas
│   │       ├── LoadingSpinner.tsx   # Estados de carga
│   │       ├── ErrorBoundary.tsx    # Manejo de errores
│   │       └── ConfirmDialog.tsx    # Diálogos de confirmación
│   ├── hooks/                       # Hooks personalizados de React
│   │   ├── spatial/                 # Hooks de datos espaciales
│   │   │   ├── useMapData.tsx       # Obtención y caché de datos de mapas
│   │   │   ├── useSpatialQuery.tsx  # Operaciones de consulta espacial
│   │   │   ├── useBoundaryEditor.tsx # Lógica de edición de límites
│   │   │   └── useGeoLocation.tsx   # Servicios de ubicación del usuario
│   │   ├── entities/                # Hooks de gestión de entidades
│   │   │   ├── useStates.tsx        # Operaciones CRUD de estados
│   │   │   ├── useMunicipalities.tsx # Gestión de municipios
│   │   │   ├── useParishes.tsx      # Gestión de parroquias
│   │   │   ├── useQuadrants.tsx     # Cuadrantes con datos espaciales
│   │   │   ├── useCircuits.tsx      # Gestión de circuitos comunales
│   │   │   ├── useCommunes.tsx      # Gestión de comunas
│   │   │   ├── useCouncils.tsx      # Gestión de consejos comunales
│   │   │   ├── usePOI.tsx           # Gestión de puntos de interés
│   │   │   ├── useOrganisms.tsx     # Gestión de organismos
│   │   │   └── useResponsibles.tsx  # Gestión de personas responsables
│   │   ├── auth/                    # Hooks de autenticación
│   │   │   ├── useAuth.tsx          # Estado de autenticación
│   │   │   ├── usePermissions.tsx   # Verificación de permisos
│   │   │   └── useRoles.tsx         # Gestión de roles
│   │   └── ui/                      # Hooks específicos de UI
│   │       ├── useNotifications.tsx # Notificaciones toast
│   │       ├── useModal.tsx         # Gestión de modales
│   │       └── useTheme.tsx         # Cambio de temas
│   ├── pages/                       # Páginas/vistas de la aplicación
│   │   ├── auth/                    # Páginas de autenticación
│   │   │   └── LoginPage.tsx        # Autenticación de usuario
│   │   ├── dashboard/               # Páginas de dashboard
│   │   │   ├── MainDashboard.tsx    # Dashboard principal con vista general de mapas
│   │   │   ├── SpatialDashboard.tsx # Dashboard de análisis espaciales
│   │   │   └── FleetDashboard.tsx   # Dashboard de gestión de flotas
│   │   ├── geographical/            # Páginas de entidades geográficas
│   │   │   ├── StatesPage.tsx       # Gestión de estados
│   │   │   ├── MunicipalitiesPage.tsx # Gestión de municipios
│   │   │   ├── ParishesPage.tsx     # Gestión de parroquias
│   │   │   ├── QuadrantsPage.tsx    # Cuadrantes con interfaz de mapa
│   │   │   ├── CircuitsPage.tsx     # Gestión de circuitos comunales
│   │   │   ├── CommunesPage.tsx     # Gestión de comunas
│   │   │   ├── CouncilsPage.tsx     # Gestión de consejos comunales
│   │   │   └── POIPage.tsx          # Puntos de interés con mapa
│   │   ├── administrative/          # Páginas administrativas
│   │   │   ├── OrganismsPage.tsx    # Gestión de organismos
│   │   │   ├── ResponsiblesPage.tsx # Gestión de personas responsables
│   │   │   ├── UsersPage.tsx        # Gestión de usuarios
│   │   │   └── RolesPage.tsx        # Roles y permisos
│   │   └── spatial/                 # Páginas específicas espaciales
│   │       ├── MapEditor.tsx        # Interfaz de edición de mapas a pantalla completa
│   │       ├── BoundaryManager.tsx  # Interfaz de gestión de límites
│   │       └── SpatialAnalytics.tsx # Análisis espacial y reportes
│   ├── services/                    # API y servicios externos
│   │   ├── api/                     # Integración de API backend
│   │   │   ├── auth.ts              # Endpoints de autenticación
│   │   │   ├── states.ts            # Llamadas API de estados
│   │   │   ├── municipalities.ts    # Llamadas API de municipios
│   │   │   ├── parishes.ts          # Llamadas API de parroquias
│   │   │   ├── quadrants.ts         # Cuadrantes con soporte GeoJSON
│   │   │   ├── circuits.ts          # Llamadas API de circuitos comunales
│   │   │   ├── communes.ts          # Llamadas API de comunas
│   │   │   ├── councils.ts          # Llamadas API de consejos comunales
│   │   │   ├── poi.ts               # Llamadas API de puntos de interés
│   │   │   ├── organisms.ts         # Llamadas API de organismos
│   │   │   ├── responsibles.ts      # Llamadas API de personas responsables
│   │   │   ├── users.ts             # Llamadas API de usuarios
│   │   │   └── roles.ts             # Llamadas API de roles y permisos
│   │   ├── spatial/                 # Servicios de procesamiento espacial
│   │   │   ├── geoJsonProcessor.ts  # Validación y procesamiento GeoJSON
│   │   │   ├── spatialQueries.ts    # Consultas de relaciones espaciales
│   │   │   ├── coordinateUtils.ts   # Utilidades de sistemas de coordenadas
│   │   │   └── boundaryValidator.ts # Validación de límites espaciales
│   │   └── map/                     # Servicios específicos de mapas
│   │       ├── tileManager.ts       # Gestión de tiles de mapas
│   │       ├── layerManager.ts      # Gestión de capas de mapas
│   │       └── mapUtils.ts          # Funciones utilitarias de mapas
│   ├── store/                       # Configuración de store Redux
│   │   ├── index.ts                 # Configuración y setup del store
│   │   ├── slices/                  # Slices de Redux
│   │   │   ├── authSlice.ts         # Estado de autenticación
│   │   │   ├── mapSlice.ts          # Estado y configuraciones de mapas
│   │   │   ├── entitiesSlice.ts     # Estado de entidades geográficas
│   │   │   ├── spatialSlice.ts      # Datos espaciales y operaciones
│   │   │   └── uiSlice.ts           # Estado de UI (modales, notificaciones)
│   │   └── middleware/              # Middleware personalizado de Redux
│   │       ├── spatialMiddleware.ts # Procesamiento de datos espaciales
│   │       └── apiMiddleware.ts     # Manejo de peticiones API
│   ├── types/                       # Definiciones de tipos TypeScript
│   │   ├── api.ts                   # Tipos de respuestas API
│   │   ├── spatial.ts               # Tipos de datos espaciales (GeoJSON, coordenadas)
│   │   ├── entities.ts              # Definiciones de tipos de entidades
│   │   ├── auth.ts                  # Tipos de autenticación
│   │   └── map.ts                   # Tipos específicos de mapas
│   ├── utils/                       # Funciones utilitarias
│   │   ├── spatial/                 # Funciones utilitarias espaciales
│   │   │   ├── geoJsonUtils.ts      # Utilidades de manipulación GeoJSON
│   │   │   ├── coordinateUtils.ts   # Utilidades de conversión de coordenadas
│   │   │   └── spatialValidation.ts # Validación de datos espaciales
│   │   ├── api/                     # Funciones utilitarias de API
│   │   │   ├── errorHandling.ts     # Manejo de errores de API
│   │   │   ├── requestUtils.ts      # Utilidades de formateo de peticiones
│   │   │   └── responseUtils.ts     # Utilidades de procesamiento de respuestas
│   │   └── common/                  # Funciones utilitarias comunes
│   │       ├── dateUtils.ts         # Utilidades de formateo de fechas
│   │       ├── validationUtils.ts   # Utilidades de validación de formularios
│   │       └── formatUtils.ts       # Utilidades de formateo de datos
│   ├── styles/                      # Estilos globales y temas
│   │   ├── globals.css              # Estilos CSS globales
│   │   ├── leaflet-custom.css       # Estilos personalizados de Leaflet
│   │   └── material-ui-theme.ts     # Configuración de tema Material UI
│   ├── App.tsx                      # Componente principal de aplicación con enrutamiento
│   ├── main.tsx                     # Punto de entrada de la aplicación
│   └── vite-env.d.ts                # Definiciones de tipos de entorno Vite
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore                       # Reglas de ignore de Git
├── eslint.config.js                 # Configuración ESLint
├── index.html                       # Plantilla HTML con meta tags de mapas
├── package.json                     # Dependencias y scripts
├── tsconfig.app.json                # Configuración TypeScript para app
├── tsconfig.json                    # Configuración principal TypeScript
├── tsconfig.node.json               # Configuración TypeScript para Node.js
├── vite.config.ts                   # Configuración Vite con optimizaciones espaciales
└── yarn.lock                        # Archivo lock de Yarn
```

## Autenticación y Autorización

### Gestión de Tokens JWT

- **Almacenamiento de Tokens**: Almacenamiento seguro de tokens con manejo automático de renovación
- **Contexto de Autenticación**: Gestión de estado de autenticación global vía React Context
- **Rutas Protegidas**: Protección a nivel de ruta con redirecciones automáticas para usuarios no autenticados
- **Verificación de Permisos**: Validación de permisos a nivel de componente usando hooks personalizados
- **Control de Acceso Espacial**: Acceso a características de mapas basado en permisos de usuario y asignaciones geográficas

### Control de Acceso Basado en Roles (RBAC)

- **UI Basada en Permisos**: Renderizado dinámico de UI basado en permisos de usuario para entidades geográficas
- **Permisos Espaciales**: Control de acceso para cuadrantes específicos, circuitos y áreas geográficas
- **Protección de Rutas**: Control de acceso para diferentes secciones de aplicación y características de edición de mapas
- **Contexto de Usuario**: Información de usuario actual, permisos y áreas geográficas asignadas
- **Logout Automático**: Manejo de expiración de tokens con logout elegante y limpieza de estado de mapas

### Flujo de Autenticación

1. **Proceso de Login**: Credenciales de usuario enviadas al backend `/api/auth/login`
2. **Gestión de Tokens**: Token JWT almacenado e incluido en peticiones API
3. **Protección de Rutas**: Componente `ProtectedRoute` valida autenticación y permisos espaciales
4. **Validación de Permisos**: Hook `usePermissions` verifica capacidades de usuario para operaciones geográficas
5. **Autorización Espacial**: Permisos de edición de mapas basados en áreas geográficas asignadas al usuario

## Características Geoespaciales e Integración de Mapas

### Interfaz de Mapa Interactiva

- **Integración con Leaflet**: Mapa interactivo completo con controles de zoom, paneo y capas
- **Controles de Mapa Personalizados**: Controles especializados para gestión y edición de datos espaciales
- **Herramientas de Dibujo**: Herramientas de dibujo integradas para crear y editar límites geográficos
- **Gestión de Capas**: Alternar visibilidad de diferentes capas geográficas (estados, municipios, parroquias, cuadrantes, circuitos)
- **Visualización de Coordenadas**: Visualización de coordenadas en tiempo real para entrada precisa de datos espaciales

### Visualización de Datos Espaciales

- **Renderizado GeoJSON**: Renderizado dinámico de límites geográficos desde datos GeoJSON del backend
- **Edición de Límites**: Edición interactiva de límites de cuadrantes y circuitos comunales
- **Marcadores de Puntos de Interés**: Marcadores personalizados para diferentes tipos de puntos de interés
- **Relaciones Espaciales**: Representación visual de asociaciones espaciales entre entidades
- **Visualización de Flotas**: Visualización codificada por colores de datos de flotas dentro de cuadrantes

### Operaciones CRUD Basadas en Mapas

- **Clic para Crear**: Crear nuevos puntos de interés haciendo clic en el mapa
- **Arrastrar para Editar**: Mover puntos de interés arrastrando marcadores
- **Dibujo de Límites**: Dibujar nuevos límites para cuadrantes y circuitos comunales
- **Validación Espacial**: Validación en tiempo real de relaciones espaciales y superposiciones
- **Asociación Automática**: Asignación automática de puntos a cuadrantes/circuitos basada en coordenadas

## Integración de API

### Comunicación con Backend

- **Endpoints Espaciales**: Integración con endpoints GeoJSON del backend para datos espaciales
- **Actualizaciones en Tiempo Real**: Integración WebSocket para actualizaciones de datos espaciales en tiempo real
- **Operaciones por Lotes**: Manejo eficiente de operaciones de datos espaciales masivos
- **Estrategia de Caché**: Caché inteligente de tiles de mapas y datos espaciales para rendimiento

### Endpoints de API Espacial

- **Endpoints GeoJSON**: Integración directa con `/api/quadrants/geojson` y `/api/communal-circuits/geojson`
- **Consultas Espaciales**: Consultas de caja delimitadora para carga eficiente del viewport del mapa
- **Validación de Coordenadas**: Validación del lado del servidor de coordenadas espaciales y límites
- **Asociación Espacial**: Detección y actualizaciones automáticas de relaciones espaciales

### Manejo de Errores

- **Errores de Validación Espacial**: Manejo de errores de superposición de límites y geometría inválida
- **Errores de Red**: Manejo elegante de fallos de carga de tiles de mapas
- **Errores de Autenticación**: Manejo de expiración de tokens con preservación de estado de mapas
- **Resolución de Conflictos Espaciales**: Resolución amigable al usuario de conflictos de datos espaciales

### Formato de Respuesta de API

```typescript
// Respuesta de Datos Espaciales
{
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[[lng, lat], ...]]
      },
      properties: {
        id: number,
        name: string,
        entityType: "quadrant" | "circuit",
        metadata: object
      }
    }
  ]
}

// Respuesta de Error
{
  error: string,
  code: "SPATIAL_VALIDATION_ERROR" | "BOUNDARY_OVERLAP" | "INVALID_GEOMETRY",
  details: {
    field: string,
    coordinates?: [number, number]
  }
}
```

## Principios de Diseño UI/UX

### Diseño Centrado en Mapas

- **Interfaz de Mapa Interactiva**: Interfaz principal centrada alrededor del mapa Leaflet con controles intuitivos
- **Contexto Espacial**: Todas las operaciones de gestión de datos proporcionan contexto espacial y visualización
- **Mapas Responsivos Móviles**: Interacciones de mapas optimizadas para dispositivos de escritorio y móviles
- **Accesibilidad**: Cumplimiento WCAG con navegación por teclado para controles de mapas y soporte de lector de pantalla

### Integración con Material UI

- **Componentes Optimizados para Mapas**: Componentes Material UI personalizados para interfaces de datos geoespaciales
- **Tablas de Datos Espaciales**: Tablas mejoradas con visualización de coordenadas e integración de vista previa de mapas
- **Controles de Mapa Personalizados**: Controles con estilo Material UI integrados con interfaz de mapas Leaflet
- **Layouts Responsivos**: Layouts adaptativos que priorizan la visibilidad de mapas en diferentes tamaños de pantalla

### Características UX Geoespaciales

- **Retroalimentación Visual**: Retroalimentación visual en tiempo real para operaciones espaciales y edición de límites
- **Información Contextual**: Tooltips al pasar el mouse y paneles de información para entidades geográficas
- **Validación Espacial**: Indicadores visuales para validación de relaciones espaciales y conflictos
- **Divulgación Progresiva**: Visualización jerárquica de datos desde estados hasta coordenadas específicas

## Interfaz de Gestión de Flotas

### Visualización de Flotas

- **Visualización de Flotas de Cuadrantes**: Representación visual de datos de flotas (vehículos pequeños, grandes, bicicletas) dentro de cuadrantes
- **Indicadores de Estado**: Indicadores codificados por colores para estado activo/inactivo de flotas
- **Estadísticas de Flotas**: Widgets de dashboard mostrando distribución y utilización de flotas
- **Actualizaciones en Tiempo Real**: Actualizaciones en vivo de cambios de estado de flotas a través de la interfaz de mapas

### Características de Gestión de Flotas

- **Edición Interactiva de Flotas**: Edición directa de números de flotas a través de la interfaz de mapas
- **Análisis de Flotas**: Análisis estadístico y reportes de distribución de flotas
- **Optimización de Flotas**: Herramientas visuales para optimizar la distribución de flotas entre cuadrantes
- **Datos Históricos de Flotas**: Vista de línea de tiempo de cambios y tendencias de flotas

## Gestión de Datos Espaciales

### Gestión de Límites

- **Edición Interactiva de Límites**: Dibujar, editar y validar límites geográficos directamente en el mapa
- **Validación de Límites**: Validación en tiempo real de superposiciones de límites y relaciones espaciales
- **Edición Multi-Capa**: Edición simultánea de múltiples capas geográficas
- **Importación/Exportación de Límites**: Soporte para importar y exportar datos de límites en varios formatos

### Gestión de Puntos de Interés

- **Creación de POI Basada en Mapas**: Crear puntos de interés haciendo clic directamente en el mapa
- **Asociación Espacial Automática**: Asignación automática de POIs a cuadrantes y circuitos basada en coordenadas
- **Categorización de POI**: Categorización visual de diferentes tipos de puntos de interés
- **Operaciones Masivas de POI**: Operaciones por lotes para gestionar múltiples puntos de interés

## Gestión de Estado

### Integración con Redux Toolkit

- **Gestión de Estado Espacial**: Gestión de estado centralizada para datos de mapas, límites y relaciones espaciales
- **Sincronización en Tiempo Real**: Sincronización de estado con actualizaciones de datos espaciales del backend
- **Actualizaciones Optimistas**: Actualizaciones inmediatas de UI con capacidad de rollback para operaciones espaciales
- **Caché Espacial**: Caché inteligente de datos espaciales para rendimiento mejorado

### Estructura de Estado

```typescript
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    permissions: string[];
    spatialPermissions: SpatialPermission[];
  };
  map: {
    center: [number, number];
    zoom: number;
    bounds: LatLngBounds;
    activeLayer: string;
    drawingMode: boolean;
  };
  spatial: {
    quadrants: GeoJSONFeatureCollection;
    circuits: GeoJSONFeatureCollection;
    pointsOfInterest: PointOfInterest[];
    selectedEntity: SpatialEntity | null;
  };
  entities: {
    states: State[];
    municipalities: Municipality[];
    parishes: Parish[];
    organisms: Organism[];
    responsibles: Responsible[];
  };
  ui: {
    activeModal: string | null;
    notifications: Notification[];
    loading: LoadingState;
  };
}
```

## Herramientas de Desarrollo

### Calidad de Código

- **TypeScript**: Verificación estricta de tipos con definiciones de tipos de datos espaciales comprensivas
- **ESLint**: Reglas de linting avanzadas con reglas específicas de React-Leaflet y geoespaciales
- **Prettier**: Formateo consistente de código a través del proyecto
- **Seguridad de Tipos Espaciales**: Definiciones TypeScript personalizadas para GeoJSON y sistemas de coordenadas

### Experiencia de Desarrollo

- **Reemplazo de Módulos en Caliente**: Actualizaciones instantáneas durante desarrollo con preservación de estado de mapas
- **Fast Refresh**: React Fast Refresh para preservación de estado de componentes durante interacciones de mapas
- **Alias de Rutas**: Rutas de importación limpias con mapeo de rutas TypeScript para utilidades espaciales
- **Herramientas de Desarrollo de Mapas**: Herramientas de depuración de Leaflet y utilidades de inspección de coordenadas

## Optimización de Rendimiento

### Rendimiento de Mapas

- **Caché de Tiles**: Caché inteligente de tiles de mapas para capacidad offline
- **Optimización de Datos Espaciales**: Carga y renderizado eficiente de grandes conjuntos de datos GeoJSON
- **Carga Basada en Viewport**: Carga dinámica de datos espaciales basada en el viewport del mapa
- **Gestión de Capas**: Renderizado optimizado de múltiples capas geográficas

### Optimización de Build

- **División de Código**: División de código basada en rutas y características para componentes de mapas
- **Tree Shaking**: Eliminación de plugins de Leaflet no utilizados y utilidades espaciales
- **Optimización de Assets**: Optimización de iconos de mapas, marcadores y assets espaciales
- **Análisis de Bundle**: Análisis de tamaños de bundle de librerías espaciales y optimización

### Rendimiento en Tiempo de Ejecución

- **Indexación Espacial**: Indexación espacial del lado del cliente para consultas rápidas de punto-en-polígono
- **Eventos de Mapa Debounced**: Manejo optimizado de eventos de paneo, zoom y dibujo de mapas
- **Renderizado Virtual**: Renderizado eficiente de grandes números de marcadores de mapas
- **Gestión de Memoria**: Limpieza adecuada de instancias de mapas y datos espaciales

## Características de Seguridad

### Seguridad Espacial

- **Validación de Límites**: Validación del lado del servidor de límites espaciales y coordenadas
- **Control de Acceso Espacial**: Acceso basado en permisos a áreas geográficas y capacidades de edición
- **Sanitización de Coordenadas**: Validación y sanitización de entradas de coordenadas
- **Integridad de Datos Espaciales**: Protección contra inyección maliciosa de GeoJSON y datos espaciales

### Seguridad del Lado del Cliente

- **Protección XSS**: Sanitización de entradas para datos espaciales y entradas de coordenadas
- **Protección CSRF**: Validación basada en tokens para modificaciones de datos espaciales
- **Tiles de Mapas Seguros**: Carga de tiles de mapas solo HTTPS y configuración segura de servidores de tiles
- **Validación de Permisos Espaciales**: Validación del lado del cliente de permisos de edición espacial

## Estrategia de Testing

### Testing Espacial

- **Testing de Componentes de Mapas**: Testing de componentes Leaflet e interacciones de mapas
- **Testing de Datos Espaciales**: Validación de procesamiento GeoJSON y cálculos espaciales
- **Testing de Sistemas de Coordenadas**: Testing de transformaciones de coordenadas y proyecciones
- **Testing de Validación de Límites**: Testing de validación de relaciones espaciales

### Herramientas de Testing

- **Jest**: Testing unitario con testing de funciones utilitarias espaciales
- **React Testing Library**: Testing de componentes con simulación de interacciones de mapas
- **Utilidades de Testing de Leaflet**: Utilidades personalizadas para testing de componentes de mapas
- **Mocking de Datos Espaciales**: Datos GeoJSON mock para testing aislado

## Despliegue

### Build de Producción

```bash
# Build para producción con optimizaciones espaciales
yarn build

# Vista previa del build de producción con funcionalidad de mapas
yarn preview
```

### Configuración Espacial

- **Configuración de Tiles de Mapas**: Configuración de servidores de tiles de producción y claves API
- **Configuración de Sistemas de Coordenadas**: Configuración de sistemas de coordenadas y proyecciones de producción
- **CDN de Datos Espaciales**: Configuración para servir grandes conjuntos de datos espaciales vía CDN
- **Ajuste de Rendimiento de Mapas**: Configuraciones de renderizado de mapas optimizadas para producción

### Consideraciones de Despliegue

- **Servidores de Tiles de Mapas**: Configuración de servidores de tiles de mapas de producción y respaldos
- **Almacenamiento de Datos Espaciales**: Configuración CDN para archivos GeoJSON grandes y assets espaciales
- **Requisitos HTTPS**: Conexiones seguras requeridas para geolocalización y tiles de mapas
- **Monitoreo de Rendimiento**: Monitoreo de tiempos de carga de mapas y rendimiento de consultas espaciales

## Solución de Problemas

### Problemas Específicos de Mapas

- **Mapa No Carga**: Verificar configuración de servidor de tiles y conectividad de red
- **Problemas de Coordenadas**: Verificar configuración de sistema de coordenadas y proyecciones
- **Renderizado de Límites**: Verificar validez de GeoJSON y orden de coordenadas
- **Problemas de Rendimiento**: Monitorear tamaño de datos espaciales y complejidad de renderizado

### Problemas de Datos Espaciales

- **Validación GeoJSON**: Usar validadores GeoJSON en línea para datos de límites
- **Precisión de Coordenadas**: Asegurar precisión apropiada de coordenadas para rendimiento
- **Relaciones Espaciales**: Verificar lógica de asociación espacial y superposiciones de límites
- **Uso de Memoria**: Monitorear uso de memoria con grandes conjuntos de datos espaciales

## Contribuir

### Directrices de Desarrollo Espacial

1. **Estándares de Datos Espaciales**: Seguir estándares GeoJSON y convenciones de sistemas de coordenadas
2. **Patrones de Componentes de Mapas**: Usar patrones establecidos para integración React Leaflet
3. **Consideraciones de Rendimiento**: Considerar impacto de rendimiento de operaciones espaciales
4. **Conciencia de Sistemas de Coordenadas**: Entender sistemas de coordenadas y proyecciones utilizados

### Estándares de Código

- **TypeScript Espacial**: Usar tipado apropiado para datos GeoJSON y de coordenadas
- **Estructura de Componentes de Mapas**: Seguir patrones establecidos para organización de componentes de mapas
- **Funciones Utilitarias Espaciales**: Crear utilidades reutilizables para operaciones espaciales comunes
- **Testing**: Incluir tests para cálculos espaciales e interacciones de mapas

### Directrices de Pull Request

- **Documentación de Características Espaciales**: Documentar nuevas características espaciales e interacciones de mapas
- **Screenshots de Mapas**: Incluir screenshots de características basadas en mapas y cambios
- **Impacto de Rendimiento**: Documentar impacto de rendimiento de cambios de datos espaciales
- **Compatibilidad de Sistemas de Coordenadas**: Asegurar compatibilidad con sistemas de coordenadas existentes

## Cuenta de Administrador por Defecto

Después de configurar el backend y ejecutar `yarn db:populate`, puedes iniciar sesión con:

- **Username**: `admin`
- **Password**: `admin`

**⚠️ Importante**: ¡Cambia la contraseña del administrador inmediatamente en producción!

## Licencia

Licencia MIT - ver package.json para detalles.

---

## Contribuir

1. Haz fork del repositorio
2. Crea una rama de característica
3. Haz tus cambios con tests
4. Ejecuta `yarn lint` y `yarn build`
5. Envía un pull request

Para preguntas o problemas, por favor crea un issue en el repositorio.

---

**⚠️ Importante**: Asegúrate de que la API del backend con soporte PostGIS esté ejecutándose antes de iniciar el servidor de desarrollo del frontend. El frontend requiere el backend para autenticación, gestión de datos espaciales y funcionalidad de procesamiento GeoJSON.
