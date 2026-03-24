import type { SelectedPoint } from "../services/lifestyleMatcherPoints.service";
import { ZONA_1_REFERENCE_CENTER } from "./lifestyleMatcherPoints.constants";

export type LatLng = { lat: number; lng: number };

export type SuggestionCenterSource = "firstPinned" | "zonaGeoJson" | "zona1Default";

export type SuggestionSearchCenterDetail = {
  center: LatLng;
  source: SuggestionCenterSource;
};

/**
 * Centro para buscar sugerencias Places:
 * - Primera prioridad en orden con coordenadas en `pointLocations`.
 * - Si no hay ninguna fijada y hay `zonaCentroid` (p. ej. bbox del GeoJSON de la zona buscada), ese punto.
 * - Si no, Zona 1 (referencia; no implica marcador en el mapa).
 */
export function resolveSuggestionSearchCenterDetail(params: {
  selectedPoints: SelectedPoint[];
  pointLocations: Record<string, LatLng>;
  zonaCentroid?: LatLng | null;
  zona1Center?: LatLng;
}): SuggestionSearchCenterDetail {
  const {
    selectedPoints,
    pointLocations,
    zonaCentroid = null,
    zona1Center = ZONA_1_REFERENCE_CENTER,
  } = params;

  for (const point of selectedPoints) {
    const loc = pointLocations[point.id];
    if (loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)) {
      return { center: { lat: loc.lat, lng: loc.lng }, source: "firstPinned" };
    }
  }

  if (zonaCentroid && Number.isFinite(zonaCentroid.lat) && Number.isFinite(zonaCentroid.lng)) {
    return { center: { lat: zonaCentroid.lat, lng: zonaCentroid.lng }, source: "zonaGeoJson" };
  }

  return {
    center: { lat: zona1Center.lat, lng: zona1Center.lng },
    source: "zona1Default",
  };
}

export function resolveSuggestionSearchCenter(params: {
  selectedPoints: SelectedPoint[];
  pointLocations: Record<string, LatLng>;
  zonaCentroid?: LatLng | null;
  zona1Center?: LatLng;
}): LatLng {
  return resolveSuggestionSearchCenterDetail(params).center;
}
