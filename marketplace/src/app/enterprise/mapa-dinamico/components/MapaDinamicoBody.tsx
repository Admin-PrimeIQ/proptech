"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./MapaDinamicoBody.module.scss";
import MapContainer from "@/components/Map/MapContainer";
import SubzonaAutocomplete from "@/components/Enterprise/SubzonaAutocomplete";
import SubzonaChecklist, { type SubzonaChecklistItem } from "@/components/Enterprise/SubzonaChecklist";

const SIDEBAR_PAGE_SIZE = 4;
const DEFAULT_ZONA_FALLBACK_CANDIDATES = ["Zona 10", "Z10", "10", "zona 10", "z10"];

type FeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    id?: string;
    geometry: unknown;
    properties?: Record<string, unknown>;
  }>;
};

type FeatureItem = FeatureCollection["features"][number];

type MarkerCardItem = {
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

function parseOptionalNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatInteger(value: unknown): string {
  const parsed = parseOptionalNumber(value);
  if (parsed === null) return "N/D";
  return Math.round(parsed).toLocaleString("es-GT");
}

function formatPrecioPromedioM2(value: unknown): string {
  const parsed = parseOptionalNumber(value);
  if (parsed === null) return "N/D";
  return parsed.toLocaleString("es-GT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function readFirstString(properties: Record<string, unknown>, keys: string[], fallback = "N/D"): string {
  for (const key of keys) {
    const raw = properties[key];
    if (raw === null || raw === undefined) continue;
    const text = String(raw).trim();
    if (text.length > 0) return text;
  }
  return fallback;
}

function deriveIncidentsFromProperties(properties: Record<string, unknown>): number {
  const byIncidents = Number(properties.incidents);
  if (Number.isFinite(byIncidents)) return byIncidents;

  const codigoSubzona = String(properties.codigoSubzona ?? "");
  const subzonaMatch = codigoSubzona.match(/_(\d{1,3})$/);
  if (subzonaMatch) {
    const value = Number(subzonaMatch[1]);
    if (Number.isFinite(value)) return value;
  }

  const byZona = Number(properties.zona);
  if (Number.isFinite(byZona)) return byZona;

  const zonaPrimaria = String(properties.zonaPrimaria ?? "");
  const zoneMatch = zonaPrimaria.match(/^Z(\d{1,2})$/i);
  if (zoneMatch) return Number(zoneMatch[1]);

  const byOrigenFid = Number(properties.origenFid);
  if (Number.isFinite(byOrigenFid)) return byOrigenFid;

  return 0;
}

function buildMarkerFeatureKey(feature: FeatureItem, index: number): string {
  const properties = (feature.properties ?? {}) as Record<string, unknown>;
  const geometry = (feature.geometry ?? {}) as { coordinates?: unknown };
  const coordinates = Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
  const lon = coordinates.length > 0 ? String(coordinates[0]) : "lon";
  const lat = coordinates.length > 1 ? String(coordinates[1]) : "lat";

  const stableId = String(
    feature.id ??
      properties.idPublic ??
      properties.id ??
      properties.proyectoId ??
      properties.nombreProyecto ??
      properties.proyecto ??
      `idx-${index}`
  ).trim();

  return `${stableId}-${lon}-${lat}`;
}

function mergeMarkerCollections(collections: FeatureCollection[]): FeatureCollection {
  const seen = new Set<string>();
  const merged: FeatureItem[] = [];

  for (const collection of collections) {
    for (let index = 0; index < collection.features.length; index += 1) {
      const feature = collection.features[index];
      const key = buildMarkerFeatureKey(feature, index);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(feature);
    }
  }

  return {
    type: "FeatureCollection",
    features: merged,
  };
}

export default function MapaDinamicoBody() {
  const [drawShape, setDrawShape] = useState<"polygon" | "circle">("polygon");
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const [markersGeoJson, setMarkersGeoJson] = useState<FeatureCollection | null>(null);
  const [figureGeoJsons, setFigureGeoJsons] = useState<object[]>([]);
  const [activePolygonDraftGeoJson, setActivePolygonDraftGeoJson] = useState<object | null>(null);
  const [loadingGeoJson, setLoadingGeoJson] = useState(false);
  const [geoJsonError, setGeoJsonError] = useState<string | null>(null);
  const [selectedZonaPrimaria, setSelectedZonaPrimaria] = useState<string | null>(null);
  const [subzonas, setSubzonas] = useState<SubzonaChecklistItem[]>([]);
  const [subzonasSeleccionadas, setSubzonasSeleccionadas] = useState<Set<string>>(new Set());
  const [loadingSubzonas, setLoadingSubzonas] = useState(false);
  const [subzonasError, setSubzonasError] = useState<string | null>(null);
  const [markerCategories, setMarkerCategories] = useState<string[]>([]);
  const [selectedMarkerCategories, setSelectedMarkerCategories] = useState<Set<string>>(new Set());
  const [loadingMarkerCategories, setLoadingMarkerCategories] = useState(false);
  const [markerCategoriesError, setMarkerCategoriesError] = useState<string | null>(null);
  const [sidebarPage, setSidebarPage] = useState(1);
  const markersRequestIdRef = useRef(0);

  useEffect(() => {
    let active = true;

    const loadMarkerCategories = async () => {
      try {
        setLoadingMarkerCategories(true);
        setMarkerCategoriesError(null);

        const res = await fetch("/api/housing-universe/categories", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload?.error || "No se pudieron cargar categorias de marcadores.");
        }

        const payload = await res.json();
        if (!active) return;

        const rows = Array.isArray(payload?.data) ? payload.data : [];
        const categories = rows
          .map((row: unknown) => String(row ?? "").trim())
          .filter((row: string) => row.length > 0);

        setMarkerCategories(categories);
        setSelectedMarkerCategories(new Set(categories));
      } catch (err: unknown) {
        if (!active) return;
        setMarkerCategories([]);
        setSelectedMarkerCategories(new Set());
        setMarkerCategoriesError(err instanceof Error ? err.message : "Error desconocido cargando categorias.");
      } finally {
        if (active) setLoadingMarkerCategories(false);
      }
    };

    loadMarkerCategories();

    return () => {
      active = false;
    };
  }, []);

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
          idPublic: String(row.idPublic ?? ""),
          nombreSubzona: String(row.nombreDescriptivo ?? row.nombre ?? row.codigoSubzona ?? "Subzona"),
          zonaPrimaria: row.zonaPrimaria ? String(row.zonaPrimaria) : null,
        }));

        setSubzonas(mapped);
        setSubzonasSeleccionadas(new Set(mapped.map((item) => item.idPublic)));
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
      setGeoJson(null);
      setLoadingGeoJson(false);
      setGeoJsonError(null);
      return;
    }

    let active = true;

    const loadGeoJson = async () => {
      try {
        setLoadingGeoJson(true);
        setGeoJsonError(null);

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

        if (payload?.type !== "FeatureCollection" || !Array.isArray(payload?.features)) {
          throw new Error("La respuesta del backend no es un FeatureCollection válido.");
        }

        const normalizedFeatures = (payload as FeatureCollection).features.map((feature) => {
          const props = (feature.properties ?? {}) as Record<string, unknown>;
          return {
            ...feature,
            properties: {
              ...props,
              incidents: deriveIncidentsFromProperties(props),
            },
          };
        });

        setGeoJson({
          ...(payload as FeatureCollection),
          features: normalizedFeatures,
        });
      } catch (err: unknown) {
        if (!active) return;
        setGeoJsonError(err instanceof Error ? err.message : "Error desconocido cargando subzonas.");
      } finally {
        if (active) setLoadingGeoJson(false);
      }
    };

    loadGeoJson();
    return () => {
      active = false;
    };
  }, [selectedZonaPrimaria]);

  const geoJsonFiltrado = useMemo<FeatureCollection | null>(() => {
    if (!geoJson) return null;
    if (!selectedZonaPrimaria) return null;
    if (!subzonas.length) return null;

    const features = geoJson.features.filter((feature) => {
      const props = (feature.properties ?? {}) as Record<string, unknown>;
      const idPublic = String(props.idPublic ?? "");
      return subzonasSeleccionadas.has(idPublic);
    });

    return {
      ...geoJson,
      features,
    };
  }, [geoJson, selectedZonaPrimaria, subzonas, subzonasSeleccionadas]);

  const fetchMarkersByGeoJson = useCallback(async (inputGeoJson: object) => {
    const res = await fetch("/api/housing-universe/geojson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        geojson: inputGeoJson,
      }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload?.error || "No se pudieron filtrar marcadores.");
    }

    const payload = await res.json();
    if (payload?.type !== "FeatureCollection" || !Array.isArray(payload?.features)) {
      throw new Error("La respuesta de marcadores no es un FeatureCollection valido.");
    }

    return payload as FeatureCollection;
  }, []);

  const fetchDefaultZonaMarkers = useCallback(async () => {
    let lastError: string | null = null;

    for (const zonaCandidate of DEFAULT_ZONA_FALLBACK_CANDIDATES) {
      const params = new URLSearchParams();
      params.set("zona", zonaCandidate);
      params.set("limit", "5000");

      const res = await fetch(`/api/housing-universe/geojson?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        lastError = payload?.error || `No se pudo cargar zona fallback ${zonaCandidate}.`;
        continue;
      }

      const payload = await res.json();
      const collection = (payload?.data ?? payload) as FeatureCollection;
      if (collection?.type !== "FeatureCollection" || !Array.isArray(collection?.features)) {
        lastError = "La respuesta de marcadores por defecto no es un FeatureCollection valido.";
        continue;
      }

      if (collection.features.length > 0) {
        return collection;
      }
    }

    throw new Error(lastError || "No se encontraron marcadores para las variantes de Zona 10.");
  }, []);

  const getSelectionGeoJson = useCallback(() => {
    if (!selectedZonaPrimaria) return null;
    if (loadingGeoJson) return null;
    if (geoJsonError) return null;
    if (!geoJson) return null;
    if (subzonasSeleccionadas.size === 0) return null;

    const payload = geoJsonFiltrado ?? geoJson;
    const features = Array.isArray(payload?.features) ? payload.features : [];

    if (features.length === 0) return null;
    return payload;
  }, [
    selectedZonaPrimaria,
    loadingGeoJson,
    geoJsonError,
    geoJson,
    subzonasSeleccionadas,
    geoJsonFiltrado,
  ]);

  const figureGeoJsonList = useMemo<object[]>(() => {
    if (!activePolygonDraftGeoJson) return figureGeoJsons;
    return [...figureGeoJsons, activePolygonDraftGeoJson];
  }, [figureGeoJsons, activePolygonDraftGeoJson]);

  const handleGeoJsonCreate = useCallback(
    (payload: object | null, error?: string) => {
      if (error) {
        // Mantiene la(s) figura(s) previa(s) cuando el dibujo aun no esta completo.
        return;
      }

      if (!payload) {
        setFigureGeoJsons([]);
        setActivePolygonDraftGeoJson(null);
        return;
      }

      const payloadRecord = payload as {
        geometry?: { type?: string };
        properties?: Record<string, unknown>;
      };
      const geometryType = String(payloadRecord.geometry?.type ?? "").toLowerCase();
      const hasRadius = Number.isFinite(Number(payloadRecord.properties?.radius));
      const isCircleShape = hasRadius || geometryType === "point";

      if (!isCircleShape) {
        setActivePolygonDraftGeoJson(payload);
        return;
      }

      const serializedPayload = JSON.stringify(payload);
      setFigureGeoJsons((previous) => {
        if (previous.some((item) => JSON.stringify(item) === serializedPayload)) return previous;
        return [...previous, payload];
      });
    },
    []
  );

  const handleObtenerDashboard = () => {
    // El boton queda para flujos internos futuros.
  };

  useEffect(() => {
    const selectionGeoJson = getSelectionGeoJson();
    const shouldLoadDefaultZona10 = figureGeoJsonList.length === 0 && !selectionGeoJson;

    const requestId = markersRequestIdRef.current + 1;
    markersRequestIdRef.current = requestId;

    let active = true;
    const run = async () => {
      try {
        const markerCollections: FeatureCollection[] = [];

        if (figureGeoJsonList.length > 0) {
          const figuresMarkers = await Promise.all(
            figureGeoJsonList.map((figureGeoJson) => fetchMarkersByGeoJson(figureGeoJson))
          );
          markerCollections.push(...figuresMarkers);
        }

        if (selectionGeoJson) {
          const selectionMarkers = await fetchMarkersByGeoJson(selectionGeoJson);
          markerCollections.push(selectionMarkers);
        }

        if (markerCollections.length === 0 && shouldLoadDefaultZona10) {
          markerCollections.push(await fetchDefaultZonaMarkers());
        }

        if (markerCollections.length === 0) {
          setMarkersGeoJson(null);
          return;
        }

        const result = mergeMarkerCollections(markerCollections);

        if (!active || requestId !== markersRequestIdRef.current) return;
        setMarkersGeoJson(result);
      } catch (markerError: unknown) {
        if (!active || requestId !== markersRequestIdRef.current) return;
        setMarkersGeoJson(null);
        console.error("Error actualizando marcadores:", markerError);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [figureGeoJsonList, selectedZonaPrimaria, getSelectionGeoJson, fetchMarkersByGeoJson, fetchDefaultZonaMarkers]);

  const markersGeoJsonFiltrado = useMemo<FeatureCollection | null>(() => {
    if (!markersGeoJson) return null;
    if (markerCategories.length === 0) {
      return markersGeoJson;
    }
    if (selectedMarkerCategories.size === 0) {
      return {
        ...markersGeoJson,
        features: [],
      };
    }

    const features = markersGeoJson.features.filter((feature) => {
      const category = String((feature.properties ?? {}).categoria ?? "").trim();
      if (!category) return false;
      return selectedMarkerCategories.has(category);
    });

    return {
      ...markersGeoJson,
      features,
    };
  }, [markersGeoJson, markerCategories, selectedMarkerCategories]);

  const shouldRenderMapMarkers = useMemo(() => {
    if (figureGeoJsonList.length > 0) return true;
    return Boolean(getSelectionGeoJson());
  }, [figureGeoJsonList, getSelectionGeoJson]);

  const markerCards = useMemo<MarkerCardItem[]>(() => {
    const features = markersGeoJsonFiltrado?.features ?? [];

    return features.map((feature, index) => {
      const properties = (feature.properties ?? {}) as Record<string, unknown>;
      const geometry = (feature.geometry ?? {}) as { coordinates?: unknown };
      const coordinates = Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
      const lon = coordinates.length > 0 ? String(coordinates[0]) : "lon";
      const lat = coordinates.length > 1 ? String(coordinates[1]) : "lat";

      const nombreProyecto = readFirstString(properties, ["nombreProyecto", "proyecto"], "Proyecto sin nombre");
      const departamento = readFirstString(properties, ["departamento"]);
      const municipio = readFirstString(properties, ["municipio"]);
      const desarrollador = readFirstString(properties, ["nombreDesarrollador", "desarrollador"]);
      const estado = readFirstString(properties, ["estado"]);
      const categoria = readFirstString(properties, ["categoria"]);
      const uso = readFirstString(properties, ["uso"], "");
      const imagen = readFirstString(properties, ["imagen", "urlImagen"], "");
      const totalM2 = formatInteger(
        properties.totalM2 ??
          properties.total_m2 ??
          properties.areaM2 ??
          properties.area_m2 ??
          properties.metrosCuadrados ??
          null
      );
      const parqueos = formatInteger(properties.parqueos ?? null);
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
  }, [markersGeoJsonFiltrado]);

  const totalCards = markerCards.length;
  const totalSidebarPages = Math.max(1, Math.ceil(totalCards / SIDEBAR_PAGE_SIZE));

  useEffect(() => {
    setSidebarPage(1);
  }, [selectedZonaPrimaria, figureGeoJsonList, selectedMarkerCategories, markersGeoJsonFiltrado]);

  useEffect(() => {
    if (sidebarPage <= totalSidebarPages) return;
    setSidebarPage(totalSidebarPages);
  }, [sidebarPage, totalSidebarPages]);

  const paginatedMarkerCards = useMemo(() => {
    const start = (sidebarPage - 1) * SIDEBAR_PAGE_SIZE;
    const end = start + SIDEBAR_PAGE_SIZE;
    return markerCards.slice(start, end);
  }, [markerCards, sidebarPage]);

  const sidebarContent = (
    <section className={styles.resultsPanel}>
      <div className={styles.resultsBody}>
        <div className={styles.cardsGrid}>
          {totalCards === 0 ? (
            <article className={styles.emptyStateCard}>
              <p>No hay proyectos para los marcadores visibles.</p>
            </article>
          ) : (
            paginatedMarkerCards.map((card) => (
              <article key={card.key} className={styles.propertyCard} aria-label={`Proyecto ${card.nombreProyecto}`}>
                <div className={styles.cardThumb}>
                  {card.imagen ? <img src={card.imagen} alt={card.nombreProyecto} loading="lazy" /> : null}
                  {card.uso ? <span>{card.uso}</span> : null}
                </div>

                <div className={styles.cardBody}>
                  <h4 className={styles.cardProjectName}>{card.nombreProyecto}</h4>
                  <div className={styles.cardLocationRow}>
                    <p className={styles.cardLocationText}>{`${card.departamento}, ${card.municipio}`}</p>
                    {card.desarrollador !== "N/D" ? <span className={styles.cardFigure}>{card.desarrollador}</span> : null}
                  </div>

                  <ul>
                    <li>{`Total m2 ${card.totalM2}`}</li>
                    <li>{`parqueos ${card.parqueos}`}</li>
                    <li>{card.categoria}</li>
                    <li>{card.estado}</li>
                  </ul>

                  <div className={styles.cardFooter}>
                    <strong>{`Precio prom ${card.precioPromedioM2}`}</strong>
                    <small>/m2</small>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        {totalCards > 0 ? (
          <div className={styles.sidebarPagination}>
            <div className={styles.sidebarPaginationControls}>
              <button
                type="button"
                onClick={() => setSidebarPage((prev) => Math.max(1, prev - 1))}
                disabled={sidebarPage <= 1}
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setSidebarPage((prev) => Math.min(totalSidebarPages, prev + 1))}
                disabled={sidebarPage >= totalSidebarPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );

  const markerMenuContent = (
    <div className={styles.markerTypeMenuPanel}>
      <h5>Marcadores</h5>
      {loadingMarkerCategories ? <p>Cargando categorias...</p> : null}
      {!loadingMarkerCategories && markerCategoriesError ? <p>{markerCategoriesError}</p> : null}
      {!loadingMarkerCategories && !markerCategoriesError && markerCategories.length === 0 ? (
        <p>Sin categorias disponibles</p>
      ) : null}
      {!loadingMarkerCategories && !markerCategoriesError
        ? markerCategories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                checked={selectedMarkerCategories.has(category)}
                onChange={() => {
                  setSelectedMarkerCategories((previous) => {
                    const next = new Set(previous);
                    if (next.has(category)) next.delete(category);
                    else next.add(category);
                    return next;
                  });
                }}
              />{" "}
              {category}
            </label>
          ))
        : null}
    </div>
  );

  const barsMenuContent = (
    <div className={styles.markerSubmenuPanel}>
      <h5>Subzonas</h5>
      <div className={styles.markerSubzonaList}>
        <SubzonaChecklist
          subzonas={subzonas}
          selectedIds={subzonasSeleccionadas}
          loading={loadingSubzonas}
          error={subzonasError}
          disabled={!selectedZonaPrimaria}
          hideToolbar
          onToggle={(idPublic) => {
            setSubzonasSeleccionadas((previous) => {
              const next = new Set(previous);
              if (next.has(idPublic)) next.delete(idPublic);
              else next.add(idPublic);
              return next;
            });
          }}
          onSelectAll={() => {
            setSubzonasSeleccionadas(new Set(subzonas.map((item) => item.idPublic)));
          }}
          onClearAll={() => {
            setSubzonasSeleccionadas(new Set());
          }}
        />
      </div>
    </div>
  );

  return (
    <section className={styles.pageArea} aria-label="Mapa interactivo enterprise">
      <div className={styles.pageContainer}>
        <header className={styles.titleRow}>
          <h2>
            Mapa interactivo
          </h2>
        </header>

        <div className={styles.layoutGrid}>
          <article className={styles.mapPanel}>
            <div className={styles.floatingSearch}>
              <SubzonaAutocomplete
                selectedZonaPrimaria={selectedZonaPrimaria}
                onZonaSelected={(zonaPrimaria) => setSelectedZonaPrimaria(zonaPrimaria)}
              />
            </div>

            <MapContainer
              className={styles.mapCanvas}
              drawEnabled={drawEnabled}
              drawShape={drawShape}
              onGeoJsonCreate={handleGeoJsonCreate}
              emitGeoJsonOnDrawChange
              overlayGeoJson={geoJsonFiltrado}
              fitGeoJson={geoJson}
              overlayFitBounds
              overlayRenderer="choropleth"
              markersGeoJson={shouldRenderMapMarkers ? markersGeoJsonFiltrado : null}
              forceMarkersVisible={figureGeoJsonList.length > 0}
              choroplethOptions={{
                valueProperty: "incidents",
                scale: ["#ffd6d6", "#b30000"],
                steps: 5,
                mode: "q",
                style: {
                  color: "#6f42c1",
                  weight: 2.5,
                  fillOpacity: 0.25,
                },
              }}
              sidebarEnabled
              sidebarPosition="right"
              sidebarDefaultVisible={false}
              sidebarContent={sidebarContent}
              easyButtonEnabled
              easyButtonPosition="topleft"
              onDrawControlChange={(shape, enabled) => {
                const isLeavingPolygonMode =
                  drawEnabled &&
                  drawShape === "polygon" &&
                  (!enabled || shape !== "polygon");

                if (isLeavingPolygonMode && activePolygonDraftGeoJson) {
                  const serializedPayload = JSON.stringify(activePolygonDraftGeoJson);
                  setFigureGeoJsons((previous) => {
                    if (previous.some((item) => JSON.stringify(item) === serializedPayload)) return previous;
                    return [...previous, activePolygonDraftGeoJson];
                  });
                  setActivePolygonDraftGeoJson(null);
                }

                setDrawShape(shape === "polyline" ? "polygon" : shape);
                setDrawEnabled(enabled);
              }}
              markerMenuContent={markerMenuContent}
              barsMenuContent={barsMenuContent}
            />

            <div className={styles.floatingDashboard}>
              <button
                type="button"
                className={styles.filterAction}
                onClick={handleObtenerDashboard}
              >
                Obtener Dashboard
              </button>
            </div>
          </article>
        </div>
      </div>

    </section>
  );
}
