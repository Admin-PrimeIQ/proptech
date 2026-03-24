import { afterEach, describe, expect, it, vi } from "vitest";
import { POST as CorrectedIsochronePOST } from "@/app/api/isochrone-corrected/route";

function buildSquareFeature() {
  return {
    type: "Feature",
    properties: { layerId: "time", contourParam: "contours_minutes", contourValue: 15 },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-90.52, 14.62],
          [-90.50, 14.62],
          [-90.50, 14.64],
          [-90.52, 14.64],
          [-90.52, 14.62],
        ],
      ],
    },
  };
}

describe("API isochrone-corrected", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.GOOGLE_DISTANCE_MATRIX_API_KEY;
  });

  it("retorna fallback cuando no hay API key", async () => {
    const request = new Request("https://example.com/api/isochrone-corrected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        center: { lat: 14.63, lng: -90.51 },
        target_time_minutes: 15,
        mapbox_geojson: { type: "FeatureCollection", features: [buildSquareFeature()] },
      }),
    });

    const response = await CorrectedIsochronePOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data?.metadata?.fallback).toBe(true);
    expect(String(data?.metadata?.reason ?? "")).toMatch(/api key/i);
    expect(Array.isArray(data?.corrected_geojson?.features)).toBe(true);
    expect(data.corrected_geojson.features.length).toBe(1);
  });

  it("corrige isocrona cuando Google retorna duraciones validas", async () => {
    process.env.GOOGLE_DISTANCE_MATRIX_API_KEY = "test-google-key";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "OK",
          rows: [
            {
              elements: [
                { status: "OK", duration_in_traffic: { value: 1800 } },
                { status: "OK", duration_in_traffic: { value: 1800 } },
                { status: "OK", duration_in_traffic: { value: 1800 } },
              ],
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/isochrone-corrected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        center: { lat: 14.63, lng: -90.51 },
        target_time_minutes: 15,
        mapbox_geojson: { type: "FeatureCollection", features: [buildSquareFeature()] },
      }),
    });

    const response = await CorrectedIsochronePOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(data?.metadata?.fallback).toBe(false);
    expect(data?.metadata?.samples_used).toBeGreaterThan(0);
    expect(typeof data?.metadata?.scale_factor).toBe("number");
    expect(data?.corrected_geojson?.features?.length).toBe(1);
  });

  it("retorna fallback cuando Google responde REQUEST_DENIED por clave restringida", async () => {
    process.env.GOOGLE_DISTANCE_MATRIX_API_KEY = "restricted-google-key";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "REQUEST_DENIED",
          error_message: "API keys with referer restrictions cannot be used with this API.",
          rows: [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("https://example.com/api/isochrone-corrected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        center: { lat: 14.63, lng: -90.51 },
        target_time_minutes: 15,
        mapbox_geojson: { type: "FeatureCollection", features: [buildSquareFeature()] },
      }),
    });

    const response = await CorrectedIsochronePOST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(data?.metadata?.fallback).toBe(true);
    expect(String(data?.metadata?.reason ?? "")).toMatch(/request_denied|denied|google|referer restrictions/i);
    expect(data?.corrected_geojson?.features?.length).toBe(1);
  });
});
