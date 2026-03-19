import type { FeatureCollection } from "../../components/lifestyleMatcherPoints.types";
import { fetchMarkerFeatureCollection } from "./markerFetch.shared";

export async function fetchCommercialMarkersByGeoJson(geojson: object): Promise<FeatureCollection> {
  return fetchMarkerFeatureCollection({
    url: "/api/commercial-centers/geojson",
    method: "POST",
    body: { geojson },
    errorMessage: "No se pudieron filtrar comercios por geometria.",
  });
}

export async function fetchCommercialMarkersByZona(zona: string, limit = 5000): Promise<FeatureCollection> {
  const params = new URLSearchParams();
  params.set("zona", zona);
  params.set("limit", String(limit));
  return fetchMarkerFeatureCollection({
    url: `/api/commercial-centers/geojson?${params.toString()}`,
    errorMessage: `No se pudo cargar comercios para zona ${zona}.`,
  });
}
