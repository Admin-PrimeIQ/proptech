# Inventario de Mapa en Frontend (Estado Actual)

Este documento refleja el estado actual del frontend despues de la migracion de Leaflet a Google Maps en las vistas Enterprise.

## Estado actual del motor

- Motor activo: `Google Maps`
- Contenedor de mapa: `src/components/Map/MapContainer.tsx`
- Adapter activo: `src/components/Map/GoogleMapAdapter.tsx`
- Leaflet en `src/`: **eliminado**

## Dependencias activas de mapa

Archivo: `package.json`

- `@googlemaps/markerclusterer`

## Puntos de entrada en UI

- `src/app/enterprise/mapa-dinamico/page.tsx`
  - Renderiza `MapaDinamicoBody`, que consume `MapContainer`.
- `src/app/enterprise/mapa-absorcion/page.tsx`
  - Renderiza `MapaAbsorcionBody`, que consume `MapContainer`.

## Nucleo Google Maps reutilizable

- `src/components/Map/MapContainer.tsx`
  - Punto unico de render del mapa.
  - Enruta al adapter Google.

- `src/components/Map/GoogleMapAdapter.tsx`
  - Componente principal del mapa.
  - Inicializa Google Maps, maneja toolbar, dibujo, overlays, sidebar y estilos de mapa.
  - Emite GeoJSON para flujos existentes.

- `src/components/Map/googleMapSetup.ts`
  - Carga segura del script via endpoint server-side.
  - Crea/destruye instancia de mapa Google.

- `src/components/Map/googleDrawing.ts`
  - Controla modos de dibujo y limpieza de overlays.

- `src/components/Map/googleGeoJson.ts`
  - Convierte overlays dibujados a GeoJSON.
  - Mantiene `properties.radius` para circulos.

- `src/components/Map/googleOverlays.ts`
  - Render de overlay GeoJSON/choropleth.
  - Fit a bounds por geometria.

- `src/components/Map/googleMarkers.ts`
  - Render de marcadores normales.
  - Popup por marcador y cluster opcional.

- `src/components/Map/mapEngine.types.ts`
  - Tipos compartidos del motor de mapa y props publicas.

## Endpoint de carga segura de Google Maps

- `src/app/api/google-maps-js/route.ts`
  - Sirve el script JS de Google Maps desde backend.
  - Usa variables de entorno y evita hardcodear la key en cliente.

## Estilos actuales del mapa (Google)

- `src/app/enterprise/mapa-dinamico/components/MapaDinamicoBody.module.scss`
  - Clases neutrales del adapter: `.map-root`, `.map-canvas`, `.map-toolbar`, `.map-sidebar`, `.sidebar-toggle`, submenus.

- `src/app/enterprise/mapa-absorcion/components/MapaAbsorcionBody.module.scss`
  - Contenedor base para `MapContainer` con `.map-root` y `.map-canvas`.

- `src/app/globals.scss`
  - Ya no contiene imports ni reglas de Leaflet.

## Funciones manejadas por Leaflet vs Google

### Leaflet (actual)

- Ninguna funcion activa en `src/`.
- No hay componentes, tipos, setup ni estilos Leaflet en uso.

### Google Maps (actual)

- **Inicializacion y teardown**
  - `ensureGoogleMapsScriptLoaded`, `createGoogleMap`, `destroyGoogleMap`
  - Archivo: `src/components/Map/googleMapSetup.ts`

- **Dibujo**
  - `initializeGoogleDrawingController`, `applyGoogleDrawingMode`, `clearGoogleDrawing`
  - Archivo: `src/components/Map/googleDrawing.ts`

- **Serializacion GeoJSON**
  - `overlayToGeoJson`, `emitDrawingGeoJson`
  - Archivo: `src/components/Map/googleGeoJson.ts`

- **Overlays y fit**
  - `applyGeoJsonOverlay`, `fitMapToGeoJson`, `clearGeoJsonOverlay`
  - Archivo: `src/components/Map/googleOverlays.ts`

- **Marcadores**
  - `applyMarkers`, `clearMarkers`
  - Archivo: `src/components/Map/googleMarkers.ts`

- **Orquestacion de UI del mapa**
  - Toolbar, sidebar, menus, estilos de mapa, ciclo de render de capas
  - Archivo: `src/components/Map/GoogleMapAdapter.tsx`

## Nota operativa

Para mantener este estado, nuevas funciones de mapa deben agregarse sobre `GoogleMapAdapter` y modulos `google*`, no sobre archivos Leaflet legacy.

## Handoff Enterprise Frontend (continuidad de trabajo)

Esta seccion resume los cambios recientes del modulo `enterprise` para que otro agente pueda continuar sin perder contexto.

### Reglas de implementacion usadas en este flujo

- No se modifico la arquitectura global del proyecto.
- Se priorizo estado local + datos mock (sin consumo final de APIs de negocio).
- Se dejaron puntos de extension con servicios y tipos para conectar backend despues.

### Rutas nuevas y estado actual

- `src/app/enterprise/planes/page.tsx`
  - Dashboard de planes (desktop + mobile) con CTA a pasos siguientes.
- `src/app/enterprise/planes/mejorar/page.tsx`
  - Vista de comparacion/mejora de plan.
- `src/app/enterprise/planes/proyectos/page.tsx`
  - Vista tipo explorador (carpetas + archivos).
- `src/app/enterprise/lifestyle-matcher/page.tsx`
  - Paso 1 de configuracion (`ranking`, `tiempo`, `velocidad`, `trafico`).
- `src/app/enterprise/lifestyle-matcher/puntos/page.tsx`
  - Paso 2 de ubicaciones favoritas con mapa.

### Componente reutilizable mobile

- `src/components/Enterprise/EnterpriseMobileBottomNav.tsx`
- `src/components/Enterprise/EnterpriseMobileBottomNav.module.scss`

Se reutiliza en varias vistas enterprise para evitar duplicacion del bottom nav.

### Paso 1: Lifestyle Matcher (estado funcional)

Archivos principales:

- `src/app/enterprise/lifestyle-matcher/components/LifestyleMatcherBody.tsx`
- `src/app/enterprise/lifestyle-matcher/components/LifestyleMatcherBody.module.scss`
- `src/app/enterprise/lifestyle-matcher/components/CategoryList.tsx`
- `src/app/enterprise/lifestyle-matcher/components/CategoryItem.tsx`

Funcionalidades activas:

- Input de busqueda editable para prioridades.
- Drag and drop con `dnd-kit` (handle dedicado).
- Reordenamiento con `arrayMove`.
- Eliminacion de categoria con boton `X`.
- Selector de tiempo maximo (toggle por opcion).
- Velocidad promedio con slider + escala de referencia.
- Toggle de trafico en tiempo real.
- Navegacion a paso 2 con boton `Siguiente`.

Dependencias nuevas agregadas:

- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

### Paso 2: Ubicaciones favoritas (estado funcional)

Archivos principales:

- `src/app/enterprise/lifestyle-matcher/puntos/components/LifestyleMatcherPointsBody.tsx`
- `src/app/enterprise/lifestyle-matcher/puntos/components/LifestyleMatcherPointsBody.module.scss`
- `src/app/enterprise/lifestyle-matcher/puntos/services/lifestyleMatcherPoints.service.ts`

Funcionalidades activas:

- Render de Google Maps real dentro del panel de mapa (no mock visual).
- Fijacion de punto en mapa para los items listados.
- Marcador por punto seleccionado (reemplazo de marcador al volver a fijar).
- Guardado temporal de coordenadas en variable local:
  - `pointLocations: Record<string, { lat: number; lng: number }>`
- Actualizacion de subtitulo del punto con coordenadas fijadas.

Notas de UX y responsive en paso 2:

- Desktop mantiene layout modal con sidebar + mapa.
- Mobile usa estructura tipo hoja inferior sobre mapa.
- En mobile se oculta footer global de layout en esta ruta con clase de `body`.

### Ajustes hechos sobre footer global (mobile)

Para evitar que el footer global tape la experiencia en ciertas vistas mobile de lifestyle:

- Paso 1 usa clase `body.lifestyle-matcher-page`.
- Paso 2 usa clase `body.lifestyle-matcher-step2-page`.
- En ambos casos, en mobile se oculta:
  - `.tp-footer-area`
  - `.back-to-top-wrapper`

### Pendientes recomendados para el siguiente agente

- Conectar `pointLocations` a endpoint real (guardar en DB).
- Persistir ranking y configuracion de paso 1 al backend.
- Integrar geocodificacion real en buscador de direccion del paso 2.
- Reemplazar controles mock (`BUSCAR`, `+/-`, `◎`) por acciones reales de mapa.
- Agregar validaciones de flujo (ejemplo: bloquear `Crear Isochrones` si faltan puntos).
- Agregar pruebas de integracion para flujo completo paso 1 -> paso 2.

