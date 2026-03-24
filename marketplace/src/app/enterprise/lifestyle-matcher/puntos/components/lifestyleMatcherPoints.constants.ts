import { DEFAULT_MARKER_CATEGORIES, type MarkerCategoryVisibilityState } from "@/lib/mapBaseStyles";
import type { AdditionalMarkerVisibilityState, HousingMarkerGroup } from "./lifestyleMatcherPoints.types";

export const DEFAULT_ZONA_FALLBACK_CANDIDATES = ["Zona 10", "Z10", "10", "zona 10", "z10"];
export const SIDEBAR_PAGE_SIZE = 4;
export const COMMERCIAL_MARKER_MIN_ZOOM = 14;
export const HOUSING_CATEGORY_ICON_MAP = {
  vertical: "/assets/img/svg/apartment-svgrepo-com.svg",
  horizontal: "/assets/img/svg/house-svgrepo-com.svg",
  terreno: "/assets/img/svg/agriculture-farm-field-svgrepo-com.svg",
} as const;

export const HOUSING_MARKER_GROUPS: Array<{ key: HousingMarkerGroup; label: string }> = [
  { key: "vertical", label: "Vivienda vertical" },
  { key: "horizontal", label: "Vivienda horizontal" },
  { key: "terrenos", label: "Terrenos" },
];

export const HIDDEN_MARKER_CATEGORY_STATE: MarkerCategoryVisibilityState = DEFAULT_MARKER_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.key] = false;
    return acc;
  },
  {} as MarkerCategoryVisibilityState
);

export const DEFAULT_ADDITIONAL_MARKER_VISIBILITY_STATE: AdditionalMarkerVisibilityState = {
  points: true,
  isochrones: true,
  subzonas: true,
  comercios: true,
};

/** Centro de referencia (Ciudad de Guatemala, Zona 1) para sugerencias cuando aún no hay puntos fijados. */
export const ZONA_1_REFERENCE_CENTER = { lat: 14.6349, lng: -90.5069 } as const;

export const PRIORITY_PLACE_SUGGESTION_RADIUS_METERS = 2500;
