import { NextRequest } from "next/server";
import bbox from "@turf/bbox";
import transformScale from "@turf/transform-scale";
import type { FeatureCollection, GeoJsonProperties, MultiPolygon, Polygon } from "geojson";
import { successResponse } from "@/lib/api-helpers";

type IsoCorrectedRequest = {
  center?: { lat?: unknown; lng?: unknown };
  target_time_minutes?: unknown;
  mapbox_geojson?: unknown;
};

type IsoCorrectedMetadata = {
  original_time: number;
  google_avg_time: number | null;
  scale_factor: number;
  explanation: string;
  fallback: boolean;
  samples_used: number;
  reason?: string;
};

type IsoCorrectedResponse = {
  corrected_geojson: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
  metadata: IsoCorrectedMetadata;
};

const MIN_SCALE_FACTOR = 0.55;
const MAX_SCALE_FACTOR = 1.7;
const MATRIX_BASE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

function toFiniteNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getDistanceMatrixKey(): string | null {
  const key =
    process.env.GOOGLE_DISTANCE_MATRIX_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY_SERVER ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  const trimmed = key.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isValidLatLng(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function sanitizeFeatureCollection(
  raw: unknown
): FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as FeatureCollection;
  if (candidate.type !== "FeatureCollection" || !Array.isArray(candidate.features)) return null;

  const features = candidate.features.filter((feature) => {
    const geometryType = feature?.geometry?.type;
    return geometryType === "Polygon" || geometryType === "MultiPolygon";
  }) as Array<any>;

  if (!features.length) return null;

  return {
    type: "FeatureCollection",
    features,
  };
}

function buildControlPoints(params: {
  centerLat: number;
  centerLng: number;
  geoJson: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
}): Array<{ lat: number; lng: number }> {
  const { centerLat, centerLng, geoJson } = params;
  const [minLng, minLat, maxLng, maxLat] = bbox(geoJson);
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;

  const candidates = [
    { lat: maxLat, lng: midLng }, // N
    { lat: minLat, lng: midLng }, // S
    { lat: midLat, lng: maxLng }, // E
    { lat: midLat, lng: minLng }, // W
    { lat: maxLat, lng: maxLng }, // NE
    { lat: maxLat, lng: minLng }, // NW
    { lat: minLat, lng: maxLng }, // SE
    { lat: minLat, lng: minLng }, // SW
  ];

  const unique = new Map<string, { lat: number; lng: number }>();
  candidates.forEach((point) => {
    if (!isValidLatLng(point.lat, point.lng)) return;
    const key = `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`;
    unique.set(key, point);
  });

  const controlPoints = Array.from(unique.values()).filter(
    (point) => Math.abs(point.lat - centerLat) > 1e-9 || Math.abs(point.lng - centerLng) > 1e-9
  );
  return controlPoints.slice(0, 8);
}

async function fetchDistanceMatrixDurations(params: {
  apiKey: string;
  centerLat: number;
  centerLng: number;
  destinations: Array<{ lat: number; lng: number }>;
}): Promise<number[]> {
  const { apiKey, centerLat, centerLng, destinations } = params;
  if (!destinations.length) return [];

  const url = new URL(MATRIX_BASE_URL);
  url.searchParams.set("origins", `${centerLat},${centerLng}`);
  url.searchParams.set(
    "destinations",
    destinations.map((d) => `${d.lat},${d.lng}`).join("|")
  );
  url.searchParams.set("mode", "driving");
  url.searchParams.set("departure_time", "now");
  url.searchParams.set("traffic_model", "pessimistic");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Distance Matrix fallo (${response.status}).`);
  }

  const payload = (await response.json()) as {
    status?: string;
    rows?: Array<{ elements?: Array<{ status?: string; duration?: { value?: number }; duration_in_traffic?: { value?: number } }> }>;
    error_message?: string;
  };

  if (payload.status !== "OK") {
    throw new Error(payload.error_message || `Google Distance Matrix status=${payload.status ?? "UNKNOWN"}`);
  }

  const elements = payload.rows?.[0]?.elements ?? [];
  return elements
    .filter((element) => element?.status === "OK")
    .map((element) => {
      const durationSec = element.duration_in_traffic?.value ?? element.duration?.value;
      return typeof durationSec === "number" && Number.isFinite(durationSec) ? durationSec / 60 : null;
    })
    .filter((minutes): minutes is number => typeof minutes === "number" && Number.isFinite(minutes) && minutes > 0);
}

function fallbackResponse(params: {
  geoJson: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;
  targetMinutes: number;
  reason: string;
}): IsoCorrectedResponse {
  const { geoJson, targetMinutes, reason } = params;
  return {
    corrected_geojson: geoJson,
    metadata: {
      original_time: targetMinutes,
      google_avg_time: null,
      scale_factor: 1,
      explanation: "Se mantiene la isocrona original por fallback.",
      fallback: true,
      samples_used: 0,
      reason,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IsoCorrectedRequest;
    const geoJson = sanitizeFeatureCollection(body.mapbox_geojson);
    const targetMinutes = toFiniteNumber(body.target_time_minutes);
    const centerLat = toFiniteNumber(body.center?.lat);
    const centerLng = toFiniteNumber(body.center?.lng);

    if (!geoJson || !targetMinutes || targetMinutes <= 0 || centerLat === null || centerLng === null) {
      return successResponse(
        fallbackResponse({
          geoJson: geoJson ?? { type: "FeatureCollection", features: [] },
          targetMinutes: targetMinutes ?? 0,
          reason: "Payload invalido para correccion de isocrona.",
        })
      );
    }

    if (!isValidLatLng(centerLat, centerLng)) {
      return successResponse(
        fallbackResponse({
          geoJson,
          targetMinutes,
          reason: "Centro invalido para Distance Matrix.",
        })
      );
    }

    const apiKey = getDistanceMatrixKey();
    if (!apiKey) {
      return successResponse(
        fallbackResponse({
          geoJson,
          targetMinutes,
          reason: "No hay API key de Distance Matrix configurada.",
        })
      );
    }

    const controlPoints = buildControlPoints({ centerLat, centerLng, geoJson });
    if (!controlPoints.length) {
      return successResponse(
        fallbackResponse({
          geoJson,
          targetMinutes,
          reason: "No se generaron puntos de control validos.",
        })
      );
    }

    let durationsMinutes: number[];
    try {
      durationsMinutes = await fetchDistanceMatrixDurations({
        apiKey,
        centerLat,
        centerLng,
        destinations: controlPoints,
      });
    } catch (error) {
      return successResponse(
        fallbackResponse({
          geoJson,
          targetMinutes,
          reason: error instanceof Error ? error.message : "Error consultando Google Distance Matrix.",
        })
      );
    }

    if (!durationsMinutes.length) {
      return successResponse(
        fallbackResponse({
          geoJson,
          targetMinutes,
          reason: "Google no devolvio duraciones aprovechables.",
        })
      );
    }

    const averageGoogleMinutes = durationsMinutes.reduce((sum, value) => sum + value, 0) / durationsMinutes.length;
    const rawFactor = targetMinutes / averageGoogleMinutes;
    const scaleFactor = clamp(rawFactor, MIN_SCALE_FACTOR, MAX_SCALE_FACTOR);
    const correctedGeoJson = transformScale(geoJson as any, scaleFactor, {
      origin: [centerLng, centerLat],
    }) as FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>;

    return successResponse({
      corrected_geojson: correctedGeoJson,
      metadata: {
        original_time: targetMinutes,
        google_avg_time: Number(averageGoogleMinutes.toFixed(2)),
        scale_factor: Number(scaleFactor.toFixed(3)),
        explanation:
          scaleFactor > 1
            ? "Se expandio la geometria para aproximar el tiempo objetivo."
            : scaleFactor < 1
              ? "Se contrajo la geometria para aproximar el tiempo objetivo."
              : "No fue necesario ajustar la geometria.",
        fallback: false,
        samples_used: durationsMinutes.length,
      },
    } satisfies IsoCorrectedResponse);
  } catch {
    // Fallback final defensivo para no romper UI.
    return successResponse({
      corrected_geojson: {
        type: "FeatureCollection",
        features: [],
      },
      metadata: {
        original_time: 0,
        google_avg_time: null,
        scale_factor: 1,
        explanation: "Se retorno fallback por error inesperado.",
        fallback: true,
        samples_used: 0,
        reason: "Error inesperado en route de correccion.",
      },
    } satisfies IsoCorrectedResponse);
  }
}
