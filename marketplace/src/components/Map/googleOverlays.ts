/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChoroplethOptions, OverlayRenderer } from "./mapEngine.types";

function getGoogleMapsGlobal(): any | null {
  const maybeWindow = window as unknown as { google?: unknown };
  const maybeGoogle = maybeWindow.google as { maps?: unknown } | undefined;
  return maybeGoogle?.maps ? maybeWindow.google : null;
}

function interpolateColor(minColor: string, maxColor: string, ratio: number): string {
  const clamp = Math.max(0, Math.min(1, ratio));
  const parseHex = (color: string): [number, number, number] => {
    const raw = color.replace("#", "");
    const safe = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
    return [
      parseInt(safe.slice(0, 2), 16),
      parseInt(safe.slice(2, 4), 16),
      parseInt(safe.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parseHex(minColor);
  const [r2, g2, b2] = parseHex(maxColor);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  const r = Math.round(r1 + (r2 - r1) * clamp);
  const g = Math.round(g1 + (g2 - g1) * clamp);
  const b = Math.round(b1 + (b2 - b1) * clamp);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function readFeatureValue(feature: any, valueProperty: string): number {
  const raw = feature.getProperty?.(valueProperty);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function clearGeoJsonOverlay(map: any, features: any[]): void {
  features.forEach((feature) => map.data.remove(feature));
  features.length = 0;
}

export function applyGeoJsonOverlay(params: {
  map: any;
  geoJson: object | null;
  renderer: OverlayRenderer;
  choroplethOptions?: ChoroplethOptions;
  popupEnabled: boolean;
  infoWindowRef: { current: any | null };
  listenerRef: { current: any | null };
}): any[] {
  const { map, geoJson, renderer, choroplethOptions, popupEnabled, infoWindowRef, listenerRef } = params;
  const g = getGoogleMapsGlobal();
  if (!g?.maps) return [];

  if (listenerRef.current?.remove) {
    listenerRef.current.remove();
    listenerRef.current = null;
  }

  if (!geoJson) return [];
  const features = map.data.addGeoJson(geoJson as any) as any[];

  const scale = choroplethOptions?.scale ?? ["#eff3ff", "#1f6feb"];
  const minColor = scale[0] ?? "#eff3ff";
  const maxColor = scale[scale.length - 1] ?? "#1f6feb";
  const valueProperty = choroplethOptions?.valueProperty ?? "incidents";

  let maxValue = 1;
  if (renderer === "choropleth") {
    features.forEach((feature) => {
      maxValue = Math.max(maxValue, readFeatureValue(feature, valueProperty));
    });
  }

  map.data.setStyle((feature: any) => {
    const ratio = renderer === "choropleth" ? readFeatureValue(feature, valueProperty) / maxValue : 0.3;
    const fillColor = renderer === "choropleth" ? interpolateColor(minColor, maxColor, ratio) : "#1f6feb";
    return {
      strokeColor: choroplethOptions?.style?.color ?? "#1f6feb",
      strokeWeight: choroplethOptions?.style?.weight ?? 2,
      fillColor,
      fillOpacity: choroplethOptions?.style?.fillOpacity ?? 0.25,
      clickable: popupEnabled,
    };
  });

  if (popupEnabled) {
    if (!infoWindowRef.current) {
      infoWindowRef.current = new g.maps.InfoWindow();
    }
    listenerRef.current = map.data.addListener("click", (event: any) => {
      const feature = event.feature;
      const codigoSubzona = feature.getProperty?.("codigoSubzona") ?? "";
      const nombreDescriptivo = feature.getProperty?.("nombreDescriptivo") ?? feature.getProperty?.("nombre") ?? "";
      const incidents = feature.getProperty?.("incidents") ?? 0;
      const html = `<b>${codigoSubzona}</b><br/>${nombreDescriptivo}<br/>Incidents: ${incidents}`;
      infoWindowRef.current.setContent(html);
      infoWindowRef.current.setPosition(event.latLng);
      infoWindowRef.current.open(map);
    });
  }

  return features;
}

function extendBoundsFromCoordinates(bounds: any, coordinates: unknown): void {
  if (!Array.isArray(coordinates)) return;
  if (coordinates.length >= 2 && typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    bounds.extend({ lng: coordinates[0], lat: coordinates[1] });
    return;
  }
  coordinates.forEach((item) => extendBoundsFromCoordinates(bounds, item));
}

export function fitMapToGeoJson(map: any, geoJson: any): void {
  const g = getGoogleMapsGlobal();
  if (!g?.maps || !geoJson) return;
  const bounds = new g.maps.LatLngBounds();
  const features = Array.isArray(geoJson.features) ? geoJson.features : [];
  features.forEach((feature) => {
    const geometry = feature?.geometry;
    if (!geometry) return;
    extendBoundsFromCoordinates(bounds, geometry.coordinates);
  });
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, 20);
  }
}
