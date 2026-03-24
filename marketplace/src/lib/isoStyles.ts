import type { IsoStyleOption } from "@/types/isochrones";

export type IsoPolygonStyle = {
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  fillColor: string;
  fillOpacity: number;
};

type IsoFeatureLike = {
  properties?: Record<string, unknown>;
};

const SECOND_OPTION_PALETTE = ["#dc2626", "#f97316", "#facc15", "#22c55e", "#38bdf8", "#2563eb"];
const THIRD_OPTION_PALETTE = ["#1A2B44", "#1D3D6E", "#3C3B82", "#7D3888", "#C23482"];

/** Colores del mapa en modo híbrido (tiempo vs distancia); reutilizar en la leyenda del panel. */
export const ISO_HYBRID_MAP_COLORS = {
  time: { fill: "#3b82f6", stroke: "#1d4ed8" },
  distance: { fill: "#10b981", stroke: "#047857" },
} as const;

function pickByIndex(colors: string[], index: number): string {
  if (!colors.length) return "#ef4444";
  const safeIndex = Number.isFinite(index) ? Math.max(0, Math.floor(index)) : 0;
  return colors[safeIndex % colors.length];
}

export function getIsoPolygonStyle(
  option: IsoStyleOption,
  feature?: IsoFeatureLike | null,
  index: number = 0
): IsoPolygonStyle {
  const safeIndex = Number.isFinite(index) ? Math.max(0, Math.floor(index)) : 0;

  const props = feature?.properties ?? {};
  const contourUnit = typeof props.contourUnit === "string" ? props.contourUnit : "";
  const layerId = typeof props.layerId === "string" ? props.layerId : "";

  if (contourUnit === "hibrido" && layerId === "time") {
    const c = ISO_HYBRID_MAP_COLORS.time;
    return {
      strokeColor: c.stroke,
      strokeOpacity: 0.92,
      strokeWeight: 2,
      fillColor: c.fill,
      fillOpacity: 0.22,
    };
  }

  if (contourUnit === "hibrido" && layerId === "distance") {
    const c = ISO_HYBRID_MAP_COLORS.distance;
    return {
      strokeColor: c.stroke,
      strokeOpacity: 0.92,
      strokeWeight: 2,
      fillColor: c.fill,
      fillOpacity: 0.2,
    };
  }

  if (option === "segunda-opcion") {
    const color = pickByIndex(SECOND_OPTION_PALETTE, safeIndex);
    return {
      strokeColor: color,
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.22,
    };
  }

  if (option === "tercera-opcion") {
    const color = pickByIndex(THIRD_OPTION_PALETTE, safeIndex);
    return {
      strokeColor: color,
      strokeOpacity: 0.95,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.2,
    };
  }

  return {
    strokeColor: "#ef4444",
    strokeOpacity: 0.92,
    strokeWeight: 2,
    fillColor: "#ef4444",
    fillOpacity: 0.2,
  };
}
