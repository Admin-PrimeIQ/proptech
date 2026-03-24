import { afterEach, describe, expect, it, vi } from "vitest";
import { correctIsochronesWithTrafficMatrix } from "@/app/enterprise/lifestyle-matcher/puntos/services/isochroneCorrection.service";
import type { MultiIsochroneResponse } from "@/types/isochrones";

function buildHybridResponse(): MultiIsochroneResponse {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-90.52, 14.62],
              [-90.51, 14.62],
              [-90.51, 14.63],
              [-90.52, 14.63],
              [-90.52, 14.62],
            ],
          ],
        },
        properties: {
          priorityOrder: ["p1"],
          processedLayers: [],
          layerSummaries: [],
          totalCoverageKm2: 1,
          algorithm: "gravitational_union_hierarchical",
          version: "1.0",
          contourParam: "contours_minutes",
          contourValue: 15,
          trafficProfile: "con-trafico",
          contourUnit: "hibrido",
          mode: "hibrido",
          layerId: "time",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-90.53, 14.61],
              [-90.50, 14.61],
              [-90.50, 14.64],
              [-90.53, 14.64],
              [-90.53, 14.61],
            ],
          ],
        },
        properties: {
          priorityOrder: ["p1"],
          processedLayers: [],
          layerSummaries: [],
          totalCoverageKm2: 2,
          algorithm: "gravitational_union_hierarchical",
          version: "1.0",
          contourParam: "contours_meters",
          contourValue: 10000,
          trafficProfile: "con-trafico",
          contourUnit: "hibrido",
          mode: "hibrido",
          layerId: "distance",
        },
      },
    ],
    meta: {
      mode: "hibrido",
      contourParam: "mixed",
      contourValue: [15, 10000],
      trafficProfile: "con-trafico",
      contourUnit: "hibrido",
      requestedPoints: 1,
      processedPoints: 1,
      priorityOrder: ["p1"],
      layers: [
        { layerId: "time", contourParam: "contours_minutes", contourValue: 15, profile: "driving-traffic" },
        { layerId: "distance", contourParam: "contours_meters", contourValue: 10000, profile: "driving" },
      ],
    },
  };
}

describe("isochroneCorrection.service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("en hibrido corrige solo capa time sin alterar capa distance", async () => {
    const source = buildHybridResponse();
    const originalTimeGeometry = source.features[0].geometry;
    const originalDistanceGeometry = source.features[1].geometry;

    const correctedTimeGeometry = {
      type: "Polygon" as const,
      coordinates: [
        [
          [-90.521, 14.621],
          [-90.509, 14.621],
          [-90.509, 14.631],
          [-90.521, 14.631],
          [-90.521, 14.621],
        ],
      ],
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            corrected_geojson: {
              type: "FeatureCollection",
              features: [{ type: "Feature", geometry: correctedTimeGeometry, properties: {} }],
            },
            metadata: { fallback: false },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await correctIsochronesWithTrafficMatrix({
      response: source,
      contourUnit: "hibrido",
      trafficProfile: "con-trafico",
      center: { lat: 14.63, lng: -90.51 },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.features[0].geometry).toEqual(correctedTimeGeometry);
    expect(result.features[0].geometry).not.toEqual(originalTimeGeometry);
    expect(result.features[1].geometry).toEqual(originalDistanceGeometry);
    expect(result.features[1].properties?.layerId).toBe("distance");
  });
});
