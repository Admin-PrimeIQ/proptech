/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarkerClusterer } from "@googlemaps/markerclusterer";

function getGoogleMapsGlobal(): any | null {
  const maybeWindow = window as unknown as { google?: unknown };
  const maybeGoogle = maybeWindow.google as { maps?: unknown } | undefined;
  return maybeGoogle?.maps ? maybeWindow.google : null;
}

function getFeatureCoordinates(feature: any): { lat: number; lng: number } | null {
  const coordinates = feature?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function buildMarkerHtml(properties: Record<string, unknown>): string {
  const proyecto = String(properties.nombreProyecto ?? properties.proyecto ?? "Nombre del proyecto");
  const desarrollador = String(properties.nombreDesarrollador ?? properties.desarrollador ?? "Nombre desarrollador");
  const categoria = String(properties.categoria ?? "Categoria");
  const image = String(properties.imagen ?? properties.urlImagen ?? "");
  const imageHtml = image
    ? `<img src="${image}" alt="${proyecto}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;" />`
    : `<div style="width:100%;height:100%;border-radius:14px;background:#e5e8ee;"></div>`;

  return `
    <div style="width:min(520px,calc(100vw - 40px));padding:8px;">
      <div style="display:grid;grid-template-columns:120px 1fr;gap:14px;align-items:start;padding:12px;border-radius:20px;background:#fff;">
        <div style="width:120px;height:120px;border-radius:14px;overflow:hidden;background:#eceff4;">${imageHtml}</div>
        <div style="min-width:0;">
          <h4 style="margin:0 22px 6px 0;color:#22305a;font-size:22px;line-height:1.1;font-weight:800;">${proyecto}</h4>
          <p style="margin:0 0 10px;color:#6d7381;font-size:16px;line-height:1.2;">${desarrollador}</p>
          <span style="display:inline-block;padding:6px 12px;border-radius:10px;background:#e7edf5;color:#2e3a5f;font-size:18px;font-weight:700;line-height:1.15;">${categoria}</span>
        </div>
      </div>
    </div>
  `;
}

export function clearMarkers(params: {
  markers: any[];
  markerListeners: any[];
  clusterer: { current: MarkerClusterer | null };
  infoWindowRef: { current: any | null };
}): void {
  const { markers, markerListeners, clusterer, infoWindowRef } = params;
  markerListeners.forEach((listener) => listener?.remove?.());
  markerListeners.length = 0;
  if (clusterer.current) {
    clusterer.current.clearMarkers();
    clusterer.current = null;
  }
  markers.forEach((marker) => marker.setMap?.(null));
  markers.length = 0;
  infoWindowRef.current?.close?.();
}

export function applyMarkers(params: {
  map: any;
  markersGeoJson: any;
  markers: any[];
  markerListeners: any[];
  clusterer: { current: MarkerClusterer | null };
  forceMarkersVisible: boolean;
  infoWindowRef: { current: any | null };
}): void {
  const { map, markersGeoJson, markers, markerListeners, clusterer, forceMarkersVisible, infoWindowRef } = params;
  const g = getGoogleMapsGlobal();
  if (!g?.maps || !markersGeoJson) return;

  if (!infoWindowRef.current) {
    infoWindowRef.current = new g.maps.InfoWindow();
  }

  const source =
    markersGeoJson && Array.isArray(markersGeoJson.features)
      ? markersGeoJson
      : markersGeoJson?.data && Array.isArray(markersGeoJson.data.features)
        ? markersGeoJson.data
        : null;
  const features = Array.isArray(source?.features) ? source.features : [];
  const nextMarkers: any[] = [];

  features.forEach((feature) => {
    const coords = getFeatureCoordinates(feature);
    if (!coords) return;

    const properties = (feature.properties ?? {}) as Record<string, unknown>;
    const marker = new g.maps.Marker({
      position: coords,
      title: String(properties.nombreProyecto ?? properties.proyecto ?? ""),
      map,
    });

    const listener = marker.addListener("click", () => {
      infoWindowRef.current.setContent(buildMarkerHtml(properties));
      infoWindowRef.current.open({ map, anchor: marker });
    });

    markerListeners.push(listener);
    nextMarkers.push(marker);
  });

  if (forceMarkersVisible && nextMarkers.length > 40) {
    clusterer.current = new MarkerClusterer({ map, markers: nextMarkers });
  }
  markers.push(...nextMarkers);
}
