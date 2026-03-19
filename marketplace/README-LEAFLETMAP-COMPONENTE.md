# README - Componente `LeafletMap.tsx`

Este documento explica el componente `src/components/Map/LeafletMap.tsx`, por que funciona en la pagina aunque marque errores de TypeScript, y que riesgos tecnicos hay.

## 1. Que hace el componente

`LeafletMap` es un componente reusable que:

- Inicializa un mapa Leaflet en cliente (`"use client"`).
- Aplica tiles de OpenStreetMap.
- Configura zoom y limites geograficos.
- Permite dibujo manual sin plugins:
  - `polygon`: click por puntos.
  - `circle`: click 1 (centro), click 2 (radio), preview con mouse.
- Exporta GeoJSON por callback (`onGeoJsonCreate`).
- Limpia figuras bajo demanda.

## 2. Props publicas

Archivo: `src/components/Map/LeafletMap.tsx`

- `className`: estilos del contenedor.
- `center`, `zoom`, `minZoom`, `maxZoom`, `maxBounds`: configuracion del mapa.
- `zoomControl`, `attributionControl`: controles nativos Leaflet.
- `drawEnabled`: activa/desactiva modo dibujo.
- `drawShape`: `"polygon"` o `"circle"`.
- `createRequestId`: trigger para crear/exportar GeoJSON.
- `clearRequestId`: trigger para limpiar figura.
- `onGeoJsonCreate(payload, error?)`: callback de salida.

## 3. Flujo interno (resumen)

### 3.1 Inicializacion del mapa

En el `useEffect` principal:

1. Valida que exista el `div` contenedor y que no haya mapa previo.
2. Configura iconos por defecto con `L.Icon.Default.mergeOptions`.
3. Crea `L.map(...)` con center/zoom/bounds.
4. Agrega `L.tileLayer(...)`.
5. Guarda instancia en `mapRef`.

### 3.2 Estado mutable con `useRef`

Se usan `refs` para evitar re-render por cada click:

- `latlngsRef`: puntos del poligono.
- `polygonRef`: capa `L.Polygon`.
- `circleRef`: capa `L.Circle`.
- `circleCenterRef`: centro temporal de circulo.

Tambien hay refs para handlers y acciones:

- `onMapClickPolygonRef`, `onMapClickCircleRef`, `onMapMoveCircleRef`.
- `applyDrawModeRef`: conecta/desconecta listeners segun modo.
- `emitGeoJsonRef`: valida y emite salida.
- `clearDrawingRef`: remueve capas y resetea estado.

### 3.3 Cambio de modo dibujo

`applyDrawModeRef`:

- Siempre hace `off(...)` de listeners previos (evita duplicados).
- Si `drawEnabled` es `false`, no agrega listeners.
- Si `drawShape = polygon`, usa click para acumular vertices.
- Si `drawShape = circle`, usa click para centro/radio y `mousemove` para preview.

### 3.4 Exportacion GeoJSON

`emitGeoJsonRef`:

- Poligono: requiere minimo 3 puntos.
- Circulo: requiere centro cerrado (dos clicks completos).
- Para circulo agrega `properties.radius` en metros.

### 3.5 Cleanup

Al desmontar:

- `map.off()` y `map.remove()`.
- Limpia refs de capas y handlers.

## 4. Por que funciona aunque marque errores

Esto pasa mucho en Leaflet + TypeScript:

1. **Error de tipos de `leaflet`**  
   Si falta `@types/leaflet`, TypeScript marca errores, pero JS en runtime sigue ejecutando.

2. **Tipado debilitado con `declare module "leaflet"`**  
   El archivo `src/types/leaflet.d.ts` elimina el bloqueo de compilacion de tipos, pero deja menos validacion estricta.

3. **Errores globales del repo no relacionados**  
   Puede haber errores en otras carpetas (`.next/types`, tests, modulos legacy) y el mapa igual renderiza en dev.

4. **Logica basada en refs**  
   El flujo de dibujo depende de refs mutables; runtime funciona bien, pero TypeScript puede no inferir algunos estados intermedios.

## 5. Errores comunes esperables en este archivo

- `Could not find a declaration file for module 'leaflet'`.
- Errores en tipos de eventos/capas si faltan tipos oficiales.
- Warnings por nullability si se endurece `tsconfig`.

## 6. Recomendacion para dejarlo solido (sin cambiar arquitectura)

1. Instalar tipos oficiales:

```bash
npm i -D @types/leaflet
```

2. Si ya usas `@types/leaflet`, eliminar `src/types/leaflet.d.ts` para recuperar tipado real.
3. Mantener este componente como base reusable y pasar solo props desde modulos pagina.

## 7. Contrato actual con `MapaDinamicoBody`

Archivo consumidor:  
`src/app/enterprise/mapa-dinamico/components/MapaDinamicoBody.tsx`

Contrato:

- `drawEnabled` y `drawShape` controlan listeners de dibujo.
- `createRequestId` dispara exportacion GeoJSON.
- `clearRequestId` limpia figura.
- `onGeoJsonCreate` muestra el resultado en modal.

Con eso el modulo funciona aunque existan errores de tipado externos al flujo del mapa.
