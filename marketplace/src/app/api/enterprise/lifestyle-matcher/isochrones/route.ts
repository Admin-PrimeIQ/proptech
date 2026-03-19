import { NextRequest, NextResponse } from "next/server";
import area from "@turf/area";
import buffer from "@turf/buffer";
import difference from "@turf/difference";
import intersect from "@turf/intersect";
import union from "@turf/union";
import { featureCollection } from "@turf/helpers";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import { handleApiError } from "@/lib/api-helpers";
import type {
  GravitationalIsochroneProperties,
  GravitationalProcessedLayer,
  IsoContourUnit,
  IsochronePointInput,
  IsoTrafficProfile,
  MapboxIsochroneFeatureCollection,
  MultiIsochroneRequest,
  MultiIsochroneResponse,
} from "@/types/isochrones";

const MAPBOX_ISO_BASE_URL = "https://api.mapbox.com/isochrone/v1/mapbox";
const MAX_POINTS = 12;
const KM2_DIVISOR = 1_000_000;
const ISO_CORS_ALLOW_ORIGIN = process.env.ISO_CORS_ALLOW_ORIGIN || "*";

const GRAVITATIONAL_CONFIG = {
  shrinkDistance: -500,
  units: "meters" as const,
  preserveDominant: true,
  minimumRetention: 0.2,
};

type RateLimitEntry = {
  windowStart: number;
  count: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function withCors(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", ISO_CORS_ALLOW_ORIGIN);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

function jsonWithCors(body: unknown, init?: ResponseInit): NextResponse {
  return withCors(NextResponse.json(body, init));
}

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!forwardedFor) return "unknown-client";
  return forwardedFor.split(",")[0].trim() || "unknown-client";
}

function isRateLimitEnabled(): boolean {
  if (process.env.ISO_RATE_LIMIT_ENABLED === "1") return true;
  if (process.env.NODE_ENV === "production") return true;
  return false;
}

function getRateLimitWindowMs(): number {
  const parsed = Number(process.env.ISO_RATE_LIMIT_WINDOW_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60_000;
}

function getRateLimitMaxRequests(): number {
  const parsed = Number(process.env.ISO_RATE_LIMIT_MAX_REQUESTS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 120;
}

function checkAndUpdateRateLimit(request: NextRequest): { allowed: boolean; retryAfterSec?: number } {
  if (!isRateLimitEnabled()) return { allowed: true };

  const now = Date.now();
  const windowMs = getRateLimitWindowMs();
  const maxRequests = getRateLimitMaxRequests();
  const clientId = getClientIdentifier(request);

  const existing = rateLimitStore.get(clientId);
  if (!existing || now - existing.windowStart >= windowMs) {
    rateLimitStore.set(clientId, { windowStart: now, count: 1 });
    return { allowed: true };
  }

  if (existing.count >= maxRequests) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.windowStart + windowMs - now) / 1000));
    return { allowed: false, retryAfterSec };
  }

  existing.count += 1;
  rateLimitStore.set(clientId, existing);
  return { allowed: true };
}

export function __resetIsoRateLimitForTests() {
  rateLimitStore.clear();
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

function parsePositiveNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function sanitizePoints(input: unknown): IsochronePointInput[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((raw, index) => {
      if (!raw || typeof raw !== "object") return null;
      const candidate = raw as Record<string, unknown>;
      const lat = Number(candidate.lat);
      const lng = Number(candidate.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
      const id = String(candidate.id ?? `point-${index + 1}`);
      const priorityRaw = Number(candidate.priority);
      const priority = Number.isFinite(priorityRaw) ? priorityRaw : index + 1;
      return { id, lat, lng, priority };
    })
    .filter((point): point is IsochronePointInput => point !== null)
    .slice(0, MAX_POINTS);
}

function toTrafficProfile(body: Partial<MultiIsochroneRequest>): IsoTrafficProfile {
  if (body.trafficProfile === "con-trafico" || body.trafficProfile === "sin-trafico") {
    return body.trafficProfile;
  }
  return body.trafficEnabled ? "con-trafico" : "sin-trafico";
}

function toContourUnit(body: Partial<MultiIsochroneRequest>): IsoContourUnit {
  if (body.contourUnit === "hibrido" || body.contourUnit === "calculada" || body.contourUnit === "meters") {
    return body.contourUnit;
  }
  return "meters";
}

function parseContourArray(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => Math.round(value));
}

function getMapboxToken(): string | null {
  const token =
    process.env.MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  if (!token) return null;
  const trimmed = token.trim();
  return trimmed.length ? trimmed : null;
}

function sanitizePolygonFeatures(
  features: unknown
): Array<Feature<Polygon | MultiPolygon>> {
  if (!Array.isArray(features)) return [];
  return features
    .map((raw) => {
      if (!raw || typeof raw !== "object") return null;
      const candidate = raw as Feature;
      const geometryType = candidate.geometry?.type;
      if (geometryType !== "Polygon" && geometryType !== "MultiPolygon") return null;
      return candidate as Feature<Polygon | MultiPolygon>;
    })
    .filter((feature): feature is Feature<Polygon | MultiPolygon> => feature !== null);
}

async function requestPointIsochrone(params: {
  point: IsochronePointInput;
  contourParam: "contours_minutes" | "contours_meters";
  contourValue: number;
  token: string;
  profile: "driving" | "driving-traffic";
  departAt?: string | null;
}): Promise<Array<Feature<Polygon | MultiPolygon>>> {
  const { point, contourParam, contourValue, token, profile, departAt } = params;
  const url = new URL(`${MAPBOX_ISO_BASE_URL}/${profile}/${point.lng},${point.lat}`);
  url.searchParams.set("polygons", "true");
  url.searchParams.set("denoise", "1");
  url.searchParams.set("generalize", "10");
  url.searchParams.set(contourParam, String(contourValue));
  if (departAt && profile === "driving-traffic") {
    url.searchParams.set("depart_at", departAt);
  }
  url.searchParams.set("access_token", token);

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const details = await response.text();
    // Log completo para diagnostico interno sin exponer detalles al cliente.
    console.error("[isochrones][mapbox-error]", {
      status: response.status,
      details,
    });
    throw new Error(`Mapbox Isochrone API fallo (${response.status}).`);
  }

  const payload = (await response.json()) as MapboxIsochroneFeatureCollection;
  return sanitizePolygonFeatures(payload?.features);
}

type LayerRequest = {
  layerId: "time" | "distance" | "calculated";
  contourParam: "contours_minutes" | "contours_meters";
  contourValue: number;
  profile: "driving" | "driving-traffic";
};

function buildLayerRequests(params: {
  contourUnit: IsoContourUnit;
  trafficProfile: IsoTrafficProfile;
  timeMinutes: number;
  speedKmh: number;
  body: Partial<MultiIsochroneRequest>;
}): LayerRequest[] {
  const { contourUnit, trafficProfile, timeMinutes, speedKmh, body } = params;
  const usingTraffic = trafficProfile === "con-trafico";
  const defaultMinutes = clamp(Math.round(timeMinutes), 1, 60);
  const defaultMeters = clamp(Math.round((speedKmh * 1000 * timeMinutes) / 60), 1, 100000);
  const contourMinutes = parseContourArray(body.contoursMinutes);
  const contourMeters = parseContourArray(body.contoursMeters);
  const calculatedMinutes = parseContourArray(body.calculatedMinutes);
  const calculatedTrafficMinutes = parseContourArray(body.calculatedTrafficMinutes);

  if (contourUnit === "hibrido") {
    return [
      {
        layerId: "time",
        contourParam: "contours_minutes",
        contourValue: clamp(contourMinutes[0] ?? defaultMinutes, 1, 60),
        profile: usingTraffic ? "driving-traffic" : "driving",
      },
      {
        layerId: "distance",
        contourParam: "contours_meters",
        contourValue: clamp(contourMeters[0] ?? defaultMeters, 1, 100000),
        profile: "driving",
      },
    ];
  }

  if (contourUnit === "calculada") {
    if (usingTraffic) {
      return [
        {
          layerId: "calculated",
          contourParam: "contours_minutes",
          contourValue: clamp(calculatedTrafficMinutes[0] ?? defaultMinutes, 1, 60),
          profile: "driving-traffic",
        },
      ];
    }
    const minutesList = calculatedMinutes.length
      ? calculatedMinutes.map((value) => clamp(value, 1, 60))
      : [defaultMinutes];
    return minutesList.map((minutesForDistance) => {
      const calculatedMeters = clamp(Math.round((speedKmh * 1000 * minutesForDistance) / 60), 1, 100000);
      return {
        layerId: "calculated" as const,
        contourParam: "contours_meters" as const,
        contourValue: calculatedMeters,
        profile: "driving" as const,
      };
    });
  }

  if (usingTraffic) {
    return [
      {
        layerId: "time",
        contourParam: "contours_minutes",
        contourValue: clamp(contourMinutes[0] ?? defaultMinutes, 1, 60),
        profile: "driving-traffic",
      },
    ];
  }

  const metersList = contourMeters.length
    ? contourMeters.map((value) => clamp(value, 1, 100000))
    : [defaultMeters];

  return metersList.map((value) => ({
    layerId: "distance" as const,
    contourParam: "contours_meters" as const,
    contourValue: value,
    profile: "driving" as const,
  }));
}

function toKm2(m2: number): number {
  return Number((m2 / KM2_DIVISOR).toFixed(3));
}

function featureAreaKm2(feature: Feature<Polygon | MultiPolygon> | null): number {
  if (!feature) return 0;
  try {
    return toKm2(area(feature));
  } catch {
    return 0;
  }
}

function roundRetention(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  return Number(Math.min(1, value).toFixed(3));
}

function safeUnion(
  features: Array<Feature<Polygon | MultiPolygon>>
): Feature<Polygon | MultiPolygon> | null {
  if (!features.length) return null;
  let accumulator = features[0];
  for (let index = 1; index < features.length; index += 1) {
    const nextFeature = features[index];
    try {
      const merged = union(featureCollection([accumulator, nextFeature]));
      if (merged) {
        accumulator = merged as Feature<Polygon | MultiPolygon>;
      }
    } catch (error) {
      console.warn("[iso-gravitational][union] fallback por error", {
        index,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return accumulator;
}

function safeDifference(
  minuend: Feature<Polygon | MultiPolygon>,
  subtrahend: Feature<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null {
  try {
    return difference(featureCollection([minuend, subtrahend])) as Feature<Polygon | MultiPolygon> | null;
  } catch {
    return null;
  }
}

function safeIntersect(
  left: Feature<Polygon | MultiPolygon>,
  right: Feature<Polygon | MultiPolygon>
): Feature<Polygon | MultiPolygon> | null {
  try {
    return intersect(featureCollection([left, right])) as Feature<Polygon | MultiPolygon> | null;
  } catch {
    return null;
  }
}

function safeBuffer(
  feature: Feature<Polygon | MultiPolygon>,
  distance: number
): Feature<Polygon | MultiPolygon> | null {
  try {
    const buffered = buffer(feature, distance, { units: GRAVITATIONAL_CONFIG.units });
    if (!buffered) return null;
    return buffered as Feature<Polygon | MultiPolygon>;
  } catch {
    return null;
  }
}

type GravitationalStepResult = {
  merged: Feature<Polygon | MultiPolygon>;
  effectiveAreaKm2: number;
  areaRetention: number;
  overlapShrinkMeters?: number;
};

function applyGravitationalUnion(params: {
  dominant: Feature<Polygon | MultiPolygon>;
  subordinate: Feature<Polygon | MultiPolygon>;
}): GravitationalStepResult {
  const { dominant, subordinate } = params;
  const dominantAreaKm2 = featureAreaKm2(dominant);
  const subordinateAreaKm2 = featureAreaKm2(subordinate);

  const uniqueSubordinate = safeDifference(subordinate, dominant);
  const overlap = safeIntersect(subordinate, dominant);
  if (!uniqueSubordinate && overlap) {
    const merged = GRAVITATIONAL_CONFIG.preserveDominant ? dominant : overlap;
    const subordinateAreaKm2 = featureAreaKm2(subordinate);
    console.info("[iso-gravitational][step]", {
      dominantAreaKm2: featureAreaKm2(dominant),
      subordinateAreaKm2,
      effectiveAreaKm2: 0,
      retention: 0,
      overlapApplied: true,
      cededCompletely: true,
    });
    return {
      merged,
      effectiveAreaKm2: 0,
      areaRetention: 0,
      overlapShrinkMeters: Math.abs(GRAVITATIONAL_CONFIG.shrinkDistance),
    };
  }
  const shrunkenOverlap =
    overlap && GRAVITATIONAL_CONFIG.shrinkDistance !== 0
      ? safeBuffer(overlap, GRAVITATIONAL_CONFIG.shrinkDistance)
      : overlap;

  const baseCandidates = [uniqueSubordinate, shrunkenOverlap].filter(
    (candidate): candidate is Feature<Polygon | MultiPolygon> => Boolean(candidate)
  );
  let subordinateContribution = safeUnion(baseCandidates);
  let effectiveAreaKm2 = featureAreaKm2(subordinateContribution);

  if (
    subordinateContribution &&
    subordinateAreaKm2 > 0 &&
    effectiveAreaKm2 / subordinateAreaKm2 < GRAVITATIONAL_CONFIG.minimumRetention &&
    uniqueSubordinate
  ) {
    const uniqueAreaKm2 = featureAreaKm2(uniqueSubordinate);
    const uniqueRetention = subordinateAreaKm2 > 0 ? uniqueAreaKm2 / subordinateAreaKm2 : 0;
    if (uniqueRetention >= GRAVITATIONAL_CONFIG.minimumRetention) {
      subordinateContribution = uniqueSubordinate;
      effectiveAreaKm2 = uniqueAreaKm2;
    }
  }

  const merged = GRAVITATIONAL_CONFIG.preserveDominant
    ? subordinateContribution
      ? safeUnion([dominant, subordinateContribution]) ?? dominant
      : dominant
    : subordinateContribution ?? dominant;

  const retention =
    subordinateAreaKm2 > 0 ? roundRetention(effectiveAreaKm2 / subordinateAreaKm2) : 0;

  console.info("[iso-gravitational][step]", {
    dominantAreaKm2,
    subordinateAreaKm2,
    effectiveAreaKm2,
    retention,
    overlapApplied: Boolean(overlap),
  });

  return {
    merged,
    effectiveAreaKm2,
    areaRetention: retention,
    overlapShrinkMeters: overlap ? Math.abs(GRAVITATIONAL_CONFIG.shrinkDistance) : undefined,
  };
}

type LayerGravitationalResult = {
  mergedGeometry: Feature<Polygon | MultiPolygon>;
  processedLayers: GravitationalProcessedLayer[];
  priorityOrder: string[];
};

function processLayerWithGravitationalUnion(params: {
  layer: LayerRequest;
  orderedFeatures: Array<Feature<Polygon | MultiPolygon>>;
  pointsByPriority: IsochronePointInput[];
}): LayerGravitationalResult | null {
  const { layer, orderedFeatures, pointsByPriority } = params;
  if (!orderedFeatures.length) return null;

  const firstFeature = orderedFeatures[0];
  let accumulator = firstFeature;
  const processedLayers: GravitationalProcessedLayer[] = [];
  const priorityOrder: string[] = [];

  const firstPointId = String(firstFeature.properties?.sourcePointId ?? pointsByPriority[0]?.id ?? "point-1");
  const firstPriority = Number(firstFeature.properties?.sourcePriority ?? pointsByPriority[0]?.priority ?? 1);
  const firstAreaKm2 = featureAreaKm2(firstFeature);
  processedLayers.push({
    sourcePointId: firstPointId,
    priority: firstPriority,
    layerId: layer.layerId,
    contourParam: layer.contourParam,
    contourValue: layer.contourValue,
    profile: layer.profile,
    originalAreaKm2: firstAreaKm2,
    effectiveAreaKm2: firstAreaKm2,
    areaRetention: 1,
    dominanceLevel: "total",
  });
  priorityOrder.push(firstPointId);

  for (let index = 1; index < orderedFeatures.length; index += 1) {
    const current = orderedFeatures[index];
    const sourcePointId = String(current.properties?.sourcePointId ?? pointsByPriority[index]?.id ?? `point-${index + 1}`);
    const priority = Number(current.properties?.sourcePriority ?? pointsByPriority[index]?.priority ?? index + 1);
    const originalAreaKm2 = featureAreaKm2(current);

    const gravitational = applyGravitationalUnion({
      dominant: accumulator,
      subordinate: current,
    });
    accumulator = gravitational.merged;
    priorityOrder.push(sourcePointId);
    processedLayers.push({
      sourcePointId,
      priority,
      layerId: layer.layerId,
      contourParam: layer.contourParam,
      contourValue: layer.contourValue,
      profile: layer.profile,
      originalAreaKm2,
      effectiveAreaKm2: gravitational.effectiveAreaKm2,
      areaRetention: gravitational.areaRetention,
      dominanceLevel: "subordinado",
      overlapShrinkMeters: gravitational.overlapShrinkMeters,
    });
  }

  return {
    mergedGeometry: accumulator,
    processedLayers,
    priorityOrder,
  };
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkAndUpdateRateLimit(request);
    if (!rateLimit.allowed) {
      const response = jsonWithCors(
        { error: "Demasiadas solicitudes. Intenta nuevamente en unos segundos." },
        { status: 429 }
      );
      if (rateLimit.retryAfterSec) {
        response.headers.set("Retry-After", String(rateLimit.retryAfterSec));
      }
      return response;
    }

    const body = (await request.json()) as Partial<MultiIsochroneRequest>;
    const points = sanitizePoints(body.points);

    if (!points.length) {
      return jsonWithCors(
        { error: "Debes enviar al menos un punto valido para generar isocronos." },
        { status: 400 }
      );
    }

    const timeMinutes = parsePositiveNumber(body.timeMinutes, 15);
    const speedKmh = parsePositiveNumber(body.speedKmh, 40);
    const trafficProfile = toTrafficProfile(body);
    const contourUnit = toContourUnit(body);
    const layers = buildLayerRequests({
      contourUnit,
      trafficProfile,
      timeMinutes,
      speedKmh,
      body,
    });
    const token = getMapboxToken();

    if (!token) {
      return jsonWithCors(
        { error: "Falta configurar MAPBOX_ACCESS_TOKEN o NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN." },
        { status: 500 }
      );
    }

    // Prioridad ascendente: valor menor = mayor prioridad.
    const pointsByPriority = [...points].sort(
      (a, b) => (a.priority ?? Number.MAX_SAFE_INTEGER) - (b.priority ?? Number.MAX_SAFE_INTEGER)
    );

    const mergedLayers: Array<Feature<Polygon | MultiPolygon>> = [];
    const flattenedProcessedLayers: GravitationalProcessedLayer[] = [];
    for (const layer of layers) {
      const perPointResults = await Promise.all(
        pointsByPriority.map((point) =>
          requestPointIsochrone({
            point,
            contourParam: layer.contourParam,
            contourValue: layer.contourValue,
            token,
            profile: layer.profile,
            departAt: body.departAt ?? null,
          })
        )
      );

      const orderedFeatures = perPointResults
        .map((features, index) => {
          const mergedByPoint = safeUnion(features);
          if (!mergedByPoint) return null;
          return {
            ...mergedByPoint,
            properties: {
              ...(mergedByPoint.properties ?? {}),
              sourcePointId: pointsByPriority[index].id,
              sourcePriority: pointsByPriority[index].priority ?? index + 1,
              layerId: layer.layerId,
            },
          } as Feature<Polygon | MultiPolygon>;
        })
        .filter((feature): feature is Feature<Polygon | MultiPolygon> => feature !== null)
        .sort(
          (a, b) => Number(a.properties?.sourcePriority ?? 999) - Number(b.properties?.sourcePriority ?? 999)
        );

      if (!orderedFeatures.length) continue;
      const gravitationalResult = processLayerWithGravitationalUnion({
        layer,
        orderedFeatures,
        pointsByPriority,
      });
      if (!gravitationalResult?.mergedGeometry) continue;

      const merged = gravitationalResult.mergedGeometry;
      merged.properties = {
        ...(merged.properties ?? {}),
        layerId: layer.layerId,
        contourParam: layer.contourParam,
        contourValue: layer.contourValue,
        profile: layer.profile,
        priorityOrder: gravitationalResult.priorityOrder,
      };
      flattenedProcessedLayers.push(...gravitationalResult.processedLayers);
      mergedLayers.push(merged);
    }

    if (!mergedLayers.length) {
      return jsonWithCors(
        { error: "Mapbox no devolvio geometria para los puntos solicitados." },
        { status: 422 }
      );
    }

    const mode =
      contourUnit === "hibrido"
        ? "hibrido"
        : contourUnit === "calculada"
          ? "calculada"
          : layers[0]?.contourParam === "contours_minutes"
            ? "minutes"
            : "meters";
    const contourParam =
      layers.length > 1
        ? "mixed"
        : (layers[0]?.contourParam ?? "contours_minutes");
    const contourValue =
      layers.length > 1 ? layers.map((layer) => layer.contourValue) : (layers[0]?.contourValue ?? 0);

    const finalMergedGeometry = safeUnion(mergedLayers);
    if (!finalMergedGeometry) {
      return jsonWithCors(
        { error: "No se pudo consolidar la geometria final de isocronas." },
        { status: 422 }
      );
    }

    const layerSummaries = layers.map((layer) => {
      const byLayer = flattenedProcessedLayers.filter(
        (entry) =>
          entry.layerId === layer.layerId &&
          entry.contourParam === layer.contourParam &&
          entry.contourValue === layer.contourValue
      );
      const mergedByLayer = mergedLayers.find(
        (feature) =>
          String(feature.properties?.layerId) === layer.layerId &&
          String(feature.properties?.contourParam) === layer.contourParam &&
          Number(feature.properties?.contourValue) === layer.contourValue
      );
      return {
        layerId: layer.layerId,
        contourParam: layer.contourParam,
        contourValue: layer.contourValue,
        profile: layer.profile,
        processedPoints: byLayer.length,
        totalCoverageKm2: featureAreaKm2(mergedByLayer ?? null),
      };
    });

    const responseFeature: Feature<Polygon | MultiPolygon, GravitationalIsochroneProperties> = {
      ...finalMergedGeometry,
      properties: {
        priorityOrder: pointsByPriority.map((point) => point.id),
        processedLayers: flattenedProcessedLayers,
        layerSummaries,
        totalCoverageKm2: featureAreaKm2(finalMergedGeometry),
        algorithm: "gravitational_union_hierarchical" as const,
        version: "1.0" as const,
        contourParam,
        contourValue,
        trafficProfile,
        contourUnit,
        mode,
      },
    };

    const response: MultiIsochroneResponse = {
      type: "FeatureCollection",
      features: [responseFeature],
      meta: {
        mode,
        contourParam,
        contourValue,
        trafficProfile,
        contourUnit,
        requestedPoints: points.length,
        processedPoints: pointsByPriority.length,
        priorityOrder: pointsByPriority.map((point) => point.id),
        layers: layers.map((layer) => ({
          layerId: layer.layerId,
          contourParam: layer.contourParam,
          contourValue: layer.contourValue,
          profile: layer.profile,
        })),
      },
    };

    return jsonWithCors(response, { status: 200 });
  } catch (error) {
    return withCors(handleApiError(error));
  }
}
