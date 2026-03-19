import { afterEach, describe, expect, it, vi } from "vitest";
import { createMultiIsochrone } from "@/app/enterprise/lifestyle-matcher/puntos/services/multiIsochrone.service";

describe("createMultiIsochrone service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("envía POST al endpoint correcto y devuelve payload en éxito", async () => {
    const mockResponse = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Polygon", coordinates: [[[-90.52, 14.62], [-90.51, 14.62], [-90.52, 14.62]]] },
        },
      ],
      meta: {
        mode: "minutes",
        contourParam: "contours_minutes",
        contourValue: 15,
        requestedPoints: 1,
        processedPoints: 1,
        priorityOrder: ["p1"],
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });
    vi.stubGlobal("fetch", fetchMock);

    const payload = {
      points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
      timeMinutes: 15,
      speedKmh: 40,
      trafficEnabled: true,
    };

    const result = await createMultiIsochrone(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/enterprise/lifestyle-matcher/isochrones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(result.meta.mode).toBe("minutes");
    expect(result.features.length).toBe(1);
  });

  it("envía todos los campos de UI de isócronas al backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        type: "FeatureCollection",
        features: [],
        meta: {
          mode: "hibrido",
          contourParam: "mixed",
          contourValue: [15, 10000],
          requestedPoints: 1,
          processedPoints: 1,
          priorityOrder: ["p1"],
          layers: [],
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const fullUiPayload = {
      points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
      timeMinutes: 15,
      speedKmh: 40,
      trafficEnabled: true,
      trafficProfile: "con-trafico" as const,
      contourUnit: "hibrido" as const,
      styleOption: "basica" as const,
      contoursMinutes: [15],
      contoursMeters: [10000],
      calculatedMinutes: [15, 30, 45, 60],
      calculatedTrafficMinutes: [20],
      departAt: "2026-03-18T08:30",
    };

    await createMultiIsochrone(fullUiPayload);

    const sentBody = JSON.parse(String(fetchMock.mock.calls[0][1]?.body ?? "{}"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentBody).toEqual(fullUiPayload);
  });

  it("lanza error con mensaje del backend cuando response.ok es false", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Primero debes fijar al menos un punto en el mapa." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createMultiIsochrone({
        points: [],
        timeMinutes: 15,
        speedKmh: 40,
        trafficEnabled: true,
      })
    ).rejects.toThrow("Primero debes fijar al menos un punto en el mapa.");
  });

  it("lanza mensaje genérico cuando backend no retorna error string", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createMultiIsochrone({
        points: [{ id: "p1", lat: 14.62, lng: -90.52, priority: 1 }],
        timeMinutes: 20,
        speedKmh: 35,
        trafficEnabled: false,
      })
    ).rejects.toThrow("No se pudo generar el isocrono múltiple.");
  });
});
