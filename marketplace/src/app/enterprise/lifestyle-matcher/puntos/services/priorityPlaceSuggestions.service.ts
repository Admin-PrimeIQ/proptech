import type { PriorityPlaceSuggestion } from "../components/lifestyleMatcherPoints.types";

type NearbySuggestionsResponse = {
  data?: {
    suggestions?: PriorityPlaceSuggestion[];
  };
  metadata?: { fallback?: boolean };
};

export async function fetchNearbyPrioritySuggestions(params: {
  lat: number;
  lng: number;
  radiusMeters: number;
  priorityTitle: string;
}): Promise<{ suggestions: PriorityPlaceSuggestion[]; fallback: boolean }> {
  const res = await fetch("/api/lifestyle-matcher/places/nearby-suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      lat: params.lat,
      lng: params.lng,
      radiusMeters: params.radiusMeters,
      priorityTitle: params.priorityTitle,
    }),
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar sugerencias de ubicación.");
  }

  const payload = (await res.json().catch(() => ({}))) as NearbySuggestionsResponse;
  const suggestions = Array.isArray(payload?.data?.suggestions) ? payload.data.suggestions : [];
  return {
    suggestions,
    fallback: Boolean(payload?.metadata?.fallback),
  };
}
