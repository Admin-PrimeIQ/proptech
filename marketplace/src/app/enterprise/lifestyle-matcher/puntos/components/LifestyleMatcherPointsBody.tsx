"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./LifestyleMatcherPointsBody.module.scss";
import {
  getLifestyleMatcherPointsData,
  SelectedPoint,
  LifestyleMatcherPointsData,
} from "../services/lifestyleMatcherPoints.service";
import { createGoogleMap, destroyGoogleMap, ensureGoogleMapsScriptLoaded } from "@/components/Map/googleMapSetup";
import { fitMapToGeoJson } from "@/components/Map/googleOverlays";
import EnterpriseMobileBottomNav from "@/components/Enterprise/EnterpriseMobileBottomNav";
import SubzonaAutocomplete from "@/components/Enterprise/SubzonaAutocomplete";
import SubzonaChecklist, { type SubzonaChecklistItem } from "@/components/Enterprise/SubzonaChecklist";
import LifestyleMatcherProjectsSidebar from "./LifestyleMatcherProjectsSidebar";
import HousingPeriodFilter from "./HousingPeriodFilter";
import { createMultiIsochrone } from "../services/multiIsochrone.service";
import {
  fetchHousingMarkersByGeoJson,
  fetchHousingMarkersByZona,
} from "../services/markers/housingMarkers.service";
import {
  fetchCommercialMarkersByGeoJson,
  fetchCommercialMarkersByZona,
} from "../services/markers/commercialMarkers.service";
import type { IsoContourUnit, IsoStyleOption, IsoTrafficProfile, MultiIsochroneResponse } from "@/types/isochrones";
import { getIsoPolygonStyle } from "@/lib/isoStyles";
import {
  applyMapBaseVisuals,
  DEFAULT_MARKER_CATEGORIES,
  DEFAULT_MARKER_CATEGORY_STATE,
  MapTypeOption,
  MarkerCategoryVisibilityState,
} from "@/lib/mapBaseStyles";
import {
  COMMERCIAL_MARKER_MIN_ZOOM,
  DEFAULT_ADDITIONAL_MARKER_VISIBILITY_STATE,
  DEFAULT_ZONA_FALLBACK_CANDIDATES,
  HIDDEN_MARKER_CATEGORY_STATE,
  HOUSING_MARKER_GROUPS,
  SIDEBAR_PAGE_SIZE,
} from "./lifestyleMatcherPoints.constants";
import {
  deriveIncidentsFromProperties,
  extractFeatureCollection,
  formatInteger,
  formatPrecioPromedioM2,
  intersectMarkerCollections,
  mergeMarkerCollections,
  readFirstString,
  resolveHousingMarkerGroupFromProperties,
  resolveHousingCategoryIcon,
} from "./lifestyleMatcherPoints.helpers";
import {
  isRowInViewport,
  markerKeyOfRow,
  resolveCommercialRenderRatio,
  resolveCommercialVisibilityByHysteresis,
  sortRowsByStableIdentity,
  type MarkerViewportRow,
} from "./lifestyleMatcherPoints.rendering";
import type {
  AdditionalMarkerVisibilityState,
  FeatureCollection,
  GoogleInfoWindowLike,
  GoogleMapLike,
  GoogleMapMouseEvent,
  GoogleMapsEventListener,
  GoogleMapsGlobal,
  GoogleMarkerLike,
  HousingMarkerGroup,
  HousingPeriodFilterState,
  MarkerCardItem,
  MarkersPanelView,
} from "./lifestyleMatcherPoints.types";

export default function LifestyleMatcherPointsBody() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LifestyleMatcherPointsData | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);
  const [pointToPinId, setPointToPinId] = useState<string | null>(null);
  const [pointLocations, setPointLocations] = useState<Record<string, { lat: number; lng: number }>>({});
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isMapTypeModalOpen, setIsMapTypeModalOpen] = useState(false);
  const [isMarkersModalOpen, setIsMarkersModalOpen] = useState(false);
  const [mapType, setMapType] = useState<MapTypeOption>("roadmap");
  const [markerCategoryVisibility, setMarkerCategoryVisibility] = useState<MarkerCategoryVisibilityState>(
    DEFAULT_MARKER_CATEGORY_STATE
  );
  const [selectedHousingCategories, setSelectedHousingCategories] = useState<Set<HousingMarkerGroup>>(
    new Set(HOUSING_MARKER_GROUPS.map((item) => item.key))
  );
  const [housingPeriodFilter, setHousingPeriodFilter] = useState<HousingPeriodFilterState>({
    anio: "2025",
    trimestre: null,
  });
  const [additionalMarkerVisibility, setAdditionalMarkerVisibility] = useState<AdditionalMarkerVisibilityState>(
    DEFAULT_ADDITIONAL_MARKER_VISIBILITY_STATE
  );
  const [markersPanelView, setMarkersPanelView] = useState<MarkersPanelView>("google");
  const [isoTimeMinutes, setIsoTimeMinutes] = useState(15);
  const [isoSpeedKmh, setIsoSpeedKmh] = useState(40);
  const [isoTrafficProfile, setIsoTrafficProfile] = useState<IsoTrafficProfile>("sin-trafico");
  const [isoContourUnit, setIsoContourUnit] = useState<IsoContourUnit>("meters");
  const [isoStyleOption, setIsoStyleOption] = useState<IsoStyleOption>("basica");
  const [isoMetersPreset, setIsoMetersPreset] = useState<string>("10000");
  const [isoHybridMinutes, setIsoHybridMinutes] = useState(15);
  const [isoHybridMeters, setIsoHybridMeters] = useState(10000);
  const [isoCalculatedMinutesPreset, setIsoCalculatedMinutesPreset] = useState<string>("15");
  const [isoTrafficMinutes, setIsoTrafficMinutes] = useState(15);
  const [isoDepartAt, setIsoDepartAt] = useState("");
  const [isoRequestError, setIsoRequestError] = useState<string | null>(null);
  const [isoRequestMeta, setIsoRequestMeta] = useState<string | null>(null);
  const [isoSubmitting, setIsoSubmitting] = useState(false);
  const [isoGeoJson, setIsoGeoJson] = useState<MultiIsochroneResponse | null>(null);
  const [propertiesGeoJson, setPropertiesGeoJson] = useState<FeatureCollection | null>(null);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  const [selectedZonaPrimaria, setSelectedZonaPrimaria] = useState<string | null>(null);
  const [subzonas, setSubzonas] = useState<SubzonaChecklistItem[]>([]);
  const [subzonasSeleccionadas, setSubzonasSeleccionadas] = useState<Set<string>>(new Set());
  const [loadingSubzonas, setLoadingSubzonas] = useState(false);
  const [subzonasError, setSubzonasError] = useState<string | null>(null);
  const [geoJsonSubzonas, setGeoJsonSubzonas] = useState<FeatureCollection | null>(null);
  const [loadingGeoJsonSubzonas, setLoadingGeoJsonSubzonas] = useState(false);
  const [geoJsonSubzonasError, setGeoJsonSubzonasError] = useState<string | null>(null);
  const [isSubzonasPanelOpen, setIsSubzonasPanelOpen] = useState(false);
  const [sidebarPage, setSidebarPage] = useState(1);
  const [isProjectsSidebarOpen, setIsProjectsSidebarOpen] = useState(true);
  const mapCanvasRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<unknown | null>(null);
  const pointToPinIdRef = useRef<string | null>(null);
  const selectedPointsRef = useRef<SelectedPoint[]>([]);
  const markersByPointRef = useRef<Record<string, GoogleMarkerLike>>({});
  const renderedProjectMarkersRef = useRef<Map<string, GoogleMarkerLike>>(new Map());
  const renderedProjectMarkerListenersRef = useRef<Map<string, GoogleMapsEventListener>>(new Map());
  const markerAnimationFrameIdsRef = useRef<Map<string, number>>(new Map());
  const commercialZoomVisibilityRef = useRef(false);
  const projectViewportListenerRef = useRef<GoogleMapsEventListener | null>(null);
  const projectInfoWindowRef = useRef<GoogleInfoWindowLike | null>(null);
  const isoOverlayFeaturesRef = useRef<unknown[]>([]);
  const subzonaOverlayFeaturesRef = useRef<unknown[]>([]);
  const isoContourOrderRef = useRef<number[]>([]);
  const subzonaOverlayMaxRef = useRef(1);
  const trafficLayerRef = useRef<{ setMap: (map: unknown | null) => void } | null>(null);
  const propertiesRequestIdRef = useRef(0);
  const isMapExpandedRef = useRef(false);
  const housingCategoriesInitializedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getLifestyleMatcherPointsData();
        if (cancelled) return;
        setData(response);
        setSelectedPoints(response.selectedPoints);
      } catch {
        if (cancelled) return;
        setError("No se pudo cargar el paso 2 de Lifestyle Matcher.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    document.body.classList.add("lifestyle-matcher-step2-page");

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const syncMobileFooterClass = (matches: boolean) => {
      document.body.classList.toggle("lifestyle-hide-global-footer", matches);
    };

    syncMobileFooterClass(mobileQuery.matches);
    const handleMobileQueryChange = (event: MediaQueryListEvent) => {
      syncMobileFooterClass(event.matches);
    };
    mobileQuery.addEventListener("change", handleMobileQueryChange);

    return () => {
      cancelled = true;
      mobileQuery.removeEventListener("change", handleMobileQueryChange);
      document.body.classList.remove("lifestyle-hide-global-footer");
      document.body.classList.remove("lifestyle-matcher-step2-map-expanded");
      document.body.classList.remove("lifestyle-matcher-step2-page");
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("lifestyle-matcher-step2-map-expanded", isMapExpanded);
    return () => {
      document.body.classList.remove("lifestyle-matcher-step2-map-expanded");
    };
  }, [isMapExpanded]);

  useEffect(() => {
    if (!isMapExpanded) {
      setIsMarkersModalOpen(false);
    }
  }, [isMapExpanded]);

  useEffect(() => {
    if (!isMapExpanded) {
      setIsProjectsSidebarOpen(true);
      setIsSubzonasPanelOpen(false);
    }
  }, [isMapExpanded]);

  useEffect(() => {
    pointToPinIdRef.current = pointToPinId;
  }, [pointToPinId]);

  useEffect(() => {
    selectedPointsRef.current = selectedPoints;
  }, [selectedPoints]);

  useEffect(() => {
    isMapExpandedRef.current = isMapExpanded;
    if (!isMapExpanded) {
      projectViewportListenerRef.current?.remove();
      projectViewportListenerRef.current = null;
      renderedProjectMarkerListenersRef.current.forEach((listener) => listener.remove());
      renderedProjectMarkerListenersRef.current.clear();
      markerAnimationFrameIdsRef.current.forEach((frameId) => cancelAnimationFrame(frameId));
      markerAnimationFrameIdsRef.current.clear();
      renderedProjectMarkersRef.current.forEach((marker) => marker.setMap(null));
      renderedProjectMarkersRef.current.clear();
      projectInfoWindowRef.current?.close?.();
    }
  }, [isMapExpanded]);

  useEffect(() => {
    if (!isMapExpanded) return;
    const map = mapInstanceRef.current;
    const showPoints = additionalMarkerVisibility.points;
    Object.values(markersByPointRef.current).forEach((marker) => marker.setMap(showPoints ? map : null));
  }, [isMapExpanded, additionalMarkerVisibility]);

  useEffect(() => {
    if (!selectedZonaPrimaria) {
      setSubzonas([]);
      setSubzonasSeleccionadas(new Set());
      setLoadingSubzonas(false);
      setSubzonasError(null);
      return;
    }

    let active = true;
    const loadSubzonas = async () => {
      try {
        setLoadingSubzonas(true);
        setSubzonasError(null);

        const params = new URLSearchParams();
        params.set("zona", selectedZonaPrimaria);
        params.set("limit", "200");
        params.set("includeGeom", "false");

        const res = await fetch(`/api/subzonas?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.error || "No se pudo cargar subzonas para la zona seleccionada.");
        }

        const payload = await res.json();
        if (!active) return;
        const rows = Array.isArray(payload?.data) ? payload.data : [];

        const mapped: SubzonaChecklistItem[] = rows.map((row: Record<string, unknown>) => ({
          id: String(row.codigoSubzona ?? row.idPublic ?? ""),
          idPublic: String(row.idPublic ?? row.id_public ?? ""),
          nombreSubzona: String(row.nombreDescriptivo ?? row.nombre ?? row.codigoSubzona ?? "Subzona"),
          zonaPrimaria: row.zonaPrimaria ? String(row.zonaPrimaria) : null,
        }));

        setSubzonas(mapped);
        setSubzonasSeleccionadas(new Set(mapped.map((item) => item.idPublic).filter((id) => id.length > 0)));
      } catch (err: unknown) {
        if (!active) return;
        setSubzonasError(err instanceof Error ? err.message : "Error desconocido cargando subzonas.");
        setSubzonas([]);
        setSubzonasSeleccionadas(new Set());
      } finally {
        if (active) setLoadingSubzonas(false);
      }
    };

    loadSubzonas();
    return () => {
      active = false;
    };
  }, [selectedZonaPrimaria]);

  useEffect(() => {
    if (!selectedZonaPrimaria) {
      setGeoJsonSubzonas(null);
      setLoadingGeoJsonSubzonas(false);
      setGeoJsonSubzonasError(null);
      return;
    }

    let active = true;
    const loadGeoJsonSubzonas = async () => {
      try {
        setLoadingGeoJsonSubzonas(true);
        setGeoJsonSubzonasError(null);

        const params = new URLSearchParams();
        params.set("limit", "5000");
        params.set("zonaPrimaria", selectedZonaPrimaria);

        const res = await fetch(`/api/subzonas/geojson?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.error || "No se pudo cargar el GeoJSON de subzonas.");
        }

        const payload = await res.json();
        if (!active) return;
        const collection = extractFeatureCollection(payload);
        if (!collection) {
          throw new Error("La respuesta de subzonas no es un FeatureCollection válido.");
        }

        const normalizedFeatures = collection.features.map((feature) => {
          const props = (feature.properties ?? {}) as Record<string, unknown>;
          return {
            ...feature,
            properties: {
              ...props,
              incidents: deriveIncidentsFromProperties(props),
            },
          };
        });

        setGeoJsonSubzonas({
          ...collection,
          features: normalizedFeatures,
        });
      } catch (err: unknown) {
        if (!active) return;
        setGeoJsonSubzonasError(err instanceof Error ? err.message : "Error desconocido cargando subzonas.");
        setGeoJsonSubzonas(null);
      } finally {
        if (active) setLoadingGeoJsonSubzonas(false);
      }
    };

    loadGeoJsonSubzonas();
    return () => {
      active = false;
    };
  }, [selectedZonaPrimaria]);

  const clearProjectMarkers = () => {
    renderedProjectMarkerListenersRef.current.forEach((listener) => listener.remove());
    renderedProjectMarkerListenersRef.current.clear();
    markerAnimationFrameIdsRef.current.forEach((frameId) => cancelAnimationFrame(frameId));
    markerAnimationFrameIdsRef.current.clear();
    renderedProjectMarkersRef.current.forEach((marker) => marker.setMap(null));
    renderedProjectMarkersRef.current.clear();
    projectInfoWindowRef.current?.close?.();
  };

  const fetchDefaultZonaMarkers = async (): Promise<FeatureCollection | null> => {
    let lastError: string | null = null;

    for (const zonaCandidate of DEFAULT_ZONA_FALLBACK_CANDIDATES) {
      try {
        const [housingCollection, commercialCollection] = await Promise.all([
          fetchHousingMarkersByZona(zonaCandidate, 5000, housingPeriodFilter),
          fetchCommercialMarkersByZona(zonaCandidate, 5000),
        ]);
        const merged = mergeMarkerCollections([housingCollection, commercialCollection]);
        if (merged.features.length > 0) {
          return merged;
        }
      } catch (fallbackError: unknown) {
        lastError =
          fallbackError instanceof Error
            ? fallbackError.message
            : `No se pudo cargar zona fallback ${zonaCandidate}.`;
        continue;
      }
    }

    if (lastError) {
      setPropertiesError(lastError);
    }
    return null;
  };

  const fetchCombinedMarkerCollections = async (
    geojson: FeatureCollection
  ): Promise<{ housing: FeatureCollection | null; commercial: FeatureCollection | null }> => {
    const [housingResult, commercialResult] = await Promise.allSettled([
      fetchHousingMarkersByGeoJson(geojson, housingPeriodFilter),
      fetchCommercialMarkersByGeoJson(geojson),
    ]);

    const housing = housingResult.status === "fulfilled" ? housingResult.value : null;
    const commercial = commercialResult.status === "fulfilled" ? commercialResult.value : null;

    return { housing, commercial };
  };

  useEffect(() => {
    if (loading || !data) return;
    const mapContainer = mapCanvasRef.current;
    if (!mapContainer) return;

    let active = true;
    let mapInstance: unknown | null = null;
    const mapListeners: GoogleMapsEventListener[] = [];
    let resizeHandler: (() => void) | null = null;

    const initMap = async () => {
      try {
        await ensureGoogleMapsScriptLoaded();
        if (!active || !mapContainer) return;

        mapInstance = createGoogleMap({
          container: mapContainer,
          center: [14.602416, -90.517302],
          zoom: 13,
          minZoom: 7,
          maxZoom: 18,
          maxBounds: [
            [18.44834670293207, -88.04443359375001],
            [10.692996347925087, -92.98828125],
          ],
          zoomControl: false,
        });
        mapInstanceRef.current = mapInstance;

        const maybeGoogle = (window as unknown as { google?: GoogleMapsGlobal }).google;
        const markerCtor = maybeGoogle?.maps?.Marker;

        const clickListener = (mapInstance as GoogleMapLike).addListener("click", (event: GoogleMapMouseEvent) => {
          const activePointId = pointToPinIdRef.current;
          if (!activePointId || !markerCtor || !event.latLng) return;

          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          const activePoint = selectedPointsRef.current.find((point) => point.id === activePointId);
          const activePointTitle = activePoint?.title ?? activePointId;

          const prevMarker = markersByPointRef.current[activePointId];
          if (prevMarker) prevMarker.setMap(null);

          const marker = new markerCtor({
            map: mapInstance,
            position: { lat, lng },
            title: activePointTitle,
          });
          markersByPointRef.current[activePointId] = marker;
          setPointLocations((prev) => ({ ...prev, [activePointId]: { lat, lng } }));

          setSelectedPoints((prev) =>
            prev.map((point) =>
              point.id === activePointId
                ? { ...point, subtitle: `Ubicación fijada (${lat.toFixed(5)}, ${lng.toFixed(5)})`, active: true }
                : { ...point, active: false },
            ),
          );
          setPointToPinId(null);
        });
        mapListeners.push(clickListener);

        const triggerResize = () => {
          const maybeGoogle = (window as unknown as { google?: GoogleMapsGlobal }).google;
          maybeGoogle?.maps?.event?.trigger?.(mapInstance, "resize");
        };

        // Asegura render correcto al primer paint y en resize de ventana.
        window.setTimeout(triggerResize, 0);
        window.setTimeout(triggerResize, 120);
        resizeHandler = () => triggerResize();
        window.addEventListener("resize", resizeHandler);

        setMapReady(true);
      } catch {
        if (!active) return;
        setMapError("No se pudo cargar Google Maps.");
      }
    };

    initMap();

    return () => {
      active = false;
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      Object.values(markersByPointRef.current).forEach((marker) => marker.setMap(null));
      markersByPointRef.current = {};
      projectViewportListenerRef.current?.remove();
      projectViewportListenerRef.current = null;
      clearProjectMarkers();
      clearIsoOverlay();
      const mapLike = mapInstanceRef.current as GoogleMapLike | null;
      if (mapLike?.data) {
        subzonaOverlayFeaturesRef.current.forEach((feature) => mapLike.data?.remove(feature));
      }
      subzonaOverlayFeaturesRef.current = [];
      subzonaOverlayMaxRef.current = 1;
      if (trafficLayerRef.current) {
        trafficLayerRef.current.setMap(null);
      }
      destroyGoogleMap(mapInstance, mapListeners);
      mapInstanceRef.current = null;
    };
  }, [loading, data]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const triggerResize = () => {
      const maybeGoogle = (window as unknown as { google?: GoogleMapsGlobal }).google;
      maybeGoogle?.maps?.event?.trigger?.(mapInstanceRef.current, "resize");
    };

    window.setTimeout(triggerResize, 0);
    window.setTimeout(triggerResize, 120);
  }, [isMapExpanded]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const maybeGoogle = (window as unknown as { google?: GoogleMapsGlobal }).google;
    const TrafficLayerCtor = maybeGoogle?.maps?.TrafficLayer;
    if (!map || !TrafficLayerCtor) return;

    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new TrafficLayerCtor();
    }
    trafficLayerRef.current.setMap(isoTrafficProfile === "con-trafico" ? map : null);
  }, [isoTrafficProfile, mapReady]);

  useEffect(() => {
    const map = mapInstanceRef.current as GoogleMapLike | null;
    if (!map || !mapReady) return;
    applyMapBaseVisuals(map, mapType, markerCategoryVisibility);
  }, [mapReady, mapType, markerCategoryVisibility]);

  useEffect(() => {
    if (!isToolsModalOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsToolsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isToolsModalOpen]);

  const clearIsoOverlay = () => {
    const map = mapInstanceRef.current as GoogleMapLike | null;
    if (!map?.data) return;
    isoOverlayFeaturesRef.current.forEach((feature) => map.data?.remove(feature));
    isoOverlayFeaturesRef.current = [];
    isoContourOrderRef.current = [];
  };

  const clearSubzonaOverlay = useCallback(() => {
    const map = mapInstanceRef.current as GoogleMapLike | null;
    if (!map?.data) return;
    subzonaOverlayFeaturesRef.current.forEach((feature) => map.data?.remove(feature));
    subzonaOverlayFeaturesRef.current = [];
    subzonaOverlayMaxRef.current = 1;
  }, []);

  const applyMapDataOverlayStyle = useCallback((params: { map: GoogleMapLike }) => {
    const { map } = params;
    if (!map.data) return;
    map.data.setStyle((feature) => {
      const layer = String(feature.getProperty?.("__overlayLayer") ?? "iso");
      if (layer === "subzona") {
        const shouldShowSubzonas = additionalMarkerVisibility.subzonas;
        if (!shouldShowSubzonas) {
          return {
            strokeOpacity: 0,
            strokeWeight: 0,
            fillOpacity: 0,
            clickable: false,
            zIndex: 22,
          };
        }
        const value = Number(feature.getProperty?.("incidents") ?? 0);
        const maxValue = Math.max(1, subzonaOverlayMaxRef.current);
        const ratio = Math.min(Math.max(value / maxValue, 0), 1);
        const palette = ["#ffffff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#a855f7"];
        const index = Math.min(palette.length - 1, Math.floor(ratio * (palette.length - 1)));
        return {
          strokeColor: "#7e22ce",
          strokeOpacity: 0.85,
          strokeWeight: 1.8,
          fillColor: palette[index],
          fillOpacity: 0.3,
          clickable: false,
          zIndex: 22,
        };
      }

      const shouldShowIsochrones = additionalMarkerVisibility.isochrones;
      if (!shouldShowIsochrones) {
        return {
          strokeOpacity: 0,
          strokeWeight: 0,
          fillOpacity: 0,
          clickable: false,
          zIndex: 18,
        };
      }

      const contourValue = Number(feature.getProperty?.("contourValue") ?? feature.getProperty?.("contour") ?? 0);
      const index = contourValue > 0 ? Math.max(0, isoContourOrderRef.current.indexOf(contourValue)) : 0;
      const polygonStyle = getIsoPolygonStyle(
        isoStyleOption,
        {
          properties: {
            contourValue: Number.isFinite(contourValue) ? contourValue : 0,
          },
        },
        index
      );
      return {
        strokeColor: polygonStyle.strokeColor,
        strokeOpacity: polygonStyle.strokeOpacity,
        strokeWeight: polygonStyle.strokeWeight,
        fillColor: polygonStyle.fillColor,
        fillOpacity: polygonStyle.fillOpacity,
        clickable: false,
        zIndex: 18,
      };
    });
  }, [isoStyleOption, additionalMarkerVisibility]);

  const renderIsoOverlay = (geoJson: MultiIsochroneResponse) => {
    const map = mapInstanceRef.current as GoogleMapLike | null;
    if (!map?.data) return;

    clearIsoOverlay();
    const geoJsonWithLayer = {
      ...geoJson,
      features: geoJson.features.map((feature) => ({
        ...feature,
        properties: {
          ...(feature.properties ?? {}),
          __overlayLayer: "iso",
        },
      })),
    };
    const features = map.data.addGeoJson(geoJsonWithLayer as unknown as object);
    isoOverlayFeaturesRef.current = features;
    const contours = geoJson.features
      .map((feature) => Number(feature.properties?.contourValue ?? 0))
      .filter((value) => Number.isFinite(value) && value > 0);
    isoContourOrderRef.current = Array.from(new Set(contours)).sort((a, b) => a - b);
    applyMapDataOverlayStyle({ map });

    fitMapToGeoJson(map, geoJson);
  };

  const renderSubzonasOverlay = useCallback((geoJson: FeatureCollection | null) => {
    const map = mapInstanceRef.current as GoogleMapLike | null;
    if (!map?.data) return;

    clearSubzonaOverlay();
    if (!geoJson || geoJson.features.length === 0) {
      applyMapDataOverlayStyle({ map });
      return;
    }

    const incidentsValues = geoJson.features.map((feature) => {
      const props = (feature.properties ?? {}) as Record<string, unknown>;
      return Number(props.incidents ?? 0);
    });
    subzonaOverlayMaxRef.current = Math.max(
      1,
      ...incidentsValues.filter((value) => Number.isFinite(value) && value > 0)
    );

    const payload = {
      ...geoJson,
      features: geoJson.features.map((feature) => ({
        ...feature,
        properties: {
          ...(feature.properties ?? {}),
          __overlayLayer: "subzona",
        },
      })),
    };

    const features = map.data.addGeoJson(payload as unknown as object);
    subzonaOverlayFeaturesRef.current = features;
    applyMapDataOverlayStyle({ map });
  }, [applyMapDataOverlayStyle, clearSubzonaOverlay]);

  const isoUnionGeoJson = useMemo<FeatureCollection | null>(() => {
    if (!isoGeoJson || !Array.isArray(isoGeoJson.features) || isoGeoJson.features.length === 0) {
      return null;
    }

    const features = isoGeoJson.features
      .filter((feature) => Boolean(feature?.geometry))
      .map((feature) => ({
        type: "Feature" as const,
        geometry: feature.geometry,
        properties: {
          ...(feature.properties ?? {}),
        },
      }));

    if (!features.length) return null;
    return {
      type: "FeatureCollection",
      features,
    };
  }, [isoGeoJson]);

  const geoJsonSubzonasFiltrado = useMemo<FeatureCollection | null>(() => {
    if (!geoJsonSubzonas) return null;
    if (subzonasSeleccionadas.size === 0) {
      return {
        ...geoJsonSubzonas,
        features: [],
      };
    }

    const features = geoJsonSubzonas.features.filter((feature) => {
      const properties = (feature.properties ?? {}) as Record<string, unknown>;
      const idPublic = String(properties.idPublic ?? properties.id_public ?? "");
      return idPublic.length > 0 && subzonasSeleccionadas.has(idPublic);
    });

    return {
      ...geoJsonSubzonas,
      features,
    };
  }, [geoJsonSubzonas, subzonasSeleccionadas]);

  const subzonasSelectionGeoJson = useMemo<FeatureCollection | null>(() => {
    if (!selectedZonaPrimaria) return null;
    if (!geoJsonSubzonasFiltrado || geoJsonSubzonasFiltrado.features.length === 0) return null;
    return geoJsonSubzonasFiltrado;
  }, [selectedZonaPrimaria, geoJsonSubzonasFiltrado]);

  useEffect(() => {
    if (!isMapExpandedRef.current) {
      setLoadingProperties(false);
      setPropertiesError(null);
      return;
    }

    const requestId = propertiesRequestIdRef.current + 1;
    propertiesRequestIdRef.current = requestId;
    let active = true;

    const run = async () => {
      try {
        setLoadingProperties(true);
        setPropertiesError(null);
        setSidebarPage(1);
        const collections: FeatureCollection[] = [];
        if (isoUnionGeoJson && subzonasSelectionGeoJson) {
          const [isoCollections, subzonasCollections] = await Promise.all([
            fetchCombinedMarkerCollections(isoUnionGeoJson),
            fetchCombinedMarkerCollections(subzonasSelectionGeoJson),
          ]);
          const housingByIso = isoCollections.housing;
          const commercialByIso = isoCollections.commercial;
          const housingBySubzonas = subzonasCollections.housing;
          const commercialBySubzonas = subzonasCollections.commercial;

          const byIsoMerged = mergeMarkerCollections(
            [housingByIso, commercialByIso].filter((collection): collection is FeatureCollection => collection !== null)
          );
          const bySubzonasMerged = mergeMarkerCollections(
            [housingBySubzonas, commercialBySubzonas].filter((collection): collection is FeatureCollection => collection !== null)
          );

          if (byIsoMerged.features.length === 0 && bySubzonasMerged.features.length === 0) {
            throw new Error("No se pudieron cargar marcadores para isocrona/subzonas.");
          }

          const intersection = intersectMarkerCollections(
            byIsoMerged,
            bySubzonasMerged
          );
          if (intersection.features.length > 0) {
            collections.push(intersection);
          }
        } else if (isoUnionGeoJson) {
          const { housing, commercial } = await fetchCombinedMarkerCollections(isoUnionGeoJson);
          const mergedByIso = mergeMarkerCollections(
            [housing, commercial].filter((collection): collection is FeatureCollection => collection !== null)
          );
          if (mergedByIso.features.length > 0) {
            collections.push(mergedByIso);
          }
        } else if (subzonasSelectionGeoJson) {
          const { housing, commercial } = await fetchCombinedMarkerCollections(subzonasSelectionGeoJson);
          const mergedBySubzonas = mergeMarkerCollections(
            [housing, commercial].filter((collection): collection is FeatureCollection => collection !== null)
          );
          if (mergedBySubzonas.features.length > 0) {
            collections.push(mergedBySubzonas);
          }
        }

        if (collections.length === 0) {
          const fallback = await fetchDefaultZonaMarkers();
          if (fallback?.features.length) {
            collections.push(fallback);
          }
        }

        const nextCollection = collections.length > 0 ? mergeMarkerCollections(collections) : null;
        if (!active || requestId !== propertiesRequestIdRef.current) return;
        setPropertiesGeoJson(nextCollection);
      } catch (requestError: unknown) {
        if (!active || requestId !== propertiesRequestIdRef.current) return;
        setPropertiesGeoJson(null);
        setPropertiesError(
          requestError instanceof Error ? requestError.message : "No se pudo cargar proyectos para el panel."
        );
      } finally {
        if (!active || requestId !== propertiesRequestIdRef.current) return;
        setLoadingProperties(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [isoUnionGeoJson, subzonasSelectionGeoJson, housingPeriodFilter]);

  const availableHousingCategories = useMemo<HousingMarkerGroup[]>(
    () => HOUSING_MARKER_GROUPS.map((item) => item.key),
    []
  );
  const projectMarkersRenderKey = useMemo(() => {
    const housingSelection = Array.from(selectedHousingCategories).sort().join("|");
    const showCommercial = additionalMarkerVisibility.comercios ? "1" : "0";
    return `${housingSelection}::${showCommercial}`;
  }, [selectedHousingCategories, additionalMarkerVisibility.comercios]);

  useEffect(() => {
    if (availableHousingCategories.length === 0) {
      housingCategoriesInitializedRef.current = false;
      setSelectedHousingCategories(new Set());
      return;
    }

    setSelectedHousingCategories((previous) => {
      if (!housingCategoriesInitializedRef.current) {
        housingCategoriesInitializedRef.current = true;
        return new Set(availableHousingCategories);
      }

      const availableSet = new Set(availableHousingCategories);
      const next = new Set<HousingMarkerGroup>();
      previous.forEach((category) => {
        if (availableSet.has(category)) next.add(category);
      });
      return next;
    });
  }, [availableHousingCategories]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const maybeGoogle = (window as unknown as { google?: GoogleMapsGlobal }).google;
    const MarkerCtor = maybeGoogle?.maps?.Marker;

    if (!isMapExpandedRef.current) {
      return;
    }

    if (!mapReady || !map || !MarkerCtor) return;

    const allFeatures = propertiesGeoJson?.features ?? [];
    const normalizedRows = allFeatures
      .map((feature) => {
        const properties = (feature.properties ?? {}) as Record<string, unknown>;
        const geometry = (feature.geometry ?? {}) as { coordinates?: unknown };
        const coordinates = Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
        const lng = Number(coordinates[0]);
        const lat = Number(coordinates[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return { lat, lng, properties };
      })
      .filter((item): item is MarkerViewportRow => item !== null);

    const housingRows = normalizedRows.filter((row) => {
      const markerSource = String(row.properties.markerSource ?? "housing");
      if (markerSource === "commercial") return false;
      const category = resolveHousingMarkerGroupFromProperties(row.properties);
      if (!category) return false;
      return selectedHousingCategories.has(category);
    });
    const commercialRows = normalizedRows.filter(
      (row) =>
        String(row.properties.markerSource ?? "housing") === "commercial" &&
        additionalMarkerVisibility.comercios
    );
    if (housingRows.length === 0 && commercialRows.length === 0) {
      projectViewportListenerRef.current?.remove();
      projectViewportListenerRef.current = null;
      clearProjectMarkers();
      return;
    }

    const InfoWindowCtor = maybeGoogle?.maps?.InfoWindow;
    if (InfoWindowCtor && !projectInfoWindowRef.current) {
      projectInfoWindowRef.current = new InfoWindowCtor();
    }

    const commercialRowsSorted = sortRowsByStableIdentity(commercialRows);

    const iconCache = new Map<string, unknown>();
    const resolveIcon = (params: { markerSource: string; category: HousingMarkerGroup }) => {
      const { markerSource, category } = params;
      const iconUrl =
        markerSource === "commercial"
          ? "/assets/img/svg/mall-bag-svgrepo-com%20(1).svg"
          : resolveHousingCategoryIcon(category);
      const cacheKey = `${markerSource}:${iconUrl}`;
      const cached = iconCache.get(cacheKey);
      if (cached) return cached;
      const nextIcon = maybeGoogle?.maps?.Size
        ? { url: iconUrl, scaledSize: new maybeGoogle.maps.Size(30, 30) }
        : iconUrl;
      iconCache.set(cacheKey, nextIcon);
      return nextIcon;
    };

    const startMarkerOpacityAnimation = (params: {
      markerKey: string;
      marker: GoogleMarkerLike;
      from: number;
      to: number;
      durationMs?: number;
      onDone?: () => void;
    }) => {
      const { markerKey, marker, from, to, durationMs = 160, onDone } = params;
      const previousFrameId = markerAnimationFrameIdsRef.current.get(markerKey);
      if (previousFrameId) {
        cancelAnimationFrame(previousFrameId);
        markerAnimationFrameIdsRef.current.delete(markerKey);
      }

      if (!marker.setOpacity || durationMs <= 0) {
        marker.setOpacity?.(to);
        onDone?.();
        return;
      }

      const startedAt = Date.now();
      marker.setOpacity(from);

      const animate = () => {
        const elapsed = Date.now() - startedAt;
        const progress = Math.min(1, elapsed / durationMs);
        const nextOpacity = from + (to - from) * progress;
        marker.setOpacity?.(nextOpacity);
        if (progress < 1) {
          const frameId = requestAnimationFrame(animate);
          markerAnimationFrameIdsRef.current.set(markerKey, frameId);
          return;
        }
        markerAnimationFrameIdsRef.current.delete(markerKey);
        onDone?.();
      };

      const frameId = requestAnimationFrame(animate);
      markerAnimationFrameIdsRef.current.set(markerKey, frameId);
    };

    const syncVisibleMarkers = () => {
      const bounds = (map as GoogleMapLike).getBounds?.();
      const sw = bounds?.getSouthWest?.();
      const ne = bounds?.getNorthEast?.();
      const zoomLevel = Number((map as GoogleMapLike).getZoom?.() ?? 0);
      const previousCommercialVisibility = commercialZoomVisibilityRef.current;
      const nextCommercialVisibility = resolveCommercialVisibilityByHysteresis({
        zoom: zoomLevel,
        previousVisible: previousCommercialVisibility,
        minZoom: COMMERCIAL_MARKER_MIN_ZOOM,
      });
      commercialZoomVisibilityRef.current = nextCommercialVisibility;
      const isCommercialVisibleByZoom = nextCommercialVisibility;
      const visibleHousingRows =
        !sw || !ne ? housingRows : housingRows.filter((row) => isRowInViewport(row, sw, ne));
      const commercialRowsInViewport =
        !sw || !ne ? commercialRowsSorted : commercialRowsSorted.filter((row) => isRowInViewport(row, sw, ne));
      const allCommercialRows = isCommercialVisibleByZoom ? commercialRowsInViewport : [];

      const commercialRenderRatio = isCommercialVisibleByZoom ? resolveCommercialRenderRatio(zoomLevel) : 0;
      const visibleCommercialRows = (() => {
        if (!allCommercialRows.length || commercialRenderRatio <= 0) return [];
        const limit = Math.max(1, Math.ceil(allCommercialRows.length * commercialRenderRatio));
        return allCommercialRows.slice(0, limit);
      })();
      const visibleRows = [...visibleHousingRows, ...visibleCommercialRows];
      const renderedMarkers = renderedProjectMarkersRef.current;
      const renderedListeners = renderedProjectMarkerListenersRef.current;
      const nextRowsByKey = new Map<string, MarkerViewportRow>();
      visibleRows.forEach((row) => {
        nextRowsByKey.set(markerKeyOfRow(row), row);
      });

      renderedMarkers.forEach((marker, key) => {
        if (nextRowsByKey.has(key)) return;
        renderedListeners.get(key)?.remove();
        renderedListeners.delete(key);
        startMarkerOpacityAnimation({
          markerKey: key,
          marker,
          from: 1,
          to: 0,
          onDone: () => marker.setMap(null),
        });
        renderedMarkers.delete(key);
      });

      if (!nextRowsByKey.size) return;

      nextRowsByKey.forEach((row, rowKey) => {
        if (renderedMarkers.has(rowKey)) return;
        const markerSource = String(row.properties.markerSource ?? "housing");
        const resolvedCategory = resolveHousingMarkerGroupFromProperties(row.properties) ?? "vertical";
        const icon = resolveIcon({ markerSource, category: resolvedCategory });

        const marker = new MarkerCtor({
          map,
          position: { lat: row.lat, lng: row.lng },
          title: String(row.properties.nombreProyecto ?? row.properties.proyecto ?? ""),
          icon,
        });
        marker.setOpacity?.(0);
        renderedMarkers.set(rowKey, marker);
        startMarkerOpacityAnimation({
          markerKey: rowKey,
          marker,
          from: 0,
          to: 1,
        });

        const proyecto = readFirstString(row.properties, ["nombreProyecto", "proyecto"], "Proyecto sin nombre");
        const desarrollador = readFirstString(row.properties, ["nombreDesarrollador", "desarrollador"], "N/D");
        const categoria = readFirstString(row.properties, ["categoria"], "N/D");

        const listener = (marker as unknown as { addListener?: (name: "click", cb: () => void) => GoogleMapsEventListener })
          .addListener?.("click", () => {
            if (!projectInfoWindowRef.current) return;
            projectInfoWindowRef.current.setContent(
              `<div style="padding:8px 10px;max-width:240px;">
                <strong style="display:block;margin-bottom:4px;">${proyecto}</strong>
                <div style="font-size:12px;color:#4a5568;">${desarrollador}</div>
                <div style="font-size:12px;color:#64748b;margin-top:2px;">${categoria}</div>
              </div>`
            );
            projectInfoWindowRef.current.open({
              map,
              anchor: marker as unknown,
            });
          });

        if (listener) {
          renderedListeners.set(rowKey, listener);
        }
      });
    };

    const IDLE_SYNC_THROTTLE_MS = 140;
    let lastSyncAt = 0;
    let pendingSyncTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleSyncVisibleMarkers = () => {
      const now = Date.now();
      const elapsed = now - lastSyncAt;
      if (elapsed >= IDLE_SYNC_THROTTLE_MS) {
        lastSyncAt = now;
        syncVisibleMarkers();
        return;
      }
      if (pendingSyncTimer) return;
      const waitForMs = IDLE_SYNC_THROTTLE_MS - elapsed;
      pendingSyncTimer = setTimeout(() => {
        pendingSyncTimer = null;
        lastSyncAt = Date.now();
        syncVisibleMarkers();
      }, waitForMs);
    };

    projectViewportListenerRef.current?.remove();
    projectViewportListenerRef.current = (map as GoogleMapLike).addListener("idle", scheduleSyncVisibleMarkers);
    scheduleSyncVisibleMarkers();

    return () => {
      projectViewportListenerRef.current?.remove();
      projectViewportListenerRef.current = null;
      markerAnimationFrameIdsRef.current.forEach((frameId) => cancelAnimationFrame(frameId));
      markerAnimationFrameIdsRef.current.clear();
      if (pendingSyncTimer) {
        clearTimeout(pendingSyncTimer);
      }
      clearProjectMarkers();
    };
  }, [mapReady, propertiesGeoJson, projectMarkersRenderKey]);

  useEffect(() => {
    if (!mapReady) return;
    renderSubzonasOverlay(geoJsonSubzonasFiltrado);
  }, [mapReady, geoJsonSubzonasFiltrado, renderSubzonasOverlay]);

  useEffect(() => {
    const map = mapInstanceRef.current as GoogleMapLike | null;
    if (!map?.data) return;
    if (!isoOverlayFeaturesRef.current.length && !subzonaOverlayFeaturesRef.current.length) return;
    applyMapDataOverlayStyle({ map });
  }, [isoStyleOption, applyMapDataOverlayStyle]);

  const handleActivatePointPin = (pointId: string) => {
    setPointToPinId(pointId);
    setSelectedPoints((prev) => prev.map((point) => ({ ...point, active: point.id === pointId })));
  };

  const handleCreateIsochrone = async () => {
    try {
      setIsoRequestError(null);
      setIsoRequestMeta(null);

      const prioritizedPoints = selectedPoints
        .map((point, index) => {
          const location = pointLocations[point.id];
          if (!location) return null;
          return {
            id: point.id,
            lat: location.lat,
            lng: location.lng,
            priority: index + 1,
          };
        })
        .filter((point): point is { id: string; lat: number; lng: number; priority: number } => point !== null);

      if (!prioritizedPoints.length) {
        throw new Error("Primero debes fijar al menos un punto en el mapa.");
      }

      setIsoSubmitting(true);
      const contoursMinutes =
        isoContourUnit === "hibrido"
          ? [isoHybridMinutes]
          : isoContourUnit === "calculada"
            ? isoTrafficProfile === "con-trafico"
              ? [isoTrafficMinutes]
              : isoCalculatedMinutesPreset === "intervalos-15"
                ? [15, 30, 45, 60]
                : [Number(isoCalculatedMinutesPreset)]
            : [isoTimeMinutes];
      const contoursMeters =
        isoContourUnit === "hibrido"
          ? [isoHybridMeters]
          : isoMetersPreset === "intervalos-5000"
            ? [5000, 10000, 15000, 20000]
            : [Number(isoMetersPreset)];

      const result = await createMultiIsochrone({
        points: prioritizedPoints,
        timeMinutes: isoTimeMinutes,
        speedKmh: isoSpeedKmh,
        trafficEnabled: isoTrafficProfile === "con-trafico",
        trafficProfile: isoTrafficProfile,
        contourUnit: isoContourUnit,
        styleOption: isoStyleOption,
        contoursMinutes,
        contoursMeters,
        calculatedMinutes:
          isoCalculatedMinutesPreset === "intervalos-15"
            ? [15, 30, 45, 60]
            : [Number(isoCalculatedMinutesPreset)],
        calculatedTrafficMinutes: [isoTrafficMinutes],
        departAt: isoDepartAt || null,
      });

      renderIsoOverlay(result);
      setIsoGeoJson(result);
      setMarkerCategoryVisibility({ ...DEFAULT_MARKER_CATEGORY_STATE });
      setAdditionalMarkerVisibility({ ...DEFAULT_ADDITIONAL_MARKER_VISIBILITY_STATE });
      if (availableHousingCategories.length > 0) {
        setSelectedHousingCategories(new Set(availableHousingCategories));
      }
      const responseMode = String(result.meta?.mode ?? result.features?.[0]?.properties?.mode ?? "desconocido");
      const responseContour = result.meta?.contourValue ?? result.features?.[0]?.properties?.contourValue ?? "N/D";
      const responseProcessedPoints = Number(
        result.meta?.processedPoints ?? result.features?.[0]?.properties?.priorityOrder?.length ?? prioritizedPoints.length
      );
      setIsoRequestMeta(
        `Cobertura generada (${responseMode}=${responseContour}) con ${responseProcessedPoints} puntos.`
      );
      setIsToolsModalOpen(false);
      setIsMapExpanded(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo crear el isocrono múltiple.";
      setIsoRequestError(message);
    } finally {
      setIsoSubmitting(false);
    }
  };

  const pointToPin = selectedPoints.find((point) => point.id === pointToPinId) ?? null;
  const markerCards = useMemo<MarkerCardItem[]>(() => {
    const features = propertiesGeoJson?.features ?? [];

    return features.map((feature, index) => {
      const properties = (feature.properties ?? {}) as Record<string, unknown>;
      const markerSource = String(properties.markerSource ?? "housing");
      const geometry = (feature.geometry ?? {}) as { coordinates?: unknown };
      const coordinates = Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
      const lon = coordinates.length > 0 ? String(coordinates[0]) : "lon";
      const lat = coordinates.length > 1 ? String(coordinates[1]) : "lat";
      const nombreProyecto = readFirstString(properties, ["nombreProyecto", "proyecto"], "Proyecto sin nombre");
      const departamento = readFirstString(properties, ["departamento"]);
      const municipio = readFirstString(properties, ["municipio"]);
      const desarrollador = readFirstString(properties, ["nombreDesarrollador", "desarrollador"]);
      const estado = readFirstString(properties, ["estado"]);
      const categoria = readFirstString(properties, ["categoria", "tipoCc"], markerSource === "commercial" ? "Comercio" : "N/D");
      const uso = readFirstString(properties, ["uso"], markerSource === "commercial" ? "Comercio" : "");
      const imagen = readFirstString(properties, ["imagen", "urlImagen"], "");
      const totalM2 = formatInteger(
        properties.totalM2 ??
          properties.total_m2 ??
          properties.areaM2 ??
          properties.area_m2 ??
          properties.metrosCuadrados ??
          null
      );
      const parqueos = formatInteger(properties.parqueos ?? properties.totalParqueo ?? null);
      const precioPromedioM2 = formatPrecioPromedioM2(properties.precioPromedio ?? null);
      const id = String(feature.id ?? properties.id ?? "marker");
      const uniqueKey = `${id}-${lon}-${lat}-${index}`;

      return {
        key: uniqueKey,
        nombreProyecto,
        departamento,
        municipio,
        desarrollador,
        totalM2,
        parqueos,
        estado,
        categoria,
        uso,
        precioPromedioM2,
        imagen: imagen || null,
      };
    });
  }, [propertiesGeoJson]);

  const totalCards = markerCards.length;
  const totalSidebarPages = Math.max(1, Math.ceil(totalCards / SIDEBAR_PAGE_SIZE));
  const paginatedMarkerCards = useMemo(() => {
    const start = (sidebarPage - 1) * SIDEBAR_PAGE_SIZE;
    const end = start + SIDEBAR_PAGE_SIZE;
    return markerCards.slice(start, end);
  }, [markerCards, sidebarPage]);

  useEffect(() => {
    if (sidebarPage <= totalSidebarPages) return;
    setSidebarPage(totalSidebarPages);
  }, [sidebarPage, totalSidebarPages]);

  const toggleSubzonaSeleccionada = (idPublic: string) => {
    setSubzonasSeleccionadas((prev) => {
      const next = new Set(prev);
      if (next.has(idPublic)) {
        next.delete(idPublic);
      } else {
        next.add(idPublic);
      }
      return next;
    });
  };

  const selectAllSubzonas = () => {
    setSubzonasSeleccionadas(new Set(subzonas.map((item) => item.idPublic).filter((id) => id.length > 0)));
  };

  const clearAllSubzonas = () => {
    setSubzonasSeleccionadas(new Set());
  };

  if (loading) {
    return (
      <section className={styles.pageWrap}>
        <p className={styles.feedbackText}>Cargando configuración de puntos...</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.pageWrap}>
        <p className={styles.feedbackText}>{error ?? "No se encontró información."}</p>
      </section>
    );
  }

  return (
    <section className={`${styles.pageWrap} ${isMapExpanded ? styles.pageWrapExpanded : ""}`} aria-label="Lifestyle matcher paso 2">
      <div className={styles.backdrop} aria-hidden></div>

      <div className={`${styles.modalCard} ${isMapExpanded ? styles.modalCardExpanded : ""}`}>
        <header className={styles.headerArea}>
          <h1>{data.title}</h1>
          <p>{data.subtitle}</p>
          <small>{data.progressPercent}% completado</small>
        </header>

        <div className={styles.progressBar}>
          <span style={{ width: `${data.progressPercent}%` }}></span>
        </div>

        <div className={styles.contentGrid}>
          <aside className={styles.leftPane}>
            <div className={styles.mobileSheetHeader}>
              <div className={styles.mobileSheetTitleRow}>
                <h4>Paso 2: Ubicaciones Favoritas</h4>
                <small>2/2</small>
              </div>
              <div className={styles.mobileSheetProgress}>
                <span style={{ width: `${data.progressPercent}%` }}></span>
              </div>
              <div className={styles.mobileHintBox}>
                Toca el mapa para definir la ubicación de tu{" "}
                <b>{pointToPin ? pointToPin.title : "punto seleccionado"}</b>.
              </div>
            </div>

            <h3>PUNTOS SELECCIONADOS</h3>

            <div className={styles.pointList}>
              {selectedPoints.map((point) => (
                <article
                  key={point.id}
                  className={`${styles.pointItem} ${point.active ? styles.pointActive : ""}`}
                  onClick={() => handleActivatePointPin(point.id)}
                >
                  <div>
                    <strong>{point.title}</strong>
                    <small>{point.subtitle}</small>
                  </div>
                  <div className={styles.pointActionsRight}>
                    {point.active ? (
                      <button
                        type="button"
                        className={styles.fixPointBtn}
                        onClick={() => handleActivatePointPin(point.id)}
                      >
                        FIJAR
                      </button>
                    ) : (
                      <span>✎</span>
                    )}
                  </div>
                </article>
              ))}
            </div>

          </aside>

          <main className={`${styles.mapPane} ${isMapExpanded ? styles.mapPaneExpanded : ""}`} aria-label="Mapa de selección">
            <div ref={mapCanvasRef} className={styles.mapCanvas} />
            <div className={styles.mapSearchBar}>
              <div className={styles.mapSearchInputWrap}>
                <SubzonaAutocomplete
                  selectedZonaPrimaria={selectedZonaPrimaria}
                  onZonaSelected={(zonaPrimaria) => {
                    setSelectedZonaPrimaria(zonaPrimaria);
                  }}
                  placeholder="Buscar por zona (ej: zona 10, z10, 10)"
                />
              </div>
              <button
                type="button"
                className={`${styles.mapSearchMenuBtn} ${isSubzonasPanelOpen ? styles.mapSearchMenuBtnActive : ""} ${!isMapExpanded ? styles.mapSearchMenuBtnDisabled : ""}`}
                aria-label="Ver subzonas"
                onClick={() => {
                  if (!isMapExpanded) return;
                  setIsSubzonasPanelOpen((prev) => !prev);
                }}
                disabled={!isMapExpanded}
              >
                <img src="/assets/img/svg/menu-svgrepo-com.svg" alt="" aria-hidden="true" className={styles.mapSearchMenuBtnIcon} />
                <span>Subzonas</span>
              </button>
            </div>
            <div className={styles.mapHint}>
              {pointToPin ? `Haz clic para fijar "${pointToPin.title}"` : 'Selecciona "Fijar en mapa" para colocar marcador'}
            </div>
            <div className={styles.mapControlsLeft} aria-label="Controles laterales">
              <button
                type="button"
                className={`${styles.mapIconButton} ${isMapTypeModalOpen ? styles.mapIconButtonActive : ""}`}
                aria-label="Tipo de mapa"
                onClick={() => setIsMapTypeModalOpen(true)}
              >
                <img
                  src="/assets/img/svg/iso-stack-svgrepo-com.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.mapIconSvg}
                />
              </button>
              <button
                type="button"
                className={`${styles.mapIconButton} ${isToolsModalOpen ? styles.mapIconButtonActive : ""}`}
                aria-label="Herramientas"
                onClick={() => setIsToolsModalOpen((prev) => !prev)}
              >
                <img
                  src="/assets/img/svg/iso-svgrepo-com.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.mapIconSvg}
                />
              </button>
              <button
                type="button"
                className={`${styles.mapIconButton} ${isMarkersModalOpen ? styles.mapIconButtonActive : ""} ${!isMapExpanded ? styles.mapIconButtonDisabled : ""}`}
                aria-label="Marcadores"
                onClick={() => {
                  if (!isMapExpanded) return;
                  setIsMarkersModalOpen((prev) => !prev);
                }}
                disabled={!isMapExpanded}
              >
                <img
                  src="/assets/img/svg/map-marker-edit-svgrepo-com.svg"
                  alt=""
                  aria-hidden="true"
                  className={styles.mapIconSvg}
                />
              </button>
            </div>

            {isMapExpanded && isSubzonasPanelOpen ? (
              <aside className={styles.subzonasPanel} aria-label="Filtro de zona y subzonas">
                <header className={styles.subzonasPanelHeader}>
                  <h4>Subzonas</h4>
                  <span>{selectedZonaPrimaria ? selectedZonaPrimaria : "Sin zona seleccionada"}</span>
                </header>
                {geoJsonSubzonasError ? <p className={styles.subzonasPanelMessage}>{geoJsonSubzonasError}</p> : null}
                {loadingGeoJsonSubzonas ? <p className={styles.subzonasPanelMessage}>Cargando polígonos...</p> : null}
                <SubzonaChecklist
                  subzonas={subzonas}
                  selectedIds={subzonasSeleccionadas}
                  onToggle={toggleSubzonaSeleccionada}
                  onSelectAll={selectAllSubzonas}
                  onClearAll={clearAllSubzonas}
                  loading={loadingSubzonas}
                  error={subzonasError}
                  disabled={!selectedZonaPrimaria}
                  hideToolbar
                />
              </aside>
            ) : null}

            {!mapReady && !mapError ? <div className={styles.mapStatus}>Cargando mapa...</div> : null}
            {mapError ? <div className={styles.mapStatus}>{mapError}</div> : null}
            {isMapExpanded ? (
              <button
                type="button"
                className={`${styles.projectsSidebarToggle} ${isProjectsSidebarOpen ? styles.projectsSidebarToggleOpen : styles.projectsSidebarToggleClosed}`}
                aria-label={isProjectsSidebarOpen ? "Ocultar sidebar de proyectos" : "Mostrar sidebar de proyectos"}
                onClick={() => setIsProjectsSidebarOpen((prev) => !prev)}
              >
                {isProjectsSidebarOpen ? ">" : "<"}
              </button>
            ) : null}

            {isMapExpanded && isProjectsSidebarOpen ? (
              <LifestyleMatcherProjectsSidebar
                loadingProperties={loadingProperties}
                propertiesError={propertiesError}
                totalCards={totalCards}
                paginatedMarkerCards={paginatedMarkerCards}
                totalSidebarPages={totalSidebarPages}
                sidebarPage={sidebarPage}
                onPrevPage={() => setSidebarPage((prev) => Math.max(1, prev - 1))}
                onNextPage={() => setSidebarPage((prev) => Math.min(totalSidebarPages, prev + 1))}
                showPagination={totalCards > SIDEBAR_PAGE_SIZE}
              />
            ) : null}
          </main>
        </div>

        <footer className={styles.footerArea}>
          <small>Todos los cambios se guardan automáticamente</small>
          {!isMapExpanded ? (
            <div className={styles.footerActions}>
              <Link href="/enterprise/lifestyle-matcher" className={styles.prevBtn}>
                ← Anterior
              </Link>
              <button type="button" className={styles.nextBtn} onClick={handleCreateIsochrone} disabled={isoSubmitting}>
                {isoSubmitting ? "Generando..." : "Crear Isochrone"}
              </button>
            </div>
          ) : null}
        </footer>
      </div>

      {isMapTypeModalOpen ? (
        <div className={styles.mapTypeModalOverlay} onClick={() => setIsMapTypeModalOpen(false)}>
          <div
            className={styles.mapTypeModalCard}
            role="dialog"
            aria-modal="true"
            aria-label="Tipo de mapa"
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.mapTypeModalHeader}>
              <h4>Tipo de mapa</h4>
              <button type="button" onClick={() => setIsMapTypeModalOpen(false)}>
                Cerrar
              </button>
            </header>
            <div className={styles.mapTypeModalOptions}>
              <button
                type="button"
                className={mapType === "vegetacion" ? styles.mapTypeOptionActive : styles.mapTypeOption}
                onClick={() => setMapType("vegetacion")}
              >
                Vegetacion
              </button>
              <button
                type="button"
                className={mapType === "terrain" ? styles.mapTypeOptionActive : styles.mapTypeOption}
                onClick={() => setMapType("terrain")}
              >
                Relieve
              </button>
              <button
                type="button"
                className={mapType === "satellite" ? styles.mapTypeOptionActive : styles.mapTypeOption}
                onClick={() => setMapType("satellite")}
              >
                Satelital
              </button>
              <button
                type="button"
                className={mapType === "hybrid" ? styles.mapTypeOptionActive : styles.mapTypeOption}
                onClick={() => setMapType("hybrid")}
              >
                Hibrido
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isMapExpanded && isMarkersModalOpen ? (
        <div className={styles.markersModalOverlay} onClick={() => setIsMarkersModalOpen(false)}>
          <div
            className={styles.markersModalCard}
            role="dialog"
            aria-modal="true"
            aria-label="Marcadores"
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.markersModalHeader}>
              <div>
                <h4>Marcadores</h4>
                <p>Elige qué grupo de marcadores deseas visualizar.</p>
              </div>
              <button type="button" onClick={() => setIsMarkersModalOpen(false)}>
                Cerrar
              </button>
            </header>

            <section className={styles.markersSection}>
              <div className={styles.markersLayerToggle}>
                <button
                  type="button"
                  className={markersPanelView === "google" ? styles.markersLayerToggleActive : ""}
                  onClick={() => setMarkersPanelView("google")}
                >
                  Google
                </button>
                <button
                  type="button"
                  className={markersPanelView === "housing" ? styles.markersLayerToggleActive : ""}
                  onClick={() => setMarkersPanelView("housing")}
                >
                  Vivienda
                </button>
                <button
                  type="button"
                  className={markersPanelView === "additional" ? styles.markersLayerToggleActive : ""}
                  onClick={() => setMarkersPanelView("additional")}
                >
                  Adicionales
                </button>
              </div>
            </section>

            {markersPanelView === "google" ? (
              <section className={styles.markersSection}>
              <h5 className={styles.markersSectionTitle}>Marcadores de Google</h5>
              <div className={styles.markersQuickActions}>
                <button type="button" onClick={() => setMarkerCategoryVisibility({ ...DEFAULT_MARKER_CATEGORY_STATE })}>
                  Mostrar todo
                </button>
                <button type="button" onClick={() => setMarkerCategoryVisibility({ ...HIDDEN_MARKER_CATEGORY_STATE })}>
                  Ocultar todo
                </button>
              </div>
              <div className={styles.markersCategoryList}>
                <label className={styles.markersCategoryItem}>
                  <input
                    type="checkbox"
                    checked={Boolean(markerCategoryVisibility["all-poi"])}
                    onChange={(event) => {
                      const nextValue = event.target.checked;
                      const next = { ...markerCategoryVisibility };
                      (Object.keys(next) as Array<keyof MarkerCategoryVisibilityState>).forEach((key) => {
                        next[key] = nextValue;
                      });
                      setMarkerCategoryVisibility(next);
                    }}
                  />
                  <span>Google</span>
                </label>
                {DEFAULT_MARKER_CATEGORIES.filter((category) => category.key !== "all-poi").map((category) => (
                  <label key={category.key} className={styles.markersCategoryItem}>
                    <input
                      type="checkbox"
                      checked={Boolean(markerCategoryVisibility[category.key])}
                      onChange={(event) =>
                        setMarkerCategoryVisibility((prev) => {
                          const next = {
                            ...prev,
                            [category.key]: event.target.checked,
                          };
                          const allEnabled = DEFAULT_MARKER_CATEGORIES.filter((item) => item.key !== "all-poi").every(
                            (item) => next[item.key]
                          );
                          next["all-poi"] = allEnabled;
                          return next;
                        })
                      }
                    />
                    <span>{category.label}</span>
                  </label>
                ))}
              </div>
              </section>
            ) : null}

            {markersPanelView === "housing" ? (
              <section className={styles.markersSection}>
              <h5 className={styles.markersSectionTitle}>Marcadores de vivienda</h5>
              <div className={styles.markersQuickActions}>
                <button type="button" onClick={() => setSelectedHousingCategories(new Set(availableHousingCategories))}>
                  Mostrar todo
                </button>
                <button type="button" onClick={() => setSelectedHousingCategories(new Set())}>
                  Ocultar todo
                </button>
              </div>
              <HousingPeriodFilter value={housingPeriodFilter} onChange={setHousingPeriodFilter} />
              <div className={styles.markersCategoryList}>
                {availableHousingCategories.length === 0 ? (
                  <p className={styles.markersModeMessage}>Sin categorias disponibles</p>
                ) : (
                  availableHousingCategories.map((category) => (
                    <label key={category} className={styles.markersCategoryItem}>
                      <input
                        type="checkbox"
                        checked={Boolean(selectedHousingCategories.has(category))}
                        onChange={(event) =>
                          setSelectedHousingCategories((previous) => {
                            const next = new Set(previous);
                            if (event.target.checked) next.add(category);
                            else next.delete(category);
                            return next;
                          })
                        }
                      />
                      <span>{HOUSING_MARKER_GROUPS.find((item) => item.key === category)?.label ?? category}</span>
                    </label>
                  ))
                )}
              </div>
              </section>
            ) : null}

            {markersPanelView === "additional" ? (
              <section className={styles.markersSection}>
              <h5 className={styles.markersSectionTitle}>Marcadores adicionales</h5>
              <div className={styles.markersQuickActions}>
                <button
                  type="button"
                  onClick={() => setAdditionalMarkerVisibility({ ...DEFAULT_ADDITIONAL_MARKER_VISIBILITY_STATE })}
                >
                  Mostrar todo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAdditionalMarkerVisibility({
                      points: false,
                      isochrones: false,
                      subzonas: false,
                      comercios: false,
                    })
                  }
                >
                  Ocultar todo
                </button>
              </div>
              <div className={styles.markersCategoryList}>
                <label className={styles.markersCategoryItem}>
                  <input
                    type="checkbox"
                    checked={Boolean(additionalMarkerVisibility.points)}
                    onChange={(event) =>
                      setAdditionalMarkerVisibility((prev) => ({ ...prev, points: event.target.checked }))
                    }
                  />
                  <span>Puntos seleccionados</span>
                </label>
                <label className={styles.markersCategoryItem}>
                  <input
                    type="checkbox"
                    checked={Boolean(additionalMarkerVisibility.isochrones)}
                    onChange={(event) =>
                      setAdditionalMarkerVisibility((prev) => ({ ...prev, isochrones: event.target.checked }))
                    }
                  />
                  <span>Isocronas</span>
                </label>
                <label className={styles.markersCategoryItem}>
                  <input
                    type="checkbox"
                    checked={Boolean(additionalMarkerVisibility.subzonas)}
                    onChange={(event) =>
                      setAdditionalMarkerVisibility((prev) => ({ ...prev, subzonas: event.target.checked }))
                    }
                  />
                  <span>Subzonas</span>
                </label>
                <label className={styles.markersCategoryItem}>
                  <input
                    type="checkbox"
                    checked={Boolean(additionalMarkerVisibility.comercios)}
                    onChange={(event) =>
                      setAdditionalMarkerVisibility((prev) => ({ ...prev, comercios: event.target.checked }))
                    }
                  />
                  <span>Comercios</span>
                </label>
              </div>
              </section>
            ) : null}
          </div>
        </div>
      ) : null}

      {isToolsModalOpen ? (
        <aside className={styles.isoSubmenuPanel} aria-label="Submenu ISO">
          <header className={styles.isoSubmenuHeader}>
            <div>
              <h4>Isocrona</h4>
              <p>Configura perfiles, contornos y estilo de cobertura.</p>
            </div>
            <button
              type="button"
              className={styles.isoSubmenuCloseBtn}
              onClick={() => {
                setIsToolsModalOpen(false);
                setIsoRequestError(null);
              }}
            >
              Cerrar
            </button>
          </header>

          <section className={styles.isoSection}>
            <span className={styles.isoSectionLabel}>Perfiles</span>
            <div className={styles.isoSegmented}>
              <button
                type="button"
                className={isoTrafficProfile === "sin-trafico" ? styles.isoSegmentActive : styles.isoSegmentInactive}
                onClick={() => setIsoTrafficProfile("sin-trafico")}
              >
                sin trafico
              </button>
              <button
                type="button"
                className={isoTrafficProfile === "con-trafico" ? styles.isoSegmentActive : styles.isoSegmentInactive}
                onClick={() => setIsoTrafficProfile("con-trafico")}
              >
                con trafico
              </button>
            </div>
          </section>

          <section className={styles.isoSection}>
            <span className={styles.isoSectionLabel}>Tipo de Calculo</span>
            <div className={styles.isoSegmented}>
              <button
                type="button"
                className={isoContourUnit === "meters" ? styles.isoSegmentActive : styles.isoSegmentInactive}
                onClick={() => setIsoContourUnit("meters")}
              >
                Metros
              </button>
              <button
                type="button"
                className={isoContourUnit === "hibrido" ? styles.isoSegmentActive : styles.isoSegmentInactive}
                onClick={() => setIsoContourUnit("hibrido")}
              >
                Hibrido
              </button>
              <button
                type="button"
                className={isoContourUnit === "calculada" ? styles.isoSegmentActive : styles.isoSegmentInactive}
                onClick={() => setIsoContourUnit("calculada")}
              >
                Calculada
              </button>
            </div>
          </section>

          {isoContourUnit === "meters" ? (
            <section className={styles.isoSection}>
              <span className={styles.isoSectionLabel}>Distancia (metros)</span>
              <select value={isoMetersPreset} onChange={(event) => setIsoMetersPreset(event.target.value)}>
                <option value="3000">3,000 m</option>
                <option value="5000">5,000 m</option>
                <option value="10000">10,000 m</option>
                <option value="15000">15,000 m</option>
                <option value="intervalos-5000">Intervalos de 5000 (5k,10k,15k,20k)</option>
              </select>
              <label>
                <span>Hora de salida (opcional)</span>
                <input type="datetime-local" value={isoDepartAt} onChange={(event) => setIsoDepartAt(event.target.value)} />
              </label>
            </section>
          ) : null}

          {isoContourUnit === "hibrido" ? (
            <section className={styles.isoSectionGrid}>
              <label>
                <span>Tiempo (min)</span>
                <select value={isoHybridMinutes} onChange={(event) => setIsoHybridMinutes(Number(event.target.value))}>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={45}>45</option>
                  <option value={60}>60</option>
                </select>
              </label>
              {isoTrafficProfile !== "con-trafico" ? (
                <label>
                  <span>Velocidad (km/h)</span>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={isoSpeedKmh}
                    onChange={(event) => setIsoSpeedKmh(Number(event.target.value))}
                  />
                </label>
              ) : null}
              <label>
                <span>Distancia (m)</span>
                <select value={isoHybridMeters} onChange={(event) => setIsoHybridMeters(Number(event.target.value))}>
                  <option value={3000}>3,000</option>
                  <option value={5000}>5,000</option>
                  <option value={10000}>10,000</option>
                  <option value={15000}>15,000</option>
                </select>
              </label>
              <label>
                <span>Hora de salida (opcional)</span>
                <input type="datetime-local" value={isoDepartAt} onChange={(event) => setIsoDepartAt(event.target.value)} />
              </label>
            </section>
          ) : null}

          {isoContourUnit === "calculada" ? (
            <section className={styles.isoSectionGrid}>
              {isoTrafficProfile === "con-trafico" ? (
                <>
                  <label>
                    <span>Minutos de trafico</span>
                    <select value={isoTrafficMinutes} onChange={(event) => setIsoTrafficMinutes(Number(event.target.value))}>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                      <option value={45}>45</option>
                      <option value={60}>60</option>
                    </select>
                  </label>
                  <label>
                    <span>Hora de salida (opcional)</span>
                    <input type="datetime-local" value={isoDepartAt} onChange={(event) => setIsoDepartAt(event.target.value)} />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    <span>Tiempo calculo (min)</span>
                    <select value={isoCalculatedMinutesPreset} onChange={(event) => setIsoCalculatedMinutesPreset(event.target.value)}>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                      <option value="60">60</option>
                      <option value="intervalos-15">Intervalos de 15 minutos (15,30,45,60)</option>
                    </select>
                  </label>
                  <label>
                    <span>Velocidad (km/h)</span>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={isoSpeedKmh}
                      onChange={(event) => setIsoSpeedKmh(Number(event.target.value))}
                    />
                  </label>
                </>
              )}
            </section>
          ) : null}

          <section className={styles.isoSection}>
            <span className={styles.isoSectionLabel}>Estilos</span>
            <select value={isoStyleOption} onChange={(event) => setIsoStyleOption(event.target.value as IsoStyleOption)}>
              <option value="basica">basica</option>
              <option value="segunda-opcion">segunda opcion</option>
              <option value="tercera-opcion">tercera opcion</option>
            </select>
          </section>

          {isoRequestError ? <div className={styles.toolsModalError}>{isoRequestError}</div> : null}

          <div className={styles.isoActions}>
            <button type="button" className={styles.isoPrimaryBtn} onClick={handleCreateIsochrone} disabled={isoSubmitting}>
              {isoSubmitting ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </aside>
      ) : null}

      <EnterpriseMobileBottomNav activeTab="analysis" />
    </section>
  );
}
