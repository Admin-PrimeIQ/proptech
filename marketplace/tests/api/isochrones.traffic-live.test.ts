import { describe, it, expect, beforeAll } from "vitest";
import type { Feature, MultiPolygon, Polygon } from "geojson";
import { POST as IsochronesPOST } from "@/app/api/enterprise/lifestyle-matcher/isochrones/route";

const RUN_LIVE = process.env.RUN_MAPBOX_LIVE_TESTS === "1";
const TOKEN = process.env.MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Punto de referencia (Guatemala City). Ajustalo si quieres probar otra zona.
const DEFAULT_POINT = { id: "gt-main", lat: 14.6349, lng: -90.5069, priority: 1 };
const TEST_MINUTES = 20;
const DEFAULT_DIFF_THRESHOLD = Number(process.env.TRAFFIC_DIFF_THRESHOLD ?? "0.90");

type IsoResponse = {
  type: string;
  features: Array<Feature<Polygon | MultiPolygon>>;
  meta?: { mode?: string };
};

function extractTimeLayerAreaKm2(payload: IsoResponse): number {
  const rootFeature = payload.features?.[0];
  const rawLayerSummaries = (rootFeature?.properties as Record<string, unknown> | undefined)?.layerSummaries;
  const layerSummaries = Array.isArray(rawLayerSummaries)
    ? rawLayerSummaries as Array<Record<string, unknown>>
    : [];
  const timeLayer = layerSummaries.find((entry) => {
    const layerId = String(entry?.layerId ?? "");
    const contourParam = String(entry?.contourParam ?? "");
    return layerId === "time" && contourParam === "contours_minutes";
  });
  if (!timeLayer) {
    throw new Error("No se encontro el resumen de la capa de tiempo (contours_minutes).");
  }
  return Number(timeLayer.totalCoverageKm2 ?? 0);
}

async function callIsochrone(params: {
  departAt?: string;
  trafficEnabled: boolean;
  trafficProfile: "con-trafico" | "sin-trafico";
}): Promise<{ payload: IsoResponse; elapsedMs: number }> {
  const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      points: [DEFAULT_POINT],
      timeMinutes: TEST_MINUTES,
      speedKmh: 40,
      contourUnit: "hibrido",
      contoursMinutes: [TEST_MINUTES],
      contoursMeters: [10000],
      trafficEnabled: params.trafficEnabled,
      trafficProfile: params.trafficProfile,
      departAt: params.departAt,
    }),
  });

  const startedAt = Date.now();
  const response = await IsochronesPOST(request as any);
  const elapsedMs = Date.now() - startedAt;
  const payload = (await response.json()) as IsoResponse;

  if (response.status !== 200) {
    throw new Error(`API devolvio ${response.status}: ${JSON.stringify(payload)}`);
  }

  return { payload, elapsedMs };
}

describe("Live traffic windows (Mapbox driving-traffic vs driving)", () => {
  beforeAll(() => {
    if (!RUN_LIVE) return;
    if (!TOKEN) {
      throw new Error(
        "Falta MAPBOX_ACCESS_TOKEN. Define el token antes de ejecutar pruebas live."
      );
    }
    process.env.MAPBOX_ACCESS_TOKEN = TOKEN;
  });

  const maybeIt = RUN_LIVE ? it : it.skip;

  maybeIt("Lunes 6:30am: isocrono con trafico debe ser menor que sin trafico", async () => {
    const departAt = "2026-03-23T06:30:00-06:00"; // Lunes

    const [withTraffic, withoutTraffic] = await Promise.all([
      callIsochrone({
        departAt,
        trafficEnabled: true,
        trafficProfile: "con-trafico",
      }),
      callIsochrone({
        trafficEnabled: false,
        trafficProfile: "sin-trafico",
      }),
    ]);

    const trafficAreaKm2 = extractTimeLayerAreaKm2(withTraffic.payload);
    const noTrafficAreaKm2 = extractTimeLayerAreaKm2(withoutTraffic.payload);
    const ratio = noTrafficAreaKm2 > 0 ? trafficAreaKm2 / noTrafficAreaKm2 : 1;

    console.info("[live-traffic][morning]", {
      departAt,
      trafficAreaKm2,
      noTrafficAreaKm2,
      ratio,
      threshold: DEFAULT_DIFF_THRESHOLD,
      trafficLatencyMs: withTraffic.elapsedMs,
      noTrafficLatencyMs: withoutTraffic.elapsedMs,
    });

    expect(noTrafficAreaKm2).toBeGreaterThan(0);
    expect(trafficAreaKm2).toBeGreaterThan(0);
    expect(ratio).toBeLessThan(DEFAULT_DIFF_THRESHOLD);
  }, 90_000);

  maybeIt("Lunes 5:30pm: isocrono con trafico debe ser menor que sin trafico", async () => {
    const departAt = "2026-03-23T17:30:00-06:00"; // Lunes

    const [withTraffic, withoutTraffic] = await Promise.all([
      callIsochrone({
        departAt,
        trafficEnabled: true,
        trafficProfile: "con-trafico",
      }),
      callIsochrone({
        trafficEnabled: false,
        trafficProfile: "sin-trafico",
      }),
    ]);

    const trafficAreaKm2 = extractTimeLayerAreaKm2(withTraffic.payload);
    const noTrafficAreaKm2 = extractTimeLayerAreaKm2(withoutTraffic.payload);
    const ratio = noTrafficAreaKm2 > 0 ? trafficAreaKm2 / noTrafficAreaKm2 : 1;

    console.info("[live-traffic][evening]", {
      departAt,
      trafficAreaKm2,
      noTrafficAreaKm2,
      ratio,
      threshold: DEFAULT_DIFF_THRESHOLD,
      trafficLatencyMs: withTraffic.elapsedMs,
      noTrafficLatencyMs: withoutTraffic.elapsedMs,
    });

    expect(noTrafficAreaKm2).toBeGreaterThan(0);
    expect(trafficAreaKm2).toBeGreaterThan(0);
    expect(ratio).toBeLessThan(DEFAULT_DIFF_THRESHOLD);
  }, 90_000);
});
