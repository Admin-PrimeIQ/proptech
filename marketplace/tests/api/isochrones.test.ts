import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  OPTIONS as IsochronesOPTIONS,
  POST as IsochronesPOST,
  __resetIsoRateLimitForTests,
} from "@/app/api/enterprise/lifestyle-matcher/isochrones/route";

type MockMapboxOptions = {
  centerLng: number;
  centerLat: number;
  size?: number;
};

function buildPolygonFeature(options: MockMapboxOptions) {
  const { centerLng, centerLat, size = 0.01 } = options;
  return {
    type: "Feature",
    properties: { contour: 15 },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [centerLng - size, centerLat - size],
          [centerLng + size, centerLat - size],
          [centerLng + size, centerLat + size],
          [centerLng - size, centerLat + size],
          [centerLng - size, centerLat - size],
        ],
      ],
    },
  };
}

describe("API isócronos múltiples", () => {
  beforeEach(() => {
    process.env.MAPBOX_ACCESS_TOKEN = "test-mapbox-token";
    delete process.env.ISO_RATE_LIMIT_ENABLED;
    delete process.env.ISO_RATE_LIMIT_WINDOW_MS;
    delete process.env.ISO_RATE_LIMIT_MAX_REQUESTS;
    __resetIsoRateLimitForTests();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.MAPBOX_ACCESS_TOKEN;
    delete process.env.ISO_RATE_LIMIT_ENABLED;
    delete process.env.ISO_RATE_LIMIT_WINDOW_MS;
    delete process.env.ISO_RATE_LIMIT_MAX_REQUESTS;
    __resetIsoRateLimitForTests();
  });

  it("devuelve 400 si no hay puntos válidos", async () => {
    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(String(data.error)).toMatch(/al menos un punto/i);
  });

  it("usa contours_minutes cuando trafficEnabled=true", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 18,
        speedKmh: 35,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestedUrl = String(fetchMock.mock.calls[0][0]);
    expect(requestedUrl).toContain("contours_minutes=18");
    expect(data.meta.mode).toBe("minutes");
    expect(data.meta.contourParam).toBe("contours_minutes");
    expect(data.features.length).toBe(1);
  });

  it("usa contours_meters con fallback D=V*T cuando trafficEnabled=false", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: false,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    // D = V * T = 40 km/h * 15 min = 10 km = 10000 m
    expect(response.status).toBe(200);
    const requestedUrl = String(fetchMock.mock.calls[0][0]);
    expect(requestedUrl).toContain("contours_meters=10000");
    expect(data.meta.mode).toBe("meters");
    expect(data.meta.contourParam).toBe("contours_meters");
    expect(data.meta.contourValue).toBe(10000);
  });

  it("fusiona múltiples puntos y respeta orden de prioridad en meta", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62, size: 0.01 })],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [buildPolygonFeature({ centerLng: -90.50, centerLat: 14.61, size: 0.01 })],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [
          { id: "p2", lat: 14.61, lng: -90.5, priority: 2 },
          { id: "p1", lat: 14.62, lng: -90.52, priority: 1 },
        ],
        timeMinutes: 10,
        speedKmh: 35,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(data.type).toBe("FeatureCollection");
    expect(data.features.length).toBe(1);
    expect(data.meta.priorityOrder).toEqual(["p1", "p2"]);
    expect(data.meta.processedPoints).toBe(2);
    expect(data.features[0]?.properties?.algorithm).toBe("gravitational_union_hierarchical");
    expect(data.features[0]?.properties?.priorityOrder).toEqual(["p1", "p2"]);
    expect(Array.isArray(data.features[0]?.properties?.processedLayers)).toBe(true);
  });

  it("hibrido + con tráfico envía driving-traffic con depart_at y devuelve meta de capas", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62, size: 0.008 })],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
        trafficProfile: "con-trafico",
        contourUnit: "hibrido",
        contoursMinutes: [15],
        contoursMeters: [10000],
        departAt: "2026-03-18T08:30",
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    const mapboxUrl1 = String(fetchMock.mock.calls[0][0]);
    const mapboxUrl2 = String(fetchMock.mock.calls[1][0]);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const hasDrivingTrafficCall = [mapboxUrl1, mapboxUrl2].some((url) => url.includes("/driving-traffic/"));
    const hasDrivingCall = [mapboxUrl1, mapboxUrl2].some((url) => url.includes("/driving/"));
    const hasDepartAtOnTraffic = [mapboxUrl1, mapboxUrl2]
      .filter((url) => url.includes("/driving-traffic/"))
      .every((url) => url.includes("depart_at="));
    const hasMetersCall = [mapboxUrl1, mapboxUrl2].some((url) => url.includes("contours_meters=10000"));
    const hasMinutesCall = [mapboxUrl1, mapboxUrl2].some((url) => url.includes("contours_minutes=15"));

    expect(hasDrivingTrafficCall).toBe(true);
    expect(hasDrivingCall).toBe(true);
    expect(hasDepartAtOnTraffic).toBe(true);
    expect(hasMetersCall).toBe(true);
    expect(hasMinutesCall).toBe(true);
    expect(Array.isArray(data?.meta?.layers)).toBe(true);
    expect(data.meta.layers.length).toBe(2);
  });

  it("sin solapamiento conserva retención 1.0 en todos los puntos", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [buildPolygonFeature({ centerLng: -90.8, centerLat: 14.2, size: 0.005 })],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [buildPolygonFeature({ centerLng: -90.2, centerLat: 14.9, size: 0.005 })],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [
          { id: "p1", lat: 14.2, lng: -90.8, priority: 1 },
          { id: "p2", lat: 14.9, lng: -90.2, priority: 2 },
        ],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: false,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();
    const processedLayers = (data.features?.[0]?.properties?.processedLayers ?? []) as Array<{
      sourcePointId: string;
      areaRetention: number;
    }>;

    expect(response.status).toBe(200);
    expect(processedLayers.length).toBe(2);
    expect(processedLayers.every((item) => item.areaRetention === 1)).toBe(true);
  });

  it("solapamiento completo prioriza el punto de mayor prioridad", async () => {
    const overlappedPolygon = buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62, size: 0.01 });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [overlappedPolygon],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [overlappedPolygon],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [
          { id: "dominante", lat: 14.62, lng: -90.52, priority: 1 },
          { id: "subordinado", lat: 14.62, lng: -90.52, priority: 2 },
        ],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: false,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();
    const processedLayers = (data.features?.[0]?.properties?.processedLayers ?? []) as Array<{
      sourcePointId: string;
      areaRetention: number;
    }>;
    const subordinado = processedLayers.find((item) => item.sourcePointId === "subordinado");

    expect(response.status).toBe(200);
    expect(processedLayers[0]?.sourcePointId).toBe("dominante");
    expect(subordinado).toBeTruthy();
    expect(Number(subordinado?.areaRetention ?? 1)).toBeLessThanOrEqual(0.2);
  });

  it("retorna 500 cuando falta token de Mapbox", async () => {
    delete process.env.MAPBOX_ACCESS_TOKEN;

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(String(data.error)).toMatch(/mapbox_access_token|falta configurar/i);
  });

  it("retorna error controlado cuando Mapbox falla con 500", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("provider-down", { status: 500 })
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(String(data.error ?? "")).not.toEqual("");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retorna 422 cuando Mapbox no devuelve geometria util", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: false,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(String(data.error)).toMatch(/no devolvio geometria/i);
  });

  it("procesa solicitud con mezcla de puntos validos e invalidos", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [
          { id: "ok", lat: 14.62, lng: -90.52, priority: 1 },
          { id: "nan", lat: "no-number", lng: -90.5, priority: 2 },
          { id: "out", lat: 99, lng: -190, priority: 3 },
        ],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: false,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.requestedPoints).toBe(1);
    expect(data.meta.processedPoints).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("limita el numero de puntos a MAX_POINTS (12)", async () => {
    const fetchMock = vi.fn().mockImplementation(async () =>
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const points = Array.from({ length: 20 }, (_, index) => ({
      id: `p${index + 1}`,
      lat: 14.6 + index * 0.0001,
      lng: -90.5 - index * 0.0001,
      priority: index + 1,
    }));

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points,
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: false,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.requestedPoints).toBe(12);
    expect(data.meta.processedPoints).toBe(12);
    expect(fetchMock).toHaveBeenCalledTimes(12);
  });

  it("no envia depart_at cuando el perfil es driving sin trafico", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 20,
        speedKmh: 35,
        trafficEnabled: false,
        trafficProfile: "sin-trafico",
        departAt: "2026-03-18T08:30",
      }),
    });

    const response = await IsochronesPOST(request as any);
    const requestedUrl = String(fetchMock.mock.calls[0][0] ?? "");

    expect(response.status).toBe(200);
    expect(requestedUrl.includes("/driving/")).toBe(true);
    expect(requestedUrl.includes("depart_at=")).toBe(false);
  });

  it("modo calculada con trafico usa calculatedTrafficMinutes", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        trafficEnabled: true,
        trafficProfile: "con-trafico",
        contourUnit: "calculada",
        calculatedTrafficMinutes: [22],
        departAt: "2026-03-18T08:30",
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();
    const requestedUrl = String(fetchMock.mock.calls[0][0] ?? "");

    expect(response.status).toBe(200);
    expect(requestedUrl).toContain("/driving-traffic/");
    expect(requestedUrl).toContain("contours_minutes=22");
    expect(data.meta.mode).toBe("calculada");
    expect(data.meta.layers).toHaveLength(1);
    expect(data.meta.layers[0]?.contourParam).toBe("contours_minutes");
  });

  it("modo calculada sin trafico calcula metros por cada minuto configurado", async () => {
    const fetchMock = vi.fn().mockImplementation(async () =>
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        speedKmh: 40,
        trafficEnabled: false,
        contourUnit: "calculada",
        calculatedMinutes: [5, 10],
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();
    const urls = fetchMock.mock.calls.map((call) => String(call[0]));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(urls.some((url) => url.includes("contours_meters=3333"))).toBe(true);
    expect(urls.some((url) => url.includes("contours_meters=6667"))).toBe(true);
    expect(data.meta.mode).toBe("calculada");
    expect(data.meta.layers).toHaveLength(2);
    expect(data.meta.layers.every((layer: { contourParam: string }) => layer.contourParam === "contours_meters")).toBe(
      true
    );
  });

  it("aplica fallback para timeMinutes/speedKmh no validos y clamp para minutos altos", async () => {
    const fetchMock = vi.fn().mockImplementation(async () =>
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const invalidFallbackReq = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 0,
        speedKmh: -10,
        trafficEnabled: false,
      }),
    });

    const clampReq = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p2", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 999,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });

    const invalidFallbackRes = await IsochronesPOST(invalidFallbackReq as any);
    const clampRes = await IsochronesPOST(clampReq as any);

    const firstUrl = String(fetchMock.mock.calls[0]?.[0] ?? "");
    const secondUrl = String(fetchMock.mock.calls[1]?.[0] ?? "");

    expect(invalidFallbackRes.status).toBe(200);
    expect(firstUrl).toContain("contours_meters=10000");
    expect(clampRes.status).toBe(200);
    expect(secondUrl).toContain("contours_minutes=60");
  });

  it("acepta decimales validos y redondea valores calculados", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 12.7,
        speedKmh: 33.3,
        trafficEnabled: false,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const requestedUrl = String(fetchMock.mock.calls[0]?.[0] ?? "");

    expect(response.status).toBe(200);
    expect(requestedUrl).toContain("contours_meters=7049");
  });

  it("sanea arrays invalidos y usa el primer valor positivo redondeado", async () => {
    const fetchMock = vi.fn().mockImplementation(async () =>
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        contourUnit: "hibrido",
        trafficEnabled: true,
        trafficProfile: "con-trafico",
        contoursMinutes: [null, -1, "abc", 20.7],
        contoursMeters: [null, -5, "foo", 12345.6],
      }),
    });

    const response = await IsochronesPOST(request as any);
    const urls = fetchMock.mock.calls.map((call) => String(call[0]));

    expect(response.status).toBe(200);
    expect(urls.some((url) => url.includes("contours_minutes=21"))).toBe(true);
    expect(urls.some((url) => url.includes("contours_meters=12346"))).toBe(true);
  });

  it("usa defaults cuando contoursMinutes y contoursMeters vienen vacios", async () => {
    const fetchMock = vi.fn().mockImplementation(async () =>
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        contourUnit: "hibrido",
        trafficEnabled: false,
        timeMinutes: 17,
        speedKmh: 30,
        contoursMinutes: [],
        contoursMeters: [],
      }),
    });

    const response = await IsochronesPOST(request as any);
    const urls = fetchMock.mock.calls.map((call) => String(call[0]));

    expect(response.status).toBe(200);
    expect(urls.some((url) => url.includes("contours_minutes=17"))).toBe(true);
    expect(urls.some((url) => url.includes("contours_meters=8500"))).toBe(true);
  });

  it("procesa coordenadas con precision alta de decimales", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52012345, centerLat: 14.62098765 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const point = { id: "precise", lat: 14.620987654321, lng: -90.520123456789, priority: 1 };
    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [point],
        trafficEnabled: false,
        timeMinutes: 15,
        speedKmh: 40,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const requestedUrl = String(fetchMock.mock.calls[0]?.[0] ?? "");

    expect(response.status).toBe(200);
    expect(requestedUrl.includes(String(point.lat))).toBe(true);
    expect(requestedUrl.includes(String(point.lng))).toBe(true);
  });

  it("mantiene orden de entrada cuando hay prioridades duplicadas", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [buildPolygonFeature({ centerLng: -90.51, centerLat: 14.61 })],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [
          { id: "pA", lat: 14.62, lng: -90.52, priority: 1 },
          { id: "pB", lat: 14.61, lng: -90.51, priority: 1 },
        ],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.priorityOrder).toEqual(["pA", "pB"]);
  });

  it("responde OPTIONS con headers CORS", async () => {
    const response = await IsochronesOPTIONS();

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
    expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain("Content-Type");
  });

  it("incluye headers CORS en respuestas POST", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
  });

  it("aplica rate limiting basico por cliente", async () => {
    process.env.ISO_RATE_LIMIT_ENABLED = "1";
    process.env.ISO_RATE_LIMIT_WINDOW_MS = "60000";
    process.env.ISO_RATE_LIMIT_MAX_REQUESTS = "2";

    const fetchMock = vi.fn().mockImplementation(async () =>
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const buildReq = () =>
      new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.10",
        },
        body: JSON.stringify({
          points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
          timeMinutes: 15,
          speedKmh: 40,
          trafficEnabled: true,
        }),
      });

    const response1 = await IsochronesPOST(buildReq() as any);
    const response2 = await IsochronesPOST(buildReq() as any);
    const response3 = await IsochronesPOST(buildReq() as any);
    const body3 = await response3.json();

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response3.status).toBe(429);
    expect(String(body3.error)).toMatch(/demasiadas solicitudes/i);
    expect(Number(response3.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retorna 400 cuando points no es arreglo", async () => {
    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: { id: "p1", lat: 14.62, lng: -90.52 },
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(String(data.error)).toMatch(/al menos un punto/i);
  });

  it("maneja body no JSON con error controlado", async () => {
    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ this-is-not-json",
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(String(data.error ?? "")).not.toEqual("");
  });

  it("no filtra tokens en errores de proveedor externo", async () => {
    const leakedToken = "pk.secret-token-demo";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(`upstream error token=${leakedToken}`, { status: 500 })
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();
    const errorMessage = String(data.error ?? "");

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(errorMessage.includes(leakedToken)).toBe(false);
  });

  it("procesa payload sobredimensionado recortando puntos a 12", async () => {
    const fetchMock = vi.fn().mockImplementation(async () =>
      new Response(
        JSON.stringify({
          type: "FeatureCollection",
          features: [buildPolygonFeature({ centerLng: -90.52, centerLat: 14.62 })],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const points = Array.from({ length: 2000 }, (_, index) => ({
      id: `oversized-${index + 1}`,
      lat: 14.5 + (index % 50) * 0.0001,
      lng: -90.6 - (index % 50) * 0.0001,
      priority: index + 1,
    }));

    const request = new Request("https://example.com/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points,
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: false,
      }),
    });

    const response = await IsochronesPOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.requestedPoints).toBe(12);
    expect(data.meta.processedPoints).toBe(12);
    expect(fetchMock).toHaveBeenCalledTimes(12);
  });
});
