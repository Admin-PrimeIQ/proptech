"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import type { SelectedPoint } from "../services/lifestyleMatcherPoints.service";
import { fetchNearbyPrioritySuggestions } from "../services/priorityPlaceSuggestions.service";
import { isPriorityTitleWithoutPlaceSuggestions } from "../services/priorityPlaceSuggestions.policy";
import { PRIORITY_PLACE_SUGGESTION_RADIUS_METERS } from "./lifestyleMatcherPoints.constants";
import { resolveSuggestionSearchCenterDetail, type LatLng } from "./prioritySuggestionCenter";
import type { GoogleMapLike, GoogleMarkerLike, GoogleMapsGlobal, PriorityPlaceSuggestion } from "./lifestyleMatcherPoints.types";

type Params = {
  mapReady: boolean;
  pointToPinId: string | null;
  selectedPoints: SelectedPoint[];
  pointLocations: Record<string, { lat: number; lng: number }>;
  /** Centro del bbox del GeoJSON de la zona primaria buscada (si aplica). */
  zonaCentroid: LatLng | null;
  mapInstanceRef: RefObject<unknown | null>;
};

export function usePriorityPlaceSuggestions(params: Params) {
  const { mapReady, pointToPinId, selectedPoints, pointLocations, zonaCentroid, mapInstanceRef } = params;
  const [suggestions, setSuggestions] = useState<PriorityPlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCenterDetail = useMemo(
    () => resolveSuggestionSearchCenterDetail({ selectedPoints, pointLocations, zonaCentroid }),
    [selectedPoints, pointLocations, zonaCentroid]
  );
  const center = searchCenterDetail.center;

  const centerKey = `${center.lat.toFixed(5)},${center.lng.toFixed(5)}`;
  const activePoint = useMemo(
    () => (pointToPinId ? selectedPoints.find((p) => p.id === pointToPinId) ?? null : null),
    [pointToPinId, selectedPoints]
  );
  const priorityTitle = activePoint?.title?.trim() ?? "";

  const suggestionsSuppressed = useMemo(
    () => (priorityTitle ? isPriorityTitleWithoutPlaceSuggestions(priorityTitle) : false),
    [priorityTitle]
  );

  const centerLabel = useMemo(() => {
    switch (searchCenterDetail.source) {
      case "firstPinned":
        return "Sugerencias cerca de la primera prioridad fijada (en orden)";
      case "zonaGeoJson":
        return "Sugerencias cerca del centro de la zona seleccionada";
      case "zona1Default":
        return "Sugerencias cerca de Zona 1 (referencia; sin marcador de centro)";
      default:
        return "";
    }
  }, [searchCenterDetail.source]);

  useEffect(() => {
    if (!pointToPinId || !mapReady || !priorityTitle || suggestionsSuppressed) {
      setSuggestions([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const { suggestions: next } = await fetchNearbyPrioritySuggestions({
          lat: center.lat,
          lng: center.lng,
          radiusMeters: PRIORITY_PLACE_SUGGESTION_RADIUS_METERS,
          priorityTitle,
        });
        if (!cancelled) setSuggestions(next);
      } catch (requestError: unknown) {
        if (!cancelled) {
          setSuggestions([]);
          setError(requestError instanceof Error ? requestError.message : "Error al cargar sugerencias.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [pointToPinId, mapReady, priorityTitle, suggestionsSuppressed, centerKey, center.lat, center.lng]);

  useEffect(() => {
    const map = mapInstanceRef.current as GoogleMapLike | null;
    const maybeGoogle = (typeof window !== "undefined" ? (window as unknown as { google?: GoogleMapsGlobal }).google : undefined);
    const MarkerCtor = maybeGoogle?.maps?.Marker;
    const SymbolPath = maybeGoogle?.maps?.SymbolPath;

    if (!mapReady || !map || !MarkerCtor || !pointToPinId || suggestionsSuppressed || suggestions.length === 0) {
      return;
    }

    const placed = new Map<string, GoogleMarkerLike>();

    suggestions.forEach((suggestion) => {
      const icon =
        SymbolPath !== undefined
          ? {
              path: SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#6366f1",
              fillOpacity: 0.95,
              strokeColor: "#ffffff",
              strokeWeight: 1,
            }
          : undefined;

      const marker = new MarkerCtor({
        map,
        position: { lat: suggestion.lat, lng: suggestion.lng },
        title: suggestion.name,
        ...(icon ? { icon } : {}),
        zIndex: 5,
      });
      placed.set(suggestion.placeId, marker);
    });

    return () => {
      placed.forEach((m) => m.setMap(null));
      placed.clear();
    };
  }, [mapReady, mapInstanceRef, pointToPinId, suggestions, suggestionsSuppressed]);

  return {
    suggestions,
    loading,
    error,
    centerLabel,
    center,
    suggestionsSuppressed,
  };
}
