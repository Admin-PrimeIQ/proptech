import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { POST as IsochronesPOST } from "@/app/api/enterprise/lifestyle-matcher/isochrones/route";

const CONCURRENT_USERS = 500;
const MOCK_FETCH_DELAY_MS = 15;
const LOAD_LEVELS = [100, 250, 500, 750];

type MetricSummary = {
  totalRequests: number;
  succeeded: number;
  failed: number;
  errorRatePct: number;
  minMs: number;
  p50Ms: number;
  p95Ms: number;
  maxMs: number;
  totalDurationMs: number;
  throughputReqPerSec: number;
};

function buildMapboxPolygon(centerLng: number, centerLat: number) {
  return {
    type: "Feature",
    properties: { contour: 15 },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [centerLng - 0.01, centerLat - 0.01],
          [centerLng + 0.01, centerLat - 0.01],
          [centerLng + 0.01, centerLat + 0.01],
          [centerLng - 0.01, centerLat + 0.01],
          [centerLng - 0.01, centerLat - 0.01],
        ],
      ],
    },
  };
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function percentile(values: number[], ratio: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * ratio) - 1));
  return sorted[index];
}

function buildSummary(latencies: number[], succeeded: number, totalDurationMs: number): MetricSummary {
  const totalRequests = latencies.length;
  const failed = totalRequests - succeeded;
  const errorRatePct = totalRequests ? Number(((failed / totalRequests) * 100).toFixed(2)) : 0;
  const minMs = totalRequests ? Math.min(...latencies) : 0;
  const maxMs = totalRequests ? Math.max(...latencies) : 0;
  const p50Ms = percentile(latencies, 0.5);
  const p95Ms = percentile(latencies, 0.95);
  const throughputReqPerSec = totalDurationMs > 0 ? Number(((totalRequests * 1000) / totalDurationMs).toFixed(2)) : 0;

  return {
    totalRequests,
    succeeded,
    failed,
    errorRatePct,
    minMs,
    p50Ms,
    p95Ms,
    maxMs,
    totalDurationMs,
    throughputReqPerSec,
  };
}

async function runConcurrentIsochrones(params: {
  users: number;
  pointsPerRequest: number;
}): Promise<{ summary: MetricSummary; fetchCalls: number }> {
  const { users, pointsPerRequest } = params;

  const fetchMock = vi.fn(async (input: URL | RequestInfo) => {
    await wait(MOCK_FETCH_DELAY_MS);
    const url = String(input);
    const match = url.match(/\/(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)/);
    const lng = match ? Number(match[1]) : -90.52;
    const lat = match ? Number(match[3]) : 14.62;
    return new Response(
      JSON.stringify({
        type: "FeatureCollection",
        features: [buildMapboxPolygon(lng, lat)],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  });
  vi.stubGlobal("fetch", fetchMock);

  const startedAt = Date.now();
  const requests = Array.from({ length: users }, (_, index) => {
    const points = Array.from({ length: pointsPerRequest }, (_, pointIndex) => ({
      id: `u${index + 1}-p${pointIndex + 1}`,
      lat: 14.62 + ((index + pointIndex) % 25) * 0.0001,
      lng: -90.52 - ((index + pointIndex) % 20) * 0.0001,
      priority: pointIndex + 1,
    }));

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points,
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });
    return { index, request };
  });

  const results = await Promise.all(
    requests.map(async ({ request, index }) => {
      const reqStartedAt = Date.now();
      const response = await IsochronesPOST(request as any);
      const latencyMs = Date.now() - reqStartedAt;
      const body = await response.json();
      return { index, response, body, latencyMs };
    })
  );
  const totalDurationMs = Date.now() - startedAt;
  const latencies = results.map((result) => result.latencyMs);
  const succeeded = results.filter((result) => result.response.status === 200).length;
  const summary = buildSummary(latencies, succeeded, totalDurationMs);

  results.forEach((result) => {
    expect(result.response.status, `Request ${result.index + 1} debe responder 200`).toBe(200);
    expect(result.body?.type).toBe("FeatureCollection");
    expect(Array.isArray(result.body?.features)).toBe(true);
    expect(result.body?.features?.length).toBeGreaterThan(0);
    expect(result.body?.meta?.processedPoints).toBe(pointsPerRequest);
  });

  expect(summary.totalRequests).toBe(users);
  expect(summary.failed).toBe(0);
  expect(summary.errorRatePct).toBe(0);
  const maxAcceptedP95 = pointsPerRequest > 1 ? 5000 : 3500;
  expect(summary.p95Ms).toBeLessThan(maxAcceptedP95);
  expect(fetchMock).toHaveBeenCalledTimes(users * pointsPerRequest);

  return { summary, fetchCalls: fetchMock.mock.calls.length };
}

describe("Stress API isocronas", () => {
  beforeEach(() => {
    process.env.MAPBOX_ACCESS_TOKEN = "stress-mapbox-token";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.MAPBOX_ACCESS_TOKEN;
  });

  it(`${CONCURRENT_USERS} usuarios en paralelo generan isocronas sin errores`, async () => {
    const { summary } = await runConcurrentIsochrones({
      users: CONCURRENT_USERS,
      pointsPerRequest: 1,
    });
    console.info("[stress][isochrones]", summary);
  }, 60_000);

  it("escala carga por niveles (100, 250, 500, 750) sin errores", async () => {
    const levelSummaries: Array<{ users: number; summary: MetricSummary }> = [];

    for (const users of LOAD_LEVELS) {
      const { summary } = await runConcurrentIsochrones({
        users,
        pointsPerRequest: 1,
      });
      levelSummaries.push({ users, summary });
    }

    expect(levelSummaries).toHaveLength(LOAD_LEVELS.length);
    expect(levelSummaries.every((item) => item.summary.failed === 0)).toBe(true);

    console.info("[stress][levels]", levelSummaries);
  }, 120_000);

  it("multipunto (3 puntos por request) mantiene estabilidad en paralelo", async () => {
    const { summary, fetchCalls } = await runConcurrentIsochrones({
      users: 250,
      pointsPerRequest: 3,
    });

    expect(fetchCalls).toBe(750);
    console.info("[stress][multipoint]", {
      users: 250,
      pointsPerRequest: 3,
      fetchCalls,
      summary,
    });
  }, 120_000);
});
