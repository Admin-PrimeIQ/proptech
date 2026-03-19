export type MapTypeOption = "roadmap" | "satellite" | "hybrid" | "terrain" | "vegetacion";
export type DefaultMarkerCategoryKey =
  | "all-poi"
  | "business"
  | "medical"
  | "school"
  | "government"
  | "parks"
  | "sports"
  | "worship"
  | "transit-line"
  | "transit-station";

export type MarkerCategoryVisibilityState = Record<DefaultMarkerCategoryKey, boolean>;

type MapLike = {
  setMapTypeId: (mapTypeId: "roadmap" | "satellite" | "hybrid" | "terrain") => void;
  setOptions: (options: { styles?: unknown[]; clickableIcons?: boolean }) => void;
};

export const VEGETATION_LOCAL_STYLE = [
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [{ color: "#e9eef0" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry.fill",
    stylers: [{ color: "#2d5a27" }],
  },
  {
    featureType: "landscape.natural.landcover",
    elementType: "geometry.fill",
    stylers: [{ color: "#3a6b32" }],
  },
  {
    featureType: "landscape.natural.terrain",
    elementType: "geometry.fill",
    stylers: [{ color: "#2f5f2a" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#4caf50" }, { saturation: 20 }, { lightness: -5 }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#1f3a22" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#e9eef0" }, { weight: 3 }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4a5563" }, { lightness: -5 }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#3f4955" }, { lightness: -8 }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }, { lightness: -10 }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.medical",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.school",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "on" }],
  },
];

export const DEFAULT_MARKER_CATEGORIES = [
  { key: "all-poi", label: "POI general", featureTypes: ["poi"] },
  { key: "business", label: "Comercios", featureTypes: ["poi.business"] },
  { key: "medical", label: "Hospitales y clinicas", featureTypes: ["poi.medical"] },
  { key: "school", label: "Escuelas y universidades", featureTypes: ["poi.school"] },
  { key: "government", label: "Gobierno", featureTypes: ["poi.government"] },
  { key: "parks", label: "Parques", featureTypes: ["poi.park"] },
  { key: "sports", label: "Complejos deportivos", featureTypes: ["poi.sports_complex"] },
  { key: "worship", label: "Lugares de culto", featureTypes: ["poi.place_of_worship"] },
  { key: "transit-line", label: "Lineas de transporte", featureTypes: ["transit.line"] },
  { key: "transit-station", label: "Estaciones de transporte", featureTypes: ["transit.station"] },
] as const;

export const DEFAULT_MARKER_CATEGORY_STATE: MarkerCategoryVisibilityState = {
  "all-poi": true,
  business: true,
  medical: true,
  school: true,
  government: true,
  parks: true,
  sports: true,
  worship: true,
  "transit-line": true,
  "transit-station": true,
};

function getBaseStylesByMapType(mapType: MapTypeOption): unknown[] {
  if (mapType === "vegetacion") return VEGETATION_LOCAL_STYLE;
  return [];
}

export function buildMarkerFilterStyles(markerCategoryVisibility: MarkerCategoryVisibilityState): unknown[] {
  return DEFAULT_MARKER_CATEGORIES.flatMap((category) => {
    if (category.key === "all-poi") return [];
    if (markerCategoryVisibility[category.key]) return [];
    return category.featureTypes.map((featureType) => ({
      featureType,
      stylers: [{ visibility: "off" }],
    }));
  });
}

export function applyMapBaseVisuals(
  map: MapLike,
  mapType: MapTypeOption,
  markerCategoryVisibility: MarkerCategoryVisibilityState = DEFAULT_MARKER_CATEGORY_STATE
): void {
  const baseStyles = getBaseStylesByMapType(mapType);
  const markerFilterStyles = buildMarkerFilterStyles(markerCategoryVisibility);
  const styles = [...baseStyles, ...markerFilterStyles];

  if (mapType === "vegetacion") {
    map.setMapTypeId("roadmap");
    map.setOptions({
      styles,
      clickableIcons: true,
    });
    return;
  }

  map.setMapTypeId(mapType);
  map.setOptions({
    styles,
    clickableIcons: true,
  });
}
