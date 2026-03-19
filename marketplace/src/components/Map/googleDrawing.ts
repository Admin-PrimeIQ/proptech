/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DrawShape } from "./mapEngine.types";

type GoogleDrawingControllerParams = {
  map: any;
  onOverlayComplete: (shape: DrawShape, overlay: any) => void;
};

const DRAWING_MODE_TO_OVERLAY: Record<DrawShape, string> = {
  polygon: "polygon",
  circle: "circle",
  polyline: "polyline",
};

function getGoogleMapsGlobal(): any | null {
  const maybeWindow = window as unknown as { google?: unknown };
  const maybeGoogle = maybeWindow.google as { maps?: unknown } | undefined;
  return maybeGoogle?.maps ? maybeWindow.google : null;
}

export function initializeGoogleDrawingController({
  map,
  onOverlayComplete,
}: GoogleDrawingControllerParams): { manager: any; listeners: any[] } {
  const g = getGoogleMapsGlobal();
  if (!g?.maps?.drawing?.DrawingManager) {
    throw new Error("DrawingManager no disponible en Google Maps.");
  }

  const manager = new g.maps.drawing.DrawingManager({
    drawingControl: false,
    drawingMode: null,
    circleOptions: {
      strokeColor: "#5758D6",
      strokeWeight: 2,
      fillColor: "#5758D6",
      fillOpacity: 0.12,
      editable: true,
      clickable: true,
    },
    polygonOptions: {
      strokeColor: "#5758D6",
      strokeWeight: 2,
      fillColor: "#5758D6",
      fillOpacity: 0.12,
      editable: true,
      clickable: true,
    },
    polylineOptions: {
      strokeColor: "#5758D6",
      strokeWeight: 2,
      editable: true,
      clickable: true,
    },
  });

  manager.setMap(map);

  const listeners = [
    manager.addListener("overlaycomplete", (event: { type: DrawShape; overlay: any }) => {
      const normalizedShape = event.type;
      onOverlayComplete(normalizedShape, event.overlay);
    }),
  ];

  return { manager, listeners };
}

export function applyGoogleDrawingMode(manager: any, enabled: boolean, mode: DrawShape): void {
  const g = getGoogleMapsGlobal();
  if (!g?.maps?.drawing) return;
  if (!enabled) {
    manager.setDrawingMode(null);
    return;
  }

  const nextMode = DRAWING_MODE_TO_OVERLAY[mode];
  const overlayType = g.maps.drawing.OverlayType[nextMode.toUpperCase()];
  manager.setDrawingMode(overlayType ?? null);
}

export function clearGoogleDrawing(overlays: any[]): void {
  overlays.forEach((overlay) => overlay?.setMap?.(null));
  overlays.length = 0;
}
