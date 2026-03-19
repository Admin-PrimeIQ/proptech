"use client";

import { useState, useEffect, useCallback } from "react";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import {
  mapApiPropiedadToCardItem,
  type ApiPropiedadItem,
} from "@/lib/mapApiPropiedadToCard";

type UseApiPropertiesResult = {
  properties: IFeaturedPropertyDT[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

type UseApiPropertiesFilters = {
  categoriaIdPublic?: string | null;
  departamentoIdPublic?: string | null;
  tipoOperacionIdPublic?: string | null;
  vendedorIdPublic?: string | null;
  ciudadIdPublic?: string | null;
  habitaciones?: string | null;
  banos?: string | null;
  parqueos?: string | null;
  precioMin?: number | string | null;
  precioMax?: number | string | null;
  moneda?: string | null;
  search?: string | null;
};

/**
 * Hook que obtiene propiedades desde GET /api/propiedades y las mapea
 * al formato de las cards (propiedades). No modifica usePropertyData.
 *
 * Acepta filtros opcionales que se envían como query params para
 * mantener sincronía con el filtro del hero y de la página de propiedades.
 */
export function useApiProperties(filters?: UseApiPropertiesFilters): UseApiPropertiesResult {
  const [properties, setProperties] = useState<IFeaturedPropertyDT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      // límite por defecto
      params.set("limit", "50");

      if (filters?.categoriaIdPublic) {
        params.set("categoriaIdPublic", filters.categoriaIdPublic);
      }
      if (filters?.departamentoIdPublic) {
        params.set("departamentoIdPublic", filters.departamentoIdPublic);
      }
      if (filters?.tipoOperacionIdPublic) {
        params.set("tipoOperacionIdPublic", filters.tipoOperacionIdPublic);
      }
      if (filters?.vendedorIdPublic) {
        params.set("vendedorIdPublic", filters.vendedorIdPublic);
      }
      if (filters?.ciudadIdPublic) {
        params.set("ciudadIdPublic", filters.ciudadIdPublic);
      }
      if (filters?.search) {
        params.set("search", filters.search);
      }
      if (filters?.habitaciones) {
        params.set("habitaciones", filters.habitaciones);
      }
      if (filters?.banos) {
        params.set("banos", filters.banos);
      }
      if (filters?.parqueos) {
        params.set("parqueos", filters.parqueos);
      }
      if (filters?.precioMin != null) {
        params.set("precioMin", String(filters.precioMin));
      }
      if (filters?.precioMax != null) {
        params.set("precioMax", String(filters.precioMax));
      }
      if (filters?.moneda) {
        params.set("moneda", filters.moneda);
      }

      const query = params.toString();
      const res = await fetch(`/api/propiedades?${query}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Error al cargar propiedades");
        setProperties([]);
        return;
      }
      const list = json?.data ?? json;
      const items: ApiPropiedadItem[] = Array.isArray(list) ? list : [];
      const mapped = items.map(mapApiPropiedadToCardItem);
      setProperties(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar propiedades");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters?.categoriaIdPublic,
    filters?.departamentoIdPublic,
    filters?.tipoOperacionIdPublic,
    filters?.vendedorIdPublic,
    filters?.ciudadIdPublic,
    filters?.habitaciones,
    filters?.banos,
    filters?.parqueos,
    filters?.precioMin,
    filters?.precioMax,
    filters?.moneda,
    filters?.search,
  ]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}
