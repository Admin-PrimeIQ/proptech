import { describe, expect, it } from "vitest";
import { resolveSuggestionSearchCenter } from "@/app/enterprise/lifestyle-matcher/puntos/components/prioritySuggestionCenter";
import { ZONA_1_REFERENCE_CENTER } from "@/app/enterprise/lifestyle-matcher/puntos/components/lifestyleMatcherPoints.constants";

describe("resolveSuggestionSearchCenter", () => {
  const points = [
    { id: "a", title: "Primera", subtitle: "", active: false },
    { id: "b", title: "Segunda", subtitle: "", active: false },
  ];

  it("usa Zona 1 cuando no hay ninguna ubicación fijada", () => {
    const center = resolveSuggestionSearchCenter({
      selectedPoints: points,
      pointLocations: {},
    });
    expect(center).toEqual({
      lat: ZONA_1_REFERENCE_CENTER.lat,
      lng: ZONA_1_REFERENCE_CENTER.lng,
    });
  });

  it("usa la primera prioridad en orden que tenga coordenadas", () => {
    const center = resolveSuggestionSearchCenter({
      selectedPoints: points,
      pointLocations: {
        b: { lat: 14.7, lng: -90.4 },
      },
    });
    expect(center).toEqual({ lat: 14.7, lng: -90.4 });
  });

  it("si la primera tiene coordenadas, ignora las siguientes para el centro", () => {
    const center = resolveSuggestionSearchCenter({
      selectedPoints: points,
      pointLocations: {
        a: { lat: 14.6, lng: -90.5 },
        b: { lat: 14.8, lng: -90.3 },
      },
    });
    expect(center).toEqual({ lat: 14.6, lng: -90.5 });
  });

  it("respeta zona1Center personalizado cuando no hay puntos fijados", () => {
    const custom = { lat: 10, lng: -20 };
    const center = resolveSuggestionSearchCenter({
      selectedPoints: points,
      pointLocations: {},
      zona1Center: custom,
    });
    expect(center).toEqual(custom);
  });

  it("usa zonaCentroid cuando no hay prioridades fijadas", () => {
    const center = resolveSuggestionSearchCenter({
      selectedPoints: points,
      pointLocations: {},
      zonaCentroid: { lat: 14.55, lng: -90.48 },
    });
    expect(center).toEqual({ lat: 14.55, lng: -90.48 });
  });

  it("prioridad fijada gana sobre zonaCentroid", () => {
    const center = resolveSuggestionSearchCenter({
      selectedPoints: points,
      pointLocations: {
        a: { lat: 14.6, lng: -90.5 },
      },
      zonaCentroid: { lat: 14.55, lng: -90.48 },
    });
    expect(center).toEqual({ lat: 14.6, lng: -90.5 });
  });
});
