import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

export type IsochronePointInput = {
  id: string;
  lat: number;
  lng: number;
  priority?: number;
};

export type IsoTrafficProfile = "sin-trafico" | "con-trafico";
export type IsoContourUnit = "meters" | "hibrido" | "calculada";
export type IsoStyleOption = "basica" | "segunda-opcion" | "tercera-opcion";

export type MultiIsochroneRequest = {
  points: IsochronePointInput[];
  timeMinutes: number;
  speedKmh: number;
  trafficEnabled?: boolean;
  trafficProfile?: IsoTrafficProfile;
  contourUnit?: IsoContourUnit;
  styleOption?: IsoStyleOption;
  contoursMinutes?: number[];
  contoursMeters?: number[];
  calculatedMinutes?: number[];
  calculatedTrafficMinutes?: number[];
  departAt?: string | null;
};

export type GravitationalDominanceLevel = "total" | "subordinado";

export type GravitationalProcessedLayer = {
  sourcePointId: string;
  priority: number;
  layerId: "time" | "distance" | "calculated";
  contourParam: "contours_minutes" | "contours_meters";
  contourValue: number;
  profile: "driving" | "driving-traffic";
  originalAreaKm2: number;
  effectiveAreaKm2: number;
  areaRetention: number;
  dominanceLevel: GravitationalDominanceLevel;
  overlapShrinkMeters?: number;
};

export type GravitationalLayerSummary = {
  layerId: "time" | "distance" | "calculated";
  contourParam: "contours_minutes" | "contours_meters";
  contourValue: number;
  profile: "driving" | "driving-traffic";
  processedPoints: number;
  totalCoverageKm2: number;
};

export type GravitationalIsochroneProperties = {
  priorityOrder: string[];
  processedLayers: GravitationalProcessedLayer[];
  layerSummaries: GravitationalLayerSummary[];
  totalCoverageKm2: number;
  algorithm: "gravitational_union_hierarchical";
  version: "1.0";
  contourParam: "contours_minutes" | "contours_meters" | "mixed";
  contourValue: number | number[];
  trafficProfile: IsoTrafficProfile;
  contourUnit: IsoContourUnit;
  mode: "minutes" | "meters" | "hibrido" | "calculada";
  contour?: number;
};

export type MultiIsochroneResponse = {
  type: "FeatureCollection";
  features: Array<Feature<Polygon | MultiPolygon, GravitationalIsochroneProperties>>;
  meta: {
    mode: "minutes" | "meters" | "hibrido" | "calculada";
    contourParam: "contours_minutes" | "contours_meters" | "mixed";
    contourValue: number | number[];
    trafficProfile: IsoTrafficProfile;
    contourUnit: IsoContourUnit;
    requestedPoints: number;
    processedPoints: number;
    priorityOrder: string[];
    layers: Array<{
      layerId: "time" | "distance" | "calculated";
      contourParam: "contours_minutes" | "contours_meters";
      contourValue: number;
      profile: "driving" | "driving-traffic";
    }>;
  };
};

export type MapboxIsochroneFeatureCollection = FeatureCollection<Polygon | MultiPolygon>;
