/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DrawShape } from "./mapEngine.types";

function roundCoord(value: number): number {
  return Number(value.toFixed(8));
}

function normalizeLngLat(latLng: any): [number, number] {
  return [roundCoord(latLng.lng()), roundCoord(latLng.lat())];
}

export function overlayToGeoJson(shape: DrawShape, overlay: any): Record<string, unknown> | null {
  if (!overlay) return null;

  if (shape === "circle") {
    const center = overlay.getCenter?.();
    if (!center) return null;
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: normalizeLngLat(center),
      },
      properties: {
        radius: Number(overlay.getRadius?.() ?? 0),
      },
    };
  }

  if (shape === "polygon") {
    const path = overlay.getPath?.();
    if (!path) return null;
    const ring: [number, number][] = [];
    for (let i = 0; i < path.getLength(); i += 1) {
      ring.push(normalizeLngLat(path.getAt(i)));
    }
    if (ring.length < 3) return null;
    const [firstLng, firstLat] = ring[0];
    const [lastLng, lastLat] = ring[ring.length - 1];
    if (firstLng !== lastLng || firstLat !== lastLat) {
      ring.push([firstLng, firstLat]);
    }
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [ring],
      },
      properties: {},
    };
  }

  if (shape === "polyline") {
    const path = overlay.getPath?.();
    if (!path) return null;
    const coordinates: [number, number][] = [];
    for (let i = 0; i < path.getLength(); i += 1) {
      coordinates.push(normalizeLngLat(path.getAt(i)));
    }
    if (coordinates.length < 2) return null;
    return {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates,
      },
      properties: {},
    };
  }

  return null;
}

export function emitDrawingGeoJson(
  overlays: Array<{ shape: DrawShape; overlay: any }>
): Record<string, unknown> | null {
  if (!overlays.length) return null;
  const features = overlays
    .map(({ shape, overlay }) => overlayToGeoJson(shape, overlay))
    .filter((feature): feature is Record<string, unknown> => feature !== null);

  if (!features.length) return null;
  return {
    type: "FeatureCollection",
    features,
  };
}
