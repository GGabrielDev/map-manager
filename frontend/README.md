# Geospatial Administration System – Frontend

## Overview

This frontend is a comprehensive geospatial administration system built with **React**, **TypeScript**, **Vite**, and **Leaflet**. It provides an interactive web interface for managing hierarchical geographical administrative divisions (States → Municipalities → Parishes) and their spatial subdivisions (Quadrants and Communal Circuits), along with Points of Interest that can be spatially associated with these entities. The system is designed to work seamlessly with **Leaflet** for interactive map visualization and the backend API for geospatial data management, authentication, and role-based access control. It features comprehensive map-based data interaction, spatial boundary visualization, and real-time geospatial data management.

### Key Features

- **Interactive Map Interface** with Leaflet for visualizing and managing geographical boundaries, quadrants, communal circuits, communal councils, and points of interest
- **Complete CRUD Operations** via intuitive UI for geographical entities (states, municipalities, parishes, quadrants, communal circuits, communal councils, points of interest), users, roles, and permissions
- **Spatial Data Visualization** with GeoJSON rendering, boundary editing, and spatial relationship display
- **Real-time Map Interaction** for creating, editing, and managing spatial boundaries directly on the map
- **Automatic Spatial Association** UI for Points of Interest with visual feedback when they fall within Quadrants or Communal Circuits
- **Role-Based Access Control Interface** with permission-based UI rendering and feature access
- **JWT Authentication** with secure token management and session handling
- **Hierarchical Dashboard System** with specialized dashboards for different management categories
- **Leaflet Integration** with custom controls, drawing tools, and spatial query interfaces
- **Responsive Design** optimized for desktop map interaction and mobile field use
- **TypeScript** for type safety and better development experience

### Technology Stack

**Core Dependencies:**

- **React** with **TypeScript** for component-based UI development
- **Vite** for fast development server and optimized production builds
- **Leaflet** for interactive map visualization and geospatial data interaction
- **React-Leaflet** for React integration with Leaflet maps
- **Redux Toolkit** for predictable state management
- **React Router Dom** for client-side routing and navigation

**Geospatial Integration:**

- **Leaflet** for interactive map rendering and user interaction
- **Leaflet Draw** for creating and editing spatial boundaries
- **GeoJSON** processing for spatial data visualization
- **Turf.js** for spatial analysis and geometric operations
- **Proj4js** for coordinate system transformations

**UI/UX & Styling:**

- **Material UI** with custom theming optimized for map interfaces
- **Leaflet CSS** for map styling and controls
- **Responsive Design** with map-first mobile considerations
- **Custom Map Controls** for spatial data management

**Data Management:**

- **Axios** for API communication with spatial data endpoints
- **React Query** for efficient geospatial data caching and synchronization
- **GeoJSON Validation** for spatial data integrity
- **Real-time Updates** for collaborative spatial editing

**Development Tools:**

- **ESLint** with TypeScript and React-Leaflet specific rules
- **Prettier** for consistent code formatting
- **TypeScript** strict mode for spatial data type safety
- **Leaflet TypeScript Definitions** for map interaction typing

## Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **Yarn** package manager
- **Backend API** running with PostGIS support (see backend documentation for setup)
- **Modern Web Browser** with WebGL support for optimal map rendering

### Environment Configuration

Create a `.env` file in the frontend directory with the following variables:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:4000
VITE_API_TIMEOUT=30000

# Map Configuration
VITE_DEFAULT_MAP_CENTER_LAT=10.4806
VITE_DEFAULT_MAP_CENTER_LNG=-66.9036
VITE_DEFAULT_MAP_ZOOM=7
VITE_MAX_MAP_ZOOM=18
VITE_MIN_MAP_ZOOM=5

# Tile Server Configuration
VITE_TILE_SERVER_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_TILE_SERVER_ATTRIBUTION=© OpenStreetMap contributors

# Feature Flags
VITE_ENABLE_SPATIAL_EDITING=true
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_OFFLINE_MODE=false

# Environment
NODE_ENV=development
```

### Installation Steps

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Install additional geospatial dependencies:**

   ```bash
   yarn add leaflet react-leaflet @types/leaflet leaflet-draw @turf/turf proj4
   ```

4. **Start the development server:**

   ```bash
   yarn dev
   ```

5. **Build for production:**
   ```bash
   yarn build
   ```

The development server will start at `http://localhost:5173` with the interactive map interface.

## Available Scripts

- **`yarn dev`** - Start development server with hot module replacement using Vite
- **`yarn build`** - Build the application for production (TypeScript compilation + Vite build)
- **`yarn lint`** - Run ESLint with auto-fix for JavaScript, JSX, TypeScript, and TSX files
- **`yarn preview`** - Preview the production build locally

## Dashboard Architecture

The frontend now features a hierarchical dashboard structure that improves navigation and user experience:

### **Main Dashboard**

- **Central Hub**: Overview of system status and quick access to specialized dashboards
- **Navigation Menu**: Easy access to all dashboard categories
- **System Overview**: Key metrics and recent activity across all modules

### **Administrative Dashboard**

- **User Management**: Create, edit, and manage user accounts
- **Role Management**: Configure roles and assign permissions
- **Permission Management**: Fine-grained access control configuration
- **System Settings**: Application configuration and preferences

### **Geographical Dashboard**

- **State Management**: Manage geographical states
- **Municipality Management**: Handle municipalities within states
- **Parish Management**: Organize parishes within municipalities
- **Quadrant Management**: Define and manage quadrants with polygon boundaries
- **Communal Circuit Management**: Manage communal circuits with polygon boundaries
- **Communal Council Management**: Handle councils directly related to circuits with polygon boundaries

### **Spatial Dashboard**

- **Map Editor**: Full-screen interactive map editing interface
- **Boundary Manager**: Tools for creating and editing spatial boundaries
- **Point of Interest Manager**: Manage POIs with point geometry
- **Spatial Analytics**: Analysis and reporting of spatial relationships
- **Geometry Validation**: Real-time validation of spatial data

## Project Structure

```
frontend/
├── public/                          # Static assets and map resources
│   ├── map-icons/                   # Custom map markers and icons
│   ├── tile-cache/                  # Offline map tile storage
│   └── favicon.ico                  # Application favicon
├── src/
│   ├── assets/                      # Static assets and spatial resources
│   │   ├── map-styles/              # Custom Leaflet CSS and themes
│   │   ├── spatial-icons/           # Icons for different entity types
│   │   └── default-boundaries/      # Default GeoJSON boundary files
│   ├── components/                  # Reusable UI and map components
│   │   ├── map/                     # Map-specific components
│   │   │   ├── LeafletMap.tsx       # Main interactive map component
│   │   │   ├── MapControls.tsx      # Custom map control buttons
│   │   │   ├── DrawingTools.tsx     # Spatial boundary drawing tools
│   │   │   ├── LayerManager.tsx     # Map layer visibility controls
│   │   │   ├── SpatialSearch.tsx    # Spatial query interface
│   │   │   └── CoordinateDisplay.tsx # Mouse coordinate display
│   │   ├── spatial/                 # Spatial data components
│   │   │   ├── BoundaryEditor.tsx   # GeoJSON boundary editing
│   │   │   ├── PointOfInterestMarker.tsx # POI map markers
│   │   │   ├── QuadrantLayer.tsx    # Quadrant boundary visualization
│   │   │   ├── CircuitLayer.tsx     # Communal circuit visualization
│   │   │   └── SpatialAssociation.tsx # Automatic spatial relationship UI
│   │   ├── forms/                   # Entity management forms
│   │   │   ├── StateForm.tsx        # State creation/editing
│   │   │   ├── MunicipalityForm.tsx # Municipality management
│   │   │   ├── ParishForm.tsx       # Parish management
│   │   │   ├── QuadrantForm.tsx     # Quadrant with spatial editing
│   │   │   ├── CircuitForm.tsx      # Communal circuit management
│   │   │   ├── CouncilForm.tsx      # Communal council management
│   │   │   ├── POIForm.tsx          # Point of interest with map picker
│   │   │   ├── OrganismForm.tsx     # Organism management
│   │   │   ├── ResponsibleForm.tsx  # Responsible person management
│   │   │   ├── UserForm.tsx         # User management
│   │   │   └── RoleForm.tsx         # Role and permission management
│   │   ├── tables/                  # Data listing components
│   │   │   ├── StatesTable.tsx      # States listing with map preview
│   │   │   ├── MunicipalitiesTable.tsx # Municipalities with hierarchy
│   │   │   ├── ParishesTable.tsx    # Parishes with spatial info
│   │   │   ├── QuadrantsTable.tsx   # Quadrants with fleet data
│   │   │   ├── CircuitsTable.tsx    # Communal circuits listing
│   │   │   ├── CouncilsTable.tsx    # Communal councils listing
│   │   │   ├── POITable.tsx         # Points of interest with coordinates
│   │   │   ├── OrganismsTable.tsx   # Organisms listing
│   │   │   ├── ResponsiblesTable.tsx # Responsible persons
│   │   │   ├── UsersTable.tsx       # User management table
│   │   │   └── RolesTable.tsx       # Roles and permissions table
│   │   ├── dashboard/               # Dashboard components
│   │   │   ├── MainDashboard.tsx    # Central dashboard hub
│   │   │   ├── AdministrativeDashboard.tsx # User/Role management dashboard
│   │   │   ├── GeographicalDashboard.tsx   # Geographical entities dashboard
│   │   │   ├── SpatialDashboard.tsx # Spatial data management dashboard
│   │   │   ├── SpatialOverview.tsx  # Map-based dashboard overview
│   │   │   ├── FleetManagement.tsx  # Fleet statistics and management
│   │   │   ├── EntityStats.tsx      # Geographical entity statistics
│   │   │   └── RecentActivity.tsx   # Recent spatial data changes
│   │   └── common/                  # Shared UI components
│   │       ├── ProtectedRoute.tsx   # Route protection wrapper
│   │       ├── LoadingSpinner.tsx   # Loading states
│   │       ├── ErrorBoundary.tsx    # Error handling
│   │       └── ConfirmDialog.tsx    # Confirmation dialogs
│   ├── hooks/                       # Custom React hooks
│   │   ├── spatial/                 # Spatial data hooks
│   │   │   ├── useMapData.tsx       # Map data fetching and caching
│   │   │   ├── useSpatialQuery.tsx  # Spatial query operations
│   │   │   ├── useBoundaryEditor.tsx # Boundary editing logic
│   │   │   └── useGeoLocation.tsx   # User location services
│   │   ├── entities/                # Entity management hooks
│   │   │   ├── useStates.tsx        # States CRUD operations
│   │   │   ├── useMunicipalities.tsx # Municipalities management
│   │   │   ├── useParishes.tsx      # Parishes management
│   │   │   ├── useQuadrants.tsx     # Quadrants with spatial data
│   │   │   ├── useCircuits.tsx      # Communal circuits management
│   │   │   ├── useCouncils.tsx      # Communal councils management
│   │   │   ├── usePOI.tsx           # Points of interest management
│   │   │   ├── useOrganisms.tsx     # Organisms management
│   │   │   └── useResponsibles.tsx  # Responsible persons management
│   │   ├── auth/                    # Authentication hooks
│   │   │   ├── useAuth.tsx          # Authentication state
│   │   │   ├── usePermissions.tsx   # Permission checking
│   │   │   └── useRoles.tsx         # Role management
│   │   └── ui/                      # UI-specific hooks
│   │       ├── useNotifications.tsx # Toast notifications
│   │       ├── useModal.tsx         # Modal management
│   │       └── useTheme.tsx         # Theme switching
│   ├── pages/                       # Application pages/views
│   │   ├── auth/                    # Authentication pages
│   │   │   └── LoginPage.tsx        # User authentication
│   │   ├── dashboard/               # Dashboard pages
│   │   │   ├── MainDashboard.tsx    # Main dashboard with map overview
│   │   │   ├── AdministrativeDashboard.tsx # Administrative management dashboard
│   │   │   ├── GeographicalDashboard.tsx   # Geographical entities dashboard
│   │   │   ├── SpatialDashboard.tsx # Spatial analytics dashboard
│   │   │   └── FleetDashboard.tsx   # Fleet management dashboard
│   │   ├── geographical/            # Geographical entity pages
│   │   │   ├── StatesPage.tsx       # States management
│   │   │   ├── MunicipalitiesPage.tsx # Municipalities management
│   │   │   ├── ParishesPage.tsx     # Parishes management
│   │   │   ├── QuadrantsPage.tsx    # Quadrants with map interface
│   │   │   ├── CircuitsPage.tsx     # Communal circuits management
│   │   │   └── CouncilsPage.tsx     # Communal councils management
│   │   ├── administrative/          # Administrative pages
│   │   │   ├── OrganismsPage.tsx    # Organisms management
│   │   │   ├── ResponsiblesPage.tsx # Responsible persons management
│   │   │   ├── UsersPage.tsx        # User management
│   │   │   └── RolesPage.tsx        # Roles and permissions
│   │   └── spatial/                 # Spatial-specific pages
│   │       ├── MapEditor.tsx        # Full-screen map editing interface
│   │       ├── BoundaryManager.tsx  # Boundary management interface
│   │       ├── POIManager.tsx       # Point of Interest management
│   │       └── SpatialAnalytics.tsx # Spatial analysis and reporting
│   ├── services/                    # API and external services
│   │   ├── api/                     # Backend API integration
│   │   │   ├── auth.ts              # Authentication endpoints
│   │   │   ├── states.ts            # States API calls
│   │   │   ├── municipalities.ts    # Municipalities API calls
│   │   │   ├── parishes.ts          # Parishes API calls
│   │   │   ├── quadrants.ts         # Quadrants with GeoJSON support
│   │   │   ├── circuits.ts          # Communal circuits API calls
│   │   │   ├── councils.ts          # Communal councils API calls
│   │   │   ├── poi.ts               # Points of interest API calls
│   │   │   ├── organisms.ts         # Organisms API calls
│   │   │   ├── responsibles.ts      # Responsible persons API calls
│   │   │   ├── users.ts             # Users API calls
│   │   │   └── roles.ts             # Roles and permissions API calls
│   │   ├── spatial/                 # Spatial processing services
│   │   │   ├── geoJsonProcessor.ts  # GeoJSON validation and processing
│   │   │   ├── spatialQueries.ts    # Spatial relationship queries
│   │   │   ├── coordinateUtils.ts   # Coordinate system utilities
│   │   │   └── boundaryValidator.ts # Spatial boundary validation
│   │   └── map/                     # Map-specific services
│   │       ├── tileManager.ts       # Map tile management
│   │       ├── layerManager.ts      # Map layer management
│   │       └── mapUtils.ts          # Map utility functions
│   ├── store/                       # Redux store configuration
│   │   ├── index.ts                 # Store setup and configuration
│   │   ├── slices/                  # Redux slices
│   │   │   ├── authSlice.ts         # Authentication state
│   │   │   ├── mapSlice.ts          # Map state and settings
│   │   │   ├── entitiesSlice.ts     # Geographical entities state
│   │   │   ├── spatialSlice.ts      # Spatial data and operations
│   │   │   └── uiSlice.ts           # UI state (modals, notifications)
│   │   └── middleware/              # Custom Redux middleware
│   │       ├── spatialMiddleware.ts # Spatial data processing
│   │       └── apiMiddleware.ts     # API request handling
│   ├── types/                       # TypeScript type definitions
│   │   ├── api.ts                   # API response types
│   │   ├── spatial.ts               # Spatial data types (GeoJSON, coordinates)
│   │   ├── entities.ts              # Entity type definitions
│   │   ├── auth.ts                  # Authentication types
│   │   └── map.ts                   # Map-specific types
│   ├── utils/                       # Utility functions
│   │   ├── spatial/                 # Spatial utility functions
│   │   │   ├── geoJsonUtils.ts      # GeoJSON manipulation utilities
│   │   │   ├── coordinateUtils.ts   # Coordinate conversion utilities
│   │   │   └── spatialValidation.ts # Spatial data validation
│   │   ├── api/                     # API utility functions
│   │   │   ├── errorHandling.ts     # API error handling
│   │   │   ├── requestUtils.ts      # Request formatting utilities
│   │   │   └── responseUtils.ts     # Response processing utilities
│   │   └── common/                  # Common utility functions
│   │       ├── dateUtils.ts         # Date formatting utilities
│   │       ├── validationUtils.ts   # Form validation utilities
│   │       └── formatUtils.ts       # Data formatting utilities
│   ├── styles/                      # Global styles and themes
│   │   ├── globals.css              # Global CSS styles
│   │   ├── leaflet-custom.css       # Custom Leaflet styles
│   │   └── material-ui-theme.ts     # Material UI theme configuration
│   ├── App.tsx                      # Main application component with routing
│   ├── main.tsx                     # Application entry point
│   └── vite-env.d.ts                # Vite environment type definitions
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML template with map meta tags
├── package.json                     # Dependencies and scripts
├── tsconfig.app.json                # TypeScript config for app
├── tsconfig.json                    # Main TypeScript configuration
├── tsconfig.node.json               # TypeScript config for Node.js
├── vite.config.ts                   # Vite configuration with spatial optimizations
└── yarn.lock                        # Yarn lock file
```

## Spatial Data Management

### **Geometry Requirements**

The system now enforces specific geometry types for different entities:

#### **Polygon Entities** (must have polygon boundaries):

- **Quadrants**: Administrative divisions with polygon boundaries
- **Communal Circuits**: Circuit areas with polygon boundaries
- **Communal Councils**: Council territories with polygon boundaries

#### **Point Entities** (must have point geometry):

- **Points of Interest**: Single coordinate locations with point geometry

### **Spatial Forms and Validation**

- **Polygon Editor**: Interactive polygon drawing and editing tools
- **Point Picker**: Click-to-place point selection on map
- **Real-time Validation**: Immediate feedback on geometry validity
- **Spatial Relationship Checking**: Automatic validation of spatial containment

### **Map-Based CRUD Operations**

- **Draw-to-Create**: Draw polygons directly on map to create entities
- **Click-to-Place**: Click on map to place points of interest
- **Drag-to-Edit**: Interactive editing of existing boundaries
- **Visual Feedback**: Real-time visual feedback during spatial operations

## Key Architectural Changes

### **Removed Features**

- **Commune Management**: Removed until future implementation
- **Commune-related forms and pages**: No longer available
- **Commune API integration**: Removed from services

### **Updated Relationships**

- **Communal Councils**: Now directly related to Communal Circuits (not Communes)
- **Spatial Hierarchy**: Simplified to Circuit → Council relationship

### **Enhanced Spatial Features**

- **Geometry Type Enforcement**: Strict validation of polygon vs point geometry
- **Single Point Coordinate**: POIs now use single geometry field instead of separate x/y coordinates
- **Improved Spatial Validation**: Better error handling and user feedback for spatial operations

## Navigation Flow

```
Main Dashboard
├── Administrative Dashboard
│   ├── Users Management
│   └── Roles & Permissions
├── Geographical Dashboard
│   ├── States Management
│   ├── Municipalities Management
│   ├── Parishes Management
│   ├── Quadrants Management (with polygon editing)
│   ├── Circuits Management (with polygon editing)
│   └── Councils Management (with polygon editing)
└── Spatial Dashboard
    ├── Map Editor
    ├── Boundary Manager
    ├── POI Manager (with point geometry)
    └── Spatial Analytics
```

## Authentication & Authorization

### JWT Token Management

- **Token Storage**: Secure token storage with automatic refresh handling
- **Authentication Context**: Global authentication state management via React Context
- **Protected Routes**: Route-level protection with automatic redirects for unauthenticated users
- **Permission Checking**: Component-level permission validation using custom hooks
- **Spatial Access Control**: Map feature access based on user permissions and geographical assignments

### Role-Based Access Control (RBAC)

- **Permission-Based UI**: Dynamic UI rendering based on user permissions for geographical entities
- **Spatial Permissions**: Access control for specific quadrants, circuits, and geographical areas
- **Route Protection**: Access control for different application sections and map editing features
- **User Context**: Current user information, permissions, and assigned geographical areas
- **Automatic Logout**: Token expiration handling with graceful logout and map state cleanup

### Authentication Flow

1. **Login Process**: User credentials sent to backend `/api/auth/login`
2. **Token Management**: JWT token stored and included in API requests
3. **Route Protection**: `ProtectedRoute` component validates authentication and spatial permissions
4. **Permission Validation**: `usePermissions` hook checks user capabilities for geographical operations
5. **Spatial Authorization**: Map editing permissions based on user's assigned geographical areas

## Geospatial Features & Map Integration

### Interactive Map Interface

- **Leaflet Integration**: Full-featured interactive map with zoom, pan, and layer controls
- **Custom Map Controls**: Specialized controls for spatial data management and editing
- **Drawing Tools**: Integrated drawing tools for creating and editing geographical boundaries
- **Layer Management**: Toggle visibility of different geographical layers (states, municipalities, parishes, quadrants, circuits)
- **Coordinate Display**: Real-time coordinate display for precise spatial data entry

### Spatial Data Visualization

- **GeoJSON Rendering**: Dynamic rendering of geographical boundaries from backend GeoJSON data
- **Boundary Editing**: Interactive editing of quadrant and communal circuit boundaries
- **Point of Interest Markers**: Custom markers for different types of points of interest
- **Spatial Relationships**: Visual representation of spatial associations between entities
- **Fleet Visualization**: Color-coded visualization of fleet data within quadrants

### Map-Based CRUD Operations

- **Click-to-Create**: Create new points of interest by clicking on the map
- **Drag-to-Edit**: Move points of interest by dragging markers
- **Boundary Drawing**: Draw new boundaries for quadrants and communal circuits
- **Spatial Validation**: Real-time validation of spatial relationships and overlaps
- **Automatic Association**: Automatic assignment of points to quadrants/circuits based on coordinates

## API Integration

### Backend Communication

- **Spatial Endpoints**: Integration with backend GeoJSON endpoints for spatial data
- **Real-time Updates**: WebSocket integration for real-time spatial data updates
- **Batch Operations**: Efficient handling of bulk spatial data operations
- **Caching Strategy**: Intelligent caching of map tiles and spatial data for performance

### Spatial API Endpoints

- **GeoJSON Endpoints**: Direct integration with `/api/quadrants/geojson` and `/api/communal-circuits/geojson`
- **Spatial Queries**: Bounding box queries for efficient map viewport loading
- **Coordinate Validation**: Server-side validation of spatial coordinates and boundaries
- **Spatial Association**: Automatic spatial relationship detection and updates

### Error Handling

- **Spatial Validation Errors**: Handling of boundary overlap and invalid geometry errors
- **Network Errors**: Graceful handling of map tile loading failures
- **Authentication Errors**: Token expiration handling with map state preservation
- **Spatial Conflict Resolution**: User-friendly resolution of spatial data conflicts

### API Response Format

```typescript
// Spatial Data Response
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

// Error Response
{
  error: string,
  code: "SPATIAL_VALIDATION_ERROR" | "BOUNDARY_OVERLAP" | "INVALID_GEOMETRY",
  details: {
    field: string,
    coordinates?: [number, number]
  }
}
```

## UI/UX Design Principles

### Map-First Design

- **Interactive Map Interface**: Primary interface centered around Leaflet map with intuitive controls
- **Spatial Context**: All data management operations provide spatial context and visualization
- **Mobile-Responsive Maps**: Optimized map interactions for both desktop and mobile devices
- **Accessibility**: WCAG compliance with keyboard navigation for map controls and screen reader support

### Material UI Integration

- **Map-Optimized Components**: Material UI components customized for geospatial data interfaces
- **Spatial Data Tables**: Enhanced tables with coordinate display and map preview integration
- **Custom Map Controls**: Material UI styled controls integrated with Leaflet map interface
- **Responsive Layouts**: Adaptive layouts that prioritize map visibility across screen sizes

### Geospatial UX Features

- **Visual Feedback**: Real-time visual feedback for spatial operations and boundary editing
- **Contextual Information**: Hover tooltips and info panels for geographical entities
- **Spatial Validation**: Visual indicators for spatial relationship validation and conflicts
- **Progressive Disclosure**: Hierarchical data display from states down to specific coordinates

## Fleet Management Interface

### Fleet Visualization

- **Quadrant Fleet Display**: Visual representation of fleet data (small, big, bike vehicles) within quadrants
- **Status Indicators**: Color-coded indicators for active/inactive fleet status
- **Fleet Statistics**: Dashboard widgets showing fleet distribution and utilization
- **Real-time Updates**: Live updates of fleet status changes across the map interface

### Fleet Management Features

- **Interactive Fleet Editing**: Direct editing of fleet numbers through map interface
- **Fleet Analytics**: Statistical analysis and reporting of fleet distribution
- **Fleet Optimization**: Visual tools for optimizing fleet distribution across quadrants
- **Historical Fleet Data**: Timeline view of fleet changes and trends

## Spatial Data Management

### Boundary Management

- **Interactive Boundary Editing**: Draw, edit, and validate geographical boundaries directly on the map
- **Boundary Validation**: Real-time validation of boundary overlaps and spatial relationships
- **Multi-Layer Editing**: Simultaneous editing of multiple geographical layers
- **Boundary Import/Export**: Support for importing and exporting boundary data in various formats

### Point of Interest Management

- **Map-Based POI Creation**: Click-to-create points of interest directly on the map
- **Automatic Spatial Association**: Automatic assignment of POIs to quadrants and circuits based on coordinates
- **POI Categorization**: Visual categorization of different types of points of interest
- **Bulk POI Operations**: Batch operations for managing multiple points of interest

## State Management

### Redux Toolkit Integration

- **Spatial State Management**: Centralized state management for map data, boundaries, and spatial relationships
- **Real-time Synchronization**: State synchronization with backend spatial data updates
- **Optimistic Updates**: Immediate UI updates with rollback capability for spatial operations
- **Spatial Caching**: Intelligent caching of spatial data for improved performance

### State Structure

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

## Development Tools

### Code Quality

- **TypeScript**: Strict type checking with comprehensive spatial data type definitions
- **ESLint**: Advanced linting rules with React-Leaflet and geospatial-specific rules
- **Prettier**: Consistent code formatting across the project
- **Spatial Type Safety**: Custom TypeScript definitions for GeoJSON and coordinate systems

### Development Experience

- **Hot Module Replacement**: Instant updates during development with map state preservation
- **Fast Refresh**: React Fast Refresh for component state preservation during map interactions
- **Path Aliases**: Clean import paths with TypeScript path mapping for spatial utilities
- **Map Development Tools**: Leaflet debugging tools and coordinate inspection utilities

## Performance Optimization

### Map Performance

- **Tile Caching**: Intelligent caching of map tiles for offline capability
- **Spatial Data Optimization**: Efficient loading and rendering of large GeoJSON datasets
- **Viewport-Based Loading**: Dynamic loading of spatial data based on map viewport
- **Layer Management**: Optimized rendering of multiple geographical layers

### Build Optimization

- **Code Splitting**: Route-based and feature-based code splitting for map components
- **Tree Shaking**: Elimination of unused Leaflet plugins and spatial utilities
- **Asset Optimization**: Optimization of map icons, markers, and spatial assets
- **Bundle Analysis**: Analysis of spatial library bundle sizes and optimization

### Runtime Performance

- **Spatial Indexing**: Client-side spatial indexing for fast point-in-polygon queries
- **Debounced Map Events**: Optimized handling of map pan, zoom, and draw events
- **Virtual Rendering**: Efficient rendering of large numbers of map markers
- **Memory Management**: Proper cleanup of map instances and spatial data

## Security Features

### Spatial Security

- **Boundary Validation**: Server-side validation of spatial boundaries and coordinates
- **Spatial Access Control**: Permission-based access to geographical areas and editing capabilities
- **Coordinate Sanitization**: Validation and sanitization of coordinate inputs
- **Spatial Data Integrity**: Protection against malicious GeoJSON and spatial data injection

### Client-Side Security

- **XSS Protection**: Input sanitization for spatial data and coordinate inputs
- **CSRF Protection**: Token-based validation for spatial data modifications
- **Secure Map Tiles**: HTTPS
