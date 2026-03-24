import bbox from "@turf/bbox";
import { HOUSING_CATEGORY_ICON_MAP } from "./lifestyleMatcherPoints.constants";
import type { FeatureCollection, HousingMarkerGroup } from "./lifestyleMatcherPoints.types";

export function resolveHousingCategoryFromProperties(properties: Record<string, unknown>): string {
  const raw = String(properties.categoria ?? properties.uso ?? "").trim();
  return raw.length > 0 ? raw : "Sin categoria";
}

export function resolveHousingCategoryIcon(category: string): string | null {
  const normalized = category.toLowerCase().trim();
  if (normalized === "vertical" || normalized.includes("vertical")) return HOUSING_CATEGORY_ICON_MAP.vertical;
  if (normalized === "horizontal" || normalized.includes("horizontal")) return HOUSING_CATEGORY_ICON_MAP.horizontal;
  if (normalized === "terrenos" || normalized.includes("terreno") || normalized.includes("lote")) {
    return HOUSING_CATEGORY_ICON_MAP.terreno;
  }
  return null;
}

export function resolveHousingMarkerGroupFromProperties(
  properties: Record<string, unknown>
): HousingMarkerGroup | null {
  const raw = String(properties.categoria ?? properties.uso ?? "").toLowerCase().trim();
  if (!raw) return "vertical";
  if (raw.includes("terreno") || raw.includes("lote")) return "terrenos";
  if (raw.includes("horizontal") || raw.includes("casa") || raw.includes("vivienda horizontal")) return "horizontal";
  if (raw.includes("vertical") || raw.includes("apartamento") || raw.includes("edificio")) return "vertical";
  return "vertical";
}

export function parseOptionalNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatInteger(value: unknown): string {
  const parsed = parseOptionalNumber(value);
  if (parsed === null) return "N/D";
  return Math.round(parsed).toLocaleString("es-GT");
}

export function formatPrecioPromedioM2(value: unknown): string {
  const parsed = parseOptionalNumber(value);
  if (parsed === null) return "N/D";
  return parsed.toLocaleString("es-GT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function readFirstString(properties: Record<string, unknown>, keys: string[], fallback = "N/D"): string {
  for (const key of keys) {
    const raw = properties[key];
    if (raw === null || raw === undefined) continue;
    const text = String(raw).trim();
    if (text.length > 0) return text;
  }
  return fallback;
}

export function deriveIncidentsFromProperties(properties: Record<string, unknown>): number {
  const byIncidents = Number(properties.incidents);
  if (Number.isFinite(byIncidents)) return byIncidents;

  const codigoSubzona = String(properties.codigoSubzona ?? "");
  const subzonaMatch = codigoSubzona.match(/_(\d{1,3})$/);
  if (subzonaMatch) {
    const value = Number(subzonaMatch[1]);
    if (Number.isFinite(value)) return value;
  }

  const byZona = Number(properties.zona);
  if (Number.isFinite(byZona)) return byZona;

  const zonaPrimaria = String(properties.zonaPrimaria ?? "");
  const zoneMatch = zonaPrimaria.match(/^Z(\d{1,2})$/i);
  if (zoneMatch) return Number(zoneMatch[1]);

  const byOrigenFid = Number(properties.origenFid);
  if (Number.isFinite(byOrigenFid)) return byOrigenFid;

  return 0;
}

export function buildMarkerFeatureKey(
  feature: FeatureCollection["features"][number],
  index: number
): string {
  const properties = (feature.properties ?? {}) as Record<string, unknown>;
  const geometry = (feature.geometry ?? {}) as { coordinates?: unknown };
  const coordinates = Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
  const lon = coordinates.length > 0 ? String(coordinates[0]) : "lon";
  const lat = coordinates.length > 1 ? String(coordinates[1]) : "lat";

  const stableId = String(
    feature.id ??
      properties.idPublic ??
      properties.id ??
      properties.proyectoId ??
      properties.nombreProyecto ??
      properties.proyecto ??
      `idx-${index}`
  ).trim();

  return `${stableId}-${lon}-${lat}`;
}

export function mergeMarkerCollections(collections: FeatureCollection[]): FeatureCollection {
  const seen = new Set<string>();
  const merged: FeatureCollection["features"] = [];

  for (const collection of collections) {
    for (let index = 0; index < collection.features.length; index += 1) {
      const feature = collection.features[index];
      const key = buildMarkerFeatureKey(feature, index);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(feature);
    }
  }

  return {
    type: "FeatureCollection",
    features: merged,
  };
}

function buildFeatureIdentity(feature: FeatureCollection["features"][number]): string {
  const properties = (feature.properties ?? {}) as Record<string, unknown>;
  const geometry = (feature.geometry ?? {}) as { coordinates?: unknown };
  const coordinates = Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
  const lon = coordinates.length > 0 ? String(coordinates[0]) : "lon";
  const lat = coordinates.length > 1 ? String(coordinates[1]) : "lat";
  const stableId = String(
    feature.id ??
      properties.idPublic ??
      properties.id ??
      properties.proyectoId ??
      properties.nombreProyecto ??
      properties.proyecto ??
      "no-id"
  ).trim();
  return `${stableId}-${lon}-${lat}`;
}

export function intersectMarkerCollections(left: FeatureCollection, right: FeatureCollection): FeatureCollection {
  const rightKeys = new Set(right.features.map((feature) => buildFeatureIdentity(feature)));
  return {
    type: "FeatureCollection",
    features: left.features.filter((feature) => rightKeys.has(buildFeatureIdentity(feature))),
  };
}

export function extractFeatureCollection(payload: unknown): FeatureCollection | null {
  const asCollection = payload as FeatureCollection;
  if (asCollection?.type === "FeatureCollection" && Array.isArray(asCollection?.features)) {
    return asCollection;
  }
  const wrapped = (payload as { data?: FeatureCollection })?.data;
  if (wrapped?.type === "FeatureCollection" && Array.isArray(wrapped?.features)) {
    return wrapped;
  }
  return null;
}

/** Centro del bbox de todas las features (útil como punto de búsqueda Places para una zona). */
export function centroidFromFeatureCollectionBbox(collection: FeatureCollection | null): { lat: number; lng: number } | null {
  if (!collection || !Array.isArray(collection.features) || collection.features.length === 0) {
    return null;
  }
  try {
    const [minLng, minLat, maxLng, maxLat] = bbox(collection as Parameters<typeof bbox>[0]);
    if (!Number.isFinite(minLng) || !Number.isFinite(minLat) || !Number.isFinite(maxLng) || !Number.isFinite(maxLat)) {
      return null;
    }
    return {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    };
  } catch {
    return null;
  }
}
