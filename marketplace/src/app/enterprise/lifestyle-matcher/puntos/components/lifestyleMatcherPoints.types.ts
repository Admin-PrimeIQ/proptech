export type GoogleLatLng = {
  lat: () => number;
  lng: () => number;
};

export type GoogleMapMouseEvent = {
  latLng?: GoogleLatLng;
};

export type GoogleLatLngBounds = {
  getSouthWest: () => GoogleLatLng;
  getNorthEast: () => GoogleLatLng;
};

export type GoogleMapsEventListener = {
  remove: () => void;
};

export type GoogleMapLike = {
  addListener: (eventName: string, handler: (event: GoogleMapMouseEvent) => void) => GoogleMapsEventListener;
  setMapTypeId: (mapTypeId: "roadmap" | "satellite" | "hybrid" | "terrain") => void;
  setOptions: (options: { styles?: unknown[]; clickableIcons?: boolean }) => void;
  getBounds?: () => GoogleLatLngBounds | null;
  getZoom?: () => number;
  data?: {
    addGeoJson: (geoJson: object) => unknown[];
    remove: (feature: unknown) => void;
    setStyle: (
      style: Record<string, unknown> | ((feature: { getProperty?: (name: string) => unknown }) => Record<string, unknown>)
    ) => void;
  };
};

export type GoogleMarkerLike = {
  setMap: (map: unknown | null) => void;
  setOpacity?: (opacity: number) => void;
};

export type GoogleMarkerConstructor = new (options: {
  map: unknown;
  position: { lat: number; lng: number };
  title?: string;
  icon?: unknown;
}) => GoogleMarkerLike;

export type GoogleInfoWindowLike = {
  setContent: (html: string) => void;
  open: (options: { map: unknown; anchor: unknown }) => void;
  close?: () => void;
};

export type GoogleInfoWindowConstructor = new () => GoogleInfoWindowLike;

export type GoogleMapsGlobal = {
  maps?: {
    Marker?: GoogleMarkerConstructor;
    InfoWindow?: GoogleInfoWindowConstructor;
    TrafficLayer?: new () => { setMap: (map: unknown | null) => void };
    Size?: new (width: number, height: number) => unknown;
    event?: {
      trigger?: (map: unknown, eventName: string) => void;
    };
  };
};

export type FeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    id?: string | number;
    geometry: unknown;
    properties?: Record<string, unknown>;
  }>;
};

export type MarkerCardItem = {
  key: string;
  nombreProyecto: string;
  departamento: string;
  municipio: string;
  desarrollador: string;
  totalM2: string;
  parqueos: string;
  estado: string;
  categoria: string;
  uso: string;
  precioPromedioM2: string;
  imagen: string | null;
};

export type HousingMarkerGroup = "vertical" | "horizontal" | "terrenos";
export type HousingPeriodQuarter = "1T" | "2T" | "3T" | "4T";
export type HousingPeriodFilterState = {
  anio: string | null;
  trimestre: HousingPeriodQuarter | null;
};
export type HousingPeriodsCatalog = {
  years: string[];
  quartersByYear: Record<string, HousingPeriodQuarter[]>;
  availableQuarters: HousingPeriodQuarter[];
};

export type AdditionalMarkerKey = "points" | "isochrones" | "subzonas" | "comercios";
export type AdditionalMarkerVisibilityState = Record<AdditionalMarkerKey, boolean>;
export type MarkersPanelView = "google" | "housing" | "additional";
