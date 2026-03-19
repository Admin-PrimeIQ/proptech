# README Especial: Leaflet en Next.js (solo mapa)

Guia para que otra persona pueda llevar **solo el mapa de Leaflet** a otro proyecto Next.js.

## Objetivo
Con esta guia podras mostrar un mapa en pantalla con:
- Carga correcta de Leaflet en Next.js (Client Component).
- Estilos necesarios para que el contenedor del mapa tenga altura y ancho.
- Limites de navegacion (`maxBounds`) y niveles de zoom (`minZoom`, `maxZoom`).

## Links oficiales recomendados
- Next.js: https://nextjs.org/docs
- Leaflet: https://leafletjs.com/
- Referencia de API Leaflet (`L.map` y opciones): https://leafletjs.com/reference.html#map-option
- Tiles OpenStreetMap: https://www.openstreetmap.org/

## Dependencias
Instala en tu proyecto:

```bash
npm i leaflet
```

> Nota: `leaflet-sidebar` es opcional si solo quieres el mapa base.

## Archivos minimos que debes tener

```txt
src/
  app/
    components/
      MapClient.jsx
      MapCanvas.jsx
    globals.css
    layout.js
    page.js
```

## 1) `src/app/layout.js`
Importa los estilos globales:

```jsx
import './globals.css';

export const metadata = {
  title: 'Mapa',
  description: 'Mapa con Leaflet'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

## 2) `src/app/globals.css`
Sin altura en `html`, `body` y contenedor del mapa, Leaflet no se ve.

```css
@import "leaflet/dist/leaflet.css";

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.app-shell {
  position: relative;
  width: 100%;
  height: 100vh;
}

#map {
  width: 100%;
  height: 100%;
}
```

## 3) `src/app/components/MapCanvas.jsx`
Contenedor simple del mapa:

```jsx
"use client";

import { forwardRef } from 'react';

const MapCanvas = forwardRef(function MapCanvas({ id = 'map', ...rest }, ref) {
  return <div id={id} ref={ref} {...rest} />;
});

export default MapCanvas;
```

## 4) `src/app/components/MapClient.jsx`
Componente cliente que inicializa Leaflet y configura limites.

```jsx
"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import MapCanvas from './MapCanvas';

export default function MapClient() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: typeof iconRetinaUrl === 'string' ? iconRetinaUrl : iconRetinaUrl?.src,
      iconUrl: typeof iconUrl === 'string' ? iconUrl : iconUrl?.src,
      shadowUrl: typeof shadowUrl === 'string' ? shadowUrl : shadowUrl?.src
    });

    const map = L.map(mapRef.current, {
      center: [14.60782, -90.513863],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
      keyboard: true,
      minZoom: 7,
      maxZoom: 16,
      maxBounds: [
        [18.44834670293207, -88.04443359375001],
        [10.692996347925087, -92.98828125]
      ]
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return () => {
      map.off();
      map.remove();
    };
  }, []);

  return <MapCanvas id="map" ref={mapRef} />;
}
```

## 5) `src/app/page.js`
Renderiza el mapa en una pantalla completa:

```jsx
import MapClient from './components/MapClient';

export default function Page() {
  return (
    <main className="app-shell">
      <MapClient />
    </main>
  );
}
```

## Parametros clave para que se muestre correctamente

- `center`: coordenada inicial del mapa (`[lat, lng]`).
- `zoom`: nivel inicial.
- `minZoom` y `maxZoom`: rango permitido.
- `maxBounds`: caja geografica limite para no salir del area permitida.
- `#map { width: 100%; height: 100%; }`: obligatorio para que Leaflet pinte el mapa.
- `.app-shell { height: 100vh; }`: hace que ocupe toda la pantalla.

## Ejemplo de limites (`maxBounds`)
Formato:

```js
maxBounds: [
  [latNorte, lngEste],
  [latSur, lngOeste]
]
```

En este proyecto:

```js
maxBounds: [
  [18.44834670293207, -88.04443359375001],
  [10.692996347925087, -92.98828125]
]
```

## Checklist rapido
- `leaflet` instalado.
- `@import "leaflet/dist/leaflet.css";` en `globals.css`.
- `MapClient` con `"use client"`.
- Contenedor del mapa con altura real (`100%` o `100vh`).
- `L.tileLayer(...)` agregado al mapa.

---

Cuando quieras, en el siguiente paso agregamos la parte de figuras (poligono/circulo) sobre este mismo README.

