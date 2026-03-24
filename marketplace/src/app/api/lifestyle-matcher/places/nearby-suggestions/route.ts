import { NextRequest } from "next/server";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import type { PriorityPlaceSuggestion } from "@/app/enterprise/lifestyle-matcher/puntos/components/lifestyleMatcherPoints.types";
import { isPriorityTitleWithoutPlaceSuggestions } from "@/app/enterprise/lifestyle-matcher/puntos/services/priorityPlaceSuggestions.policy";

function toFiniteNumber(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function readPlacesApiKey(): string | null {
  const raw =
    process.env.GOOGLE_PLACES_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY_SERVER ??
    process.env.GOOGLE_MAPS_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    null;
  const key = typeof raw === "string" ? raw.trim() : "";
  return key.length > 0 ? key : null;
}

function resolvePlaceTypeForPriority(title: string): string | null {
  const t = title.trim().toLowerCase();
  if (t.includes("hospital") || t.includes("clínica") || t.includes("clinica")) return "hospital";
  if (t.includes("farmacia")) return "pharmacy";
  if (t.includes("gym") || t.includes("gimnasio")) return "gym";
  if (t.includes("supermercado") || t.includes("super")) return "supermarket";
  if (t.includes("colegio") || t.includes("escuela") || t.includes("universidad")) return "school";
  if (t.includes("parque")) return "park";
  if (t.includes("restaurante")) return "restaurant";
  if (t.includes("banco")) return "bank";
  if (t.includes("trabajo") || t.includes("oficina")) return "office";
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      lat?: unknown;
      lng?: unknown;
      radiusMeters?: unknown;
      priorityTitle?: unknown;
    };

    const lat = toFiniteNumber(body.lat);
    const lng = toFiniteNumber(body.lng);
    const priorityTitle = typeof body.priorityTitle === "string" ? body.priorityTitle.trim() : "";
    if (lat === null || lng === null) {
      return successResponse({ error: "lat/lng inválidos.", data: { suggestions: [] as PriorityPlaceSuggestion[] } }, 400);
    }
    if (!priorityTitle) {
      return successResponse({ error: "priorityTitle requerido.", data: { suggestions: [] as PriorityPlaceSuggestion[] } }, 400);
    }

    if (isPriorityTitleWithoutPlaceSuggestions(priorityTitle)) {
      return successResponse({
        data: { suggestions: [] as PriorityPlaceSuggestion[] },
        metadata: { skipped: true, reason: "priority_without_places_suggestions" },
      });
    }

    const radiusMeters = Math.min(Math.max(toFiniteNumber(body.radiusMeters) ?? 2500, 300), 10000);
    const apiKey = readPlacesApiKey();
    if (!apiKey) {
      return successResponse({
        data: { suggestions: [] as PriorityPlaceSuggestion[] },
        metadata: { fallback: true, reason: "missing_google_places_api_key" },
      });
    }

    const placeType = resolvePlaceTypeForPriority(priorityTitle);
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: String(radiusMeters),
      key: apiKey,
    });
    if (placeType) {
      params.set("type", placeType);
    }
    params.set("keyword", priorityTitle.slice(0, 80));

    const res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return successResponse({
        data: { suggestions: [] as PriorityPlaceSuggestion[] },
        metadata: { fallback: true, reason: "http_error" },
      });
    }

    const payload = (await res.json().catch(() => null)) as
      | {
          status?: string;
          results?: Array<{
            place_id?: string;
            name?: string;
            geometry?: { location?: { lat?: number; lng?: number } };
            vicinity?: string;
          }>;
        }
      | null;

    if (!payload) {
      return successResponse({ data: { suggestions: [] as PriorityPlaceSuggestion[] } });
    }

    if (payload.status && payload.status !== "OK" && payload.status !== "ZERO_RESULTS") {
      return successResponse({
        data: { suggestions: [] as PriorityPlaceSuggestion[] },
        metadata: { fallback: true, reason: payload.status },
      });
    }

    const rows = Array.isArray(payload.results) ? payload.results : [];
    const suggestions: PriorityPlaceSuggestion[] = rows
      .map((row) => {
        const placeId = String(row.place_id ?? "");
        const name = String(row.name ?? "");
        const loc = row.geometry?.location;
        const latN = Number(loc?.lat);
        const lngN = Number(loc?.lng);
        if (!placeId || !name || !Number.isFinite(latN) || !Number.isFinite(lngN)) return null;
        return {
          placeId,
          name,
          lat: latN,
          lng: lngN,
          vicinity: row.vicinity ? String(row.vicinity) : null,
        };
      })
      .filter((row): row is PriorityPlaceSuggestion => row !== null)
      .slice(0, 8);

    return successResponse({ data: { suggestions }, metadata: { fallback: false } });
  } catch (error) {
    return handleApiError(error);
  }
}
