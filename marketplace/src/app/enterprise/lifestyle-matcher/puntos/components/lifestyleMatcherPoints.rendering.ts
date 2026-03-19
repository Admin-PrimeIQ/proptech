import type { GoogleLatLng } from "./lifestyleMatcherPoints.types";

export type MarkerViewportRow = {
  lat: number;
  lng: number;
  properties: Record<string, unknown>;
};

export function getStableRowIdentity(row: MarkerViewportRow): string {
  return String(row.properties.id ?? row.properties.codigoProyecto ?? `${row.lat},${row.lng}`);
}

export function markerKeyOfRow(row: MarkerViewportRow): string {
  const source = String(row.properties.markerSource ?? "housing");
  return `${source}:${getStableRowIdentity(row)}`;
}

export function sortRowsByStableIdentity(rows: MarkerViewportRow[]): MarkerViewportRow[] {
  return [...rows].sort((a, b) => getStableRowIdentity(a).localeCompare(getStableRowIdentity(b)));
}

export function isRowInViewport(row: MarkerViewportRow, sw: GoogleLatLng, ne: GoogleLatLng): boolean {
  const latPad = Math.max((ne.lat() - sw.lat()) * 0.2, 0.0025);
  const lngPad = Math.max((ne.lng() - sw.lng()) * 0.2, 0.0025);
  const minLat = sw.lat() - latPad;
  const maxLat = ne.lat() + latPad;
  const minLng = sw.lng() - lngPad;
  const maxLng = ne.lng() + lngPad;
  return row.lat >= minLat && row.lat <= maxLat && row.lng >= minLng && row.lng <= maxLng;
}

export function resolveCommercialRenderRatio(zoom: number): number {
  if (zoom >= 17) return 1;
  if (zoom >= 16) return 0.75;
  if (zoom >= 15) return 0.5;
  return 0.25; // zoom 14.x
}

export function resolveCommercialVisibilityByHysteresis(params: {
  zoom: number;
  previousVisible: boolean;
  minZoom: number;
}): boolean {
  const { zoom, previousVisible, minZoom } = params;
  const showZoom = Math.max(minZoom, 14.1);
  const hideZoom = showZoom - 0.3;
  return Number.isFinite(zoom) && (previousVisible ? zoom >= hideZoom : zoom >= showZoom);
}
