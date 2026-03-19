import type { FeatureCollection } from "../../components/lifestyleMatcherPoints.types";
import { extractFeatureCollection } from "../../components/lifestyleMatcherPoints.helpers";

type FetchMarkersOptions = {
  url: string;
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
  errorMessage: string;
};

export async function fetchMarkerFeatureCollection(options: FetchMarkersOptions): Promise<FeatureCollection> {
  const { url, method = "GET", body, errorMessage } = options;
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error((payload as { error?: string })?.error || errorMessage);
  }

  const payload = await response.json();
  const collection = extractFeatureCollection(payload);
  if (!collection) {
    throw new Error("La respuesta no es un FeatureCollection valido.");
  }
  return collection;
}
