import type { ReactNode } from "react";

export type DrawShape = "polygon" | "circle" | "polyline";
export type SidebarPosition = "left" | "right";
export type MapEngine = "google";
export type OverlayRenderer = "geojson" | "choropleth";

export type GeoJsonResult = object | null;
export type GeoJsonCallback = (payload: GeoJsonResult, error?: string) => void;

export type ChoroplethOptions = {
  valueProperty?: string;
  scale?: [string, string] | string[];
  steps?: number;
  mode?: "q" | "e" | "k";
  style?: {
    color?: string;
    weight?: number;
    fillOpacity?: number;
  };
};

export type MapComponentProps = {
  className?: string;
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  maxBounds?: [[number, number], [number, number]];
  zoomControl?: boolean;
  attributionControl?: boolean;
  drawEnabled?: boolean;
  drawShape?: DrawShape;
  createRequestId?: number;
  clearRequestId?: number;
  onGeoJsonCreate?: GeoJsonCallback;
  emitGeoJsonOnDrawChange?: boolean;
  sidebarContent?: ReactNode;
  sidebarEnabled?: boolean;
  sidebarPosition?: SidebarPosition;
  sidebarDefaultVisible?: boolean;
  overlayGeoJson?: object | null;
  markersGeoJson?: object | null;
  fitGeoJson?: object | null;
  overlayFitBounds?: boolean;
  overlayRenderer?: OverlayRenderer;
  choroplethOptions?: ChoroplethOptions;
  easyButtonEnabled?: boolean;
  easyButtonPosition?: "topleft" | "topright" | "bottomleft" | "bottomright";
  onDrawControlChange?: (shape: DrawShape, enabled: boolean) => void;
  markerMenuContent?: ReactNode;
  barsMenuContent?: ReactNode;
  forceMarkersVisible?: boolean;
  overlayPopupEnabled?: boolean;
  engine?: MapEngine;
};
