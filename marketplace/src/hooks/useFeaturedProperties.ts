"use client";

import { useCallback, useEffect, useState } from "react";
import { mapApiPropiedadToCardItem, type ApiPropiedadItem } from "@/lib/mapApiPropiedadToCard";
import type { IFeaturedPropertyDT } from "@/types/property-d-t";

type UseFeaturedPropertiesResult = {
  properties: IFeaturedPropertyDT[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useFeaturedProperties(limit: number = 20): UseFeaturedPropertiesResult {
  const [properties, setProperties] = useState<IFeaturedPropertyDT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/propiedades/destacadas?limit=${Math.min(50, Math.max(1, limit))}`);
      const text = await res.text();
      let json: unknown;
      try {
        json = text.trimStart().startsWith("<") ? null : JSON.parse(text);
      } catch {
        setError("Error al cargar propiedades destacadas");
        setProperties([]);
        return;
      }
      if (json == null) {
        setError("Error al cargar propiedades destacadas");
        setProperties([]);
        return;
      }
      if (!res.ok) {
        setError((json as { error?: string })?.error ?? "Error al cargar propiedades destacadas");
        setProperties([]);
        return;
      }
      const list = (json as { data?: unknown })?.data ?? json;
      const items: ApiPropiedadItem[] = Array.isArray(list) ? list : [];
      setProperties(items.map(mapApiPropiedadToCardItem));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar propiedades destacadas");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { properties, loading, error, refetch: fetchFeatured };
}

