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
