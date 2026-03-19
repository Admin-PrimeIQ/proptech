/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { applyGoogleDrawingMode, clearGoogleDrawing, initializeGoogleDrawingController } from "./googleDrawing";
import { emitDrawingGeoJson } from "./googleGeoJson";
import { applyMarkers, clearMarkers } from "./googleMarkers";
import { applyGeoJsonOverlay, clearGeoJsonOverlay, fitMapToGeoJson } from "./googleOverlays";
import { createGoogleMap, destroyGoogleMap, ensureGoogleMapsScriptLoaded } from "./googleMapSetup";
import type { DrawShape, MapComponentProps } from "./mapEngine.types";

const DEFAULT_CENTER: [number, number] = [14.602416, -90.517302];
const DEFAULT_BOUNDS: [[number, number], [number, number]] = [
  [18.44834670293207, -88.04443359375001],
  [10.692996347925087, -92.98828125],
];

type MapStyleKey = "roadmap" | "satellite" | "terrain" | "hybrid";
const MAP_STYLE_PRESETS: Array<{ key: MapStyleKey; label: string }> = [
  { key: "roadmap", label: "Mapa Base" },
  { key: "satellite", label: "Vista satelital" },
  { key: "terrain", label: "Vista vegetacion y sistema montañoso" },
  { key: "hybrid", label: "Vista de vias vehiculares" },
];

export default function GoogleMapAdapter({
  className,
  center = DEFAULT_CENTER,
  zoom = 13,
  minZoom = 7,
  maxZoom = 16,
  maxBounds = DEFAULT_BOUNDS,
  zoomControl = true,
  drawEnabled = false,
  drawShape = "polygon",
  createRequestId = 0,
  clearRequestId = 0,
  onGeoJsonCreate,
  emitGeoJsonOnDrawChange = false,
  sidebarContent,
  sidebarEnabled = false,
  sidebarPosition = "right",
  sidebarDefaultVisible = true,
  overlayGeoJson = null,
  markersGeoJson = null,
  fitGeoJson = null,
  overlayFitBounds = true,
  overlayRenderer = "geojson",
  choroplethOptions,
  easyButtonEnabled = false,
  onDrawControlChange,
  markerMenuContent,
  barsMenuContent,
  forceMarkersVisible = false,
  overlayPopupEnabled = true,
}: MapComponentProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any | null>(null);
  const drawingManagerRef = useRef<any | null>(null);
  const drawingListenersRef = useRef<any[]>([]);
  const mapListenersRef = useRef<any[]>([]);
  const drawingOverlaysRef = useRef<Array<{ shape: DrawShape; overlay: any }>>([]);
  const overlayFeaturesRef = useRef<any[]>([]);
  const overlayListenerRef = useRef<any | null>(null);
  const overlayInfoWindowRef = useRef<any | null>(null);
  const markerInfoWindowRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const markerListenersRef = useRef<any[]>([]);
  const markerClustererRef = useRef<any | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(sidebarDefaultVisible);
  const [markerMenuVisible, setMarkerMenuVisible] = useState(false);
  const [barsMenuVisible, setBarsMenuVisible] = useState(false);
  const [mapStyleMenuVisible, setMapStyleMenuVisible] = useState(false);
  const [activeMapStyle, setActiveMapStyle] = useState<MapStyleKey>("roadmap");

  const markerSource = useMemo(() => markersGeoJson, [markersGeoJson]);

  const emitCurrentDrawingGeoJson = () => {
    if (!onGeoJsonCreate) return;
    const collection = emitDrawingGeoJson(drawingOverlaysRef.current);
    onGeoJsonCreate(collection);
  };

  const refreshMarkers = () => {
    if (!mapRef.current) return;
    clearMarkers({
      markers: markersRef.current,
      markerListeners: markerListenersRef.current,
      clusterer: markerClustererRef,
      infoWindowRef: markerInfoWindowRef,
    });
    if (!markerSource) return;
    applyMarkers({
      map: mapRef.current,
      markersGeoJson: markerSource,
      markers: markersRef.current,
      markerListeners: markerListenersRef.current,
      clusterer: markerClustererRef,
      forceMarkersVisible,
      infoWindowRef: markerInfoWindowRef,
    });
  };

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        await ensureGoogleMapsScriptLoaded();
        if (!active || !canvasRef.current || mapRef.current) return;

        const map = createGoogleMap({
          container: canvasRef.current,
          center,
          zoom,
          minZoom,
          maxZoom,
          maxBounds,
          zoomControl,
        });
        mapRef.current = map;

        const { manager, listeners } = initializeGoogleDrawingController({
          map,
          onOverlayComplete: (shape, overlay) => {
            drawingOverlaysRef.current.push({ shape, overlay });
            if (emitGeoJsonOnDrawChange) emitCurrentDrawingGeoJson();

            if (shape === "polygon" || shape === "polyline") {
              const path = overlay.getPath?.();
              if (path) {
                drawingListenersRef.current.push(
                  path.addListener("set_at", () => emitGeoJsonOnDrawChange && emitCurrentDrawingGeoJson()),
                  path.addListener("insert_at", () => emitGeoJsonOnDrawChange && emitCurrentDrawingGeoJson()),
                  path.addListener("remove_at", () => emitGeoJsonOnDrawChange && emitCurrentDrawingGeoJson())
                );
              }
            }
            if (shape === "circle") {
              drawingListenersRef.current.push(
                overlay.addListener("radius_changed", () => emitGeoJsonOnDrawChange && emitCurrentDrawingGeoJson()),
                overlay.addListener("center_changed", () => emitGeoJsonOnDrawChange && emitCurrentDrawingGeoJson())
              );
            }
          },
        });
        drawingManagerRef.current = manager;
        drawingListenersRef.current.push(...listeners);

        map.setMapTypeId(activeMapStyle);
        mapListenersRef.current.push(
          map.addListener("click", () => {
            setMarkerMenuVisible(false);
            setBarsMenuVisible(false);
            setMapStyleMenuVisible(false);
          })
        );

        setLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };
    init();

    return () => {
      active = false;
      const drawingOverlays = drawingOverlaysRef.current;
      const drawingListeners = drawingListenersRef.current;
      const overlayFeatures = overlayFeaturesRef.current;
      const markers = markersRef.current;
      const markerListeners = markerListenersRef.current;
      const overlayInfoWindow = overlayInfoWindowRef.current;
      const map = mapRef.current;
      const mapListeners = mapListenersRef.current;

      clearGoogleDrawing(drawingOverlays.map((item) => item.overlay));
      drawingListeners.forEach((listener) => listener?.remove?.());
      drawingListenersRef.current = [];
      clearGeoJsonOverlay(map, overlayFeatures);
      clearMarkers({
        markers,
        markerListeners,
        clusterer: markerClustererRef,
        infoWindowRef: markerInfoWindowRef,
      });
      if (overlayListenerRef.current?.remove) {
        overlayListenerRef.current.remove();
        overlayListenerRef.current = null;
      }
      overlayInfoWindow?.close?.();
      destroyGoogleMap(map, mapListeners);
      mapListenersRef.current = [];
      drawingManagerRef.current?.setMap?.(null);
      drawingManagerRef.current = null;
      mapRef.current = null;
    };
  }, [center, maxBounds, maxZoom, minZoom, zoom, zoomControl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loaded || !drawingManagerRef.current) return;
    applyGoogleDrawingMode(drawingManagerRef.current, drawEnabled, drawShape);
  }, [loaded, drawEnabled, drawShape]);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    mapRef.current.setMapTypeId(activeMapStyle);
  }, [loaded, activeMapStyle]);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    clearGeoJsonOverlay(mapRef.current, overlayFeaturesRef.current);
    overlayFeaturesRef.current = applyGeoJsonOverlay({
      map: mapRef.current,
      geoJson: overlayGeoJson,
      renderer: overlayRenderer,
      choroplethOptions,
      popupEnabled: !drawEnabled && overlayPopupEnabled,
      infoWindowRef: overlayInfoWindowRef,
      listenerRef: overlayListenerRef,
    });
    if (overlayFitBounds && !fitGeoJson && overlayGeoJson) {
      fitMapToGeoJson(mapRef.current, overlayGeoJson);
    }
  }, [loaded, overlayGeoJson, overlayRenderer, choroplethOptions, drawEnabled, overlayPopupEnabled, overlayFitBounds, fitGeoJson]);

  useEffect(() => {
    if (!loaded || !mapRef.current || !overlayFitBounds || !fitGeoJson) return;
    fitMapToGeoJson(mapRef.current, fitGeoJson);
  }, [loaded, overlayFitBounds, fitGeoJson]);

  useEffect(() => {
    if (!loaded) return;
    refreshMarkers();
  }, [loaded, markerSource, forceMarkersVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loaded || createRequestId <= 0 || !onGeoJsonCreate) return;
    const payload = emitDrawingGeoJson(drawingOverlaysRef.current);
    if (!payload) {
      onGeoJsonCreate(null, "No hay figuras para exportar.");
      return;
    }
    onGeoJsonCreate(payload);
  }, [loaded, createRequestId, onGeoJsonCreate]);

  useEffect(() => {
    if (!loaded || clearRequestId <= 0) return;
    clearGoogleDrawing(drawingOverlaysRef.current.map((item) => item.overlay));
    drawingOverlaysRef.current = [];
    onGeoJsonCreate?.(null);
  }, [loaded, clearRequestId, onGeoJsonCreate]);

  const handleToolbarShape = (shape: DrawShape) => {
    onDrawControlChange?.(shape, true);
  };

  const handleClearDrawing = () => {
    clearGoogleDrawing(drawingOverlaysRef.current.map((item) => item.overlay));
    drawingOverlaysRef.current = [];
    onDrawControlChange?.(drawShape, false);
    onGeoJsonCreate?.(null);
  };

  const sidebarPanel = sidebarEnabled ? (
    <div className={`map-sidebar ${sidebarPosition} ${sidebarOpen ? "visible" : "collapsed"}`}>
      {sidebarContent}
    </div>
  ) : null;

  return (
    <div ref={wrapperRef} className={`${className ?? ""} map-root`}>
      <div ref={canvasRef} className="map-canvas" />

      {easyButtonEnabled ? (
        <div className="map-toolbar">
          <button type="button" onClick={() => handleToolbarShape("polygon")} aria-label="Dibujar poligono">
            <i className="fa-solid fa-draw-polygon" />
          </button>
          <button type="button" onClick={() => handleToolbarShape("circle")} aria-label="Dibujar circulo">
            <i className="fa-regular fa-circle" />
          </button>
          <button type="button" onClick={handleClearDrawing} aria-label="Limpiar dibujo">
            <i className="fa-solid fa-trash" />
          </button>
          <button type="button" onClick={() => setMarkerMenuVisible((value) => !value)} aria-label="Mostrar marcadores">
            <i className="fa-light fa-map-location-dot" />
          </button>
          <button type="button" onClick={() => setBarsMenuVisible((value) => !value)} aria-label="Mostrar subzonas">
            <i className="fa-solid fa-bars" />
          </button>
          <button type="button" onClick={() => setMapStyleMenuVisible((value) => !value)} aria-label="Estilos de mapa">
            <i className="fa-regular fa-map" />
          </button>
        </div>
      ) : null}

      {markerMenuVisible && markerMenuContent ? (
        <div className="marker-submenu" role="dialog" aria-label="Submenu de marcadores">
          {markerMenuContent}
        </div>
      ) : null}

      {barsMenuVisible && barsMenuContent ? (
        <div className="bars-submenu" role="dialog" aria-label="Submenu de subzonas">
          {barsMenuContent}
        </div>
      ) : null}

      {mapStyleMenuVisible ? (
        <div className="mapstyle-submenu" role="dialog" aria-label="Submenu de estilos de mapa">
          <h5>Estilos de mapa</h5>
          {MAP_STYLE_PRESETS.map((style) => (
            <button
              key={style.key}
              type="button"
              onClick={() => {
                setActiveMapStyle(style.key);
                setMapStyleMenuVisible(false);
              }}
            >
              {style.label}
            </button>
          ))}
        </div>
      ) : null}

      {sidebarEnabled ? (
        <>
          <button
            type="button"
            className={`sidebar-toggle ${sidebarOpen ? "is-visible" : "is-collapsed"}`}
            aria-label={sidebarOpen ? "Ocultar panel lateral" : "Mostrar panel lateral"}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? ">" : "<"}
          </button>
          {sidebarPanel}
        </>
      ) : null}

    </div>
  );
}
