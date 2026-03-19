/* eslint-disable @typescript-eslint/no-explicit-any */
type GoogleMapSetupParams = {
  container: HTMLDivElement;
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
  maxBounds: [[number, number], [number, number]];
  zoomControl: boolean;
};

let googleScriptPromise: Promise<void> | null = null;

function getGoogleMapsGlobal(): any | null {
  const maybeWindow = window as unknown as { google?: unknown };
  const maybeGoogle = maybeWindow.google as { maps?: unknown } | undefined;
  return maybeGoogle?.maps ? maybeWindow.google : null;
}

export async function ensureGoogleMapsScriptLoaded(): Promise<void> {
  if (getGoogleMapsGlobal()) return;
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/api/google-maps-js?libraries=drawing,geometry&v=weekly&language=es";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el script de Google Maps."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export function createGoogleMap({
  container,
  center,
  zoom,
  minZoom,
  maxZoom,
  maxBounds,
  zoomControl,
}: GoogleMapSetupParams): any {
  const g = getGoogleMapsGlobal();
  if (!g?.maps) {
    throw new Error("Google Maps no esta disponible.");
  }

  const [northEast, southWest] = maxBounds;
  const restriction = {
    north: northEast[0],
    east: northEast[1],
    south: southWest[0],
    west: southWest[1],
  };

  return new g.maps.Map(container, {
    center: { lat: center[0], lng: center[1] },
    zoom,
    minZoom,
    maxZoom,
    zoomControl,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    restriction: {
      latLngBounds: restriction,
      strictBounds: false,
    },
    gestureHandling: "greedy",
  });
}

export function destroyGoogleMap(map: any | null, listeners: any[] = []): void {
  if (!map) return;
  listeners.forEach((listener) => {
    if (listener?.remove) listener.remove();
  });
  const g = getGoogleMapsGlobal();
  if (g?.maps?.event) {
    g.maps.event.clearInstanceListeners(map);
  }
}
