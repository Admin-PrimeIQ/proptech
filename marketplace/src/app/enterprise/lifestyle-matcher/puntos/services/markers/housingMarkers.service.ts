import type { FeatureCollection } from "../../components/lifestyleMatcherPoints.types";
import { fetchMarkerFeatureCollection } from "./markerFetch.shared";
import type { HousingPeriodFilterState } from "../../components/lifestyleMatcherPoints.types";

type HousingPeriodFilters = Pick<HousingPeriodFilterState, "anio" | "trimestre">;

function buildPeriodFilters(periodFilter?: HousingPeriodFilters | null) {
  const anio = periodFilter?.anio ? String(periodFilter.anio).trim() : null;
  const trimestre = periodFilter?.trimestre ? String(periodFilter.trimestre).trim() : null;
  if (!anio && !trimestre) return null;
  return {
    ...(anio ? { anio } : {}),
    ...(trimestre ? { trimestre } : {}),
  };
}

export async function fetchHousingMarkersByGeoJson(
  geojson: object,
  periodFilter?: HousingPeriodFilters | null
): Promise<FeatureCollection> {
  const filters = buildPeriodFilters(periodFilter);
  return fetchMarkerFeatureCollection({
    url: "/api/housing-universe/geojson",
    method: "POST",
    body: filters ? { geojson, filters } : { geojson },
    errorMessage: "No se pudieron filtrar proyectos de vivienda por geometria.",
  });
}

export async function fetchHousingMarkersByZona(
  zona: string,
  limit = 5000,
  periodFilter?: HousingPeriodFilters | null
): Promise<FeatureCollection> {
  const params = new URLSearchParams();
  params.set("zona", zona);
  params.set("limit", String(limit));
  const filters = buildPeriodFilters(periodFilter);
  if (filters?.anio) params.set("anio", filters.anio);
  if (filters?.trimestre) params.set("trimestre", filters.trimestre);
  return fetchMarkerFeatureCollection({
    url: `/api/housing-universe/geojson?${params.toString()}`,
    errorMessage: `No se pudo cargar vivienda para zona ${zona}.`,
  });
}
