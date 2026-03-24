import { describe, expect, it } from "vitest";
import { centroidFromFeatureCollectionBbox } from "@/app/enterprise/lifestyle-matcher/puntos/components/lifestyleMatcherPoints.helpers";

describe("centroidFromFeatureCollectionBbox", () => {
  it("devuelve null si no hay features", () => {
    expect(centroidFromFeatureCollectionBbox({ type: "FeatureCollection", features: [] })).toBeNull();
    expect(centroidFromFeatureCollectionBbox(null)).toBeNull();
  });

  it("devuelve el centro del bbox de un polígono", () => {
    const fc = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [-90.5, 14.5],
                [-90.4, 14.5],
                [-90.4, 14.6],
                [-90.5, 14.6],
                [-90.5, 14.5],
              ],
            ],
          },
        },
      ],
    };
    const c = centroidFromFeatureCollectionBbox(fc);
    expect(c).not.toBeNull();
    expect(c!.lat).toBeCloseTo(14.55, 5);
    expect(c!.lng).toBeCloseTo(-90.45, 5);
  });
});
