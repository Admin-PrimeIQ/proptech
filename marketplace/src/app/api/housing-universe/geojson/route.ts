import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

type HousingGeoJsonRow = {
  id: number;
  cod_proyecto: string | null;
  periodo: string | null;
  proyecto: string | null;
  fase: string | null;
  departamento: string | null;
  municipio: string | null;
  categoria: string | null;
  zona: string | null;
  subzona: string | null;
  estado: string | null;
  uso: string | null;
  mercado: string | null;
  desarrollador: string | null;
  precio_promedio: unknown;
  total_unidades: number | null;
  unidades_disponibles: number | null;
  latitud: unknown;
  longitud: unknown;
  url_imagen: string | null;
  created_at: Date;
};

type MarkerFilterPayload = {
  q?: unknown;
  zona?: unknown;
  subzona?: unknown;
  categoria?: unknown;
  uso?: unknown;
  mercado?: unknown;
  estado?: unknown;
  anio?: unknown;
  trimestre?: unknown;
};

type SpatialFilter =
  | { kind: "geometry"; geometry: Record<string, unknown> }
  | { kind: "circle"; center: [number, number]; radius: number }
  | null;

function normalizeText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const out = String(value).trim();
  return out.length ? out : null;
}

function normalizeYear(value: unknown): string | null {
  const text = normalizeText(value);
  if (!text) return null;
  if (!/^\d{4}$/.test(text)) return null;
  return text;
}

function normalizeQuarter(value: unknown): "1T" | "2T" | "3T" | "4T" | null {
  const text = normalizeText(value)?.toUpperCase() ?? null;
  if (!text) return null;
  if (text === "1T" || text === "T1") return "1T";
  if (text === "2T" || text === "T2") return "2T";
  if (text === "3T" || text === "T3") return "3T";
  if (text === "4T" || text === "T4") return "4T";
  return null;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBbox(value: string | null): [number, number, number, number] | null {
  if (!value) return null;
  const parts = value.split(",").map((x) => Number(x.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  const [minLon, minLat, maxLon, maxLat] = parts;
  if (minLon >= maxLon || minLat >= maxLat) return null;
  return [minLon, minLat, maxLon, maxLat];
}

function extractGeometriesFromFeatureCollection(value: unknown): Array<Record<string, unknown>> {
  if (!value || typeof value !== "object") return [];
  const features = (value as { features?: unknown }).features;
  if (!Array.isArray(features)) return [];

  return features
    .map((feature) => {
      if (!feature || typeof feature !== "object") return null;
      const geometry = (feature as { geometry?: unknown }).geometry;
      if (!geometry || typeof geometry !== "object") return null;
      return geometry as Record<string, unknown>;
    })
    .filter((geometry): geometry is Record<string, unknown> => geometry !== null);
}

function parseNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseSpatialFilter(rawGeoJson: unknown): SpatialFilter {
  if (!rawGeoJson || typeof rawGeoJson !== "object") return null;

  const candidate = rawGeoJson as {
    type?: unknown;
    geometry?: unknown;
    properties?: unknown;
  };
  const type = typeof candidate.type === "string" ? candidate.type : null;

  if (type === "FeatureCollection") {
    const geometries = extractGeometriesFromFeatureCollection(rawGeoJson);
    if (!geometries.length) return null;
    return {
      kind: "geometry",
      geometry: {
        type: "GeometryCollection",
        geometries,
      },
    };
  }

  if (type === "Feature") {
    const geometry = candidate.geometry;
    if (!geometry || typeof geometry !== "object") return null;

    const geometryType = String((geometry as { type?: unknown }).type ?? "");
    const radius = parseNumber((candidate.properties as { radius?: unknown } | undefined)?.radius);
    if (geometryType === "Point" && radius && radius > 0) {
      const coords = (geometry as { coordinates?: unknown }).coordinates;
      if (!Array.isArray(coords) || coords.length < 2) return null;
      const lon = parseNumber(coords[0]);
      const lat = parseNumber(coords[1]);
      if (lat === null || lon === null) return null;
      return { kind: "circle", center: [lon, lat], radius };
    }

    return { kind: "geometry", geometry: geometry as Record<string, unknown> };
  }

  const geometryType = type;
  if (geometryType) {
    if (geometryType === "Point") {
      const coords = (rawGeoJson as { coordinates?: unknown }).coordinates;
      const radius = parseNumber((rawGeoJson as { properties?: { radius?: unknown } }).properties?.radius);
      if (Array.isArray(coords) && coords.length >= 2 && radius && radius > 0) {
        const lon = parseNumber(coords[0]);
        const lat = parseNumber(coords[1]);
        if (lat !== null && lon !== null) {
          return { kind: "circle", center: [lon, lat], radius };
        }
      }
    }

    return { kind: "geometry", geometry: rawGeoJson as Record<string, unknown> };
  }

  return null;
}

function normalizeFilters(filters: MarkerFilterPayload | null | undefined) {
  return {
    q: normalizeText(filters?.q ?? null),
    zona: normalizeText(filters?.zona ?? null),
    subzona: normalizeText(filters?.subzona ?? null),
    categoria: normalizeText(filters?.categoria ?? null),
    uso: normalizeText(filters?.uso ?? null),
    mercado: normalizeText(filters?.mercado ?? null),
    estado: normalizeText(filters?.estado ?? null),
    anio: normalizeYear(filters?.anio ?? null),
    trimestre: normalizeQuarter(filters?.trimestre ?? null),
  };
}

async function queryMarkers(params: {
  filters: ReturnType<typeof normalizeFilters>;
  limit: number;
  bbox: [number, number, number, number] | null;
  spatialFilter: SpatialFilter;
}) {
  const { filters, limit, bbox, spatialFilter } = params;
  const { q, zona, subzona, categoria, uso, mercado, estado, anio, trimestre } = filters;
  const [minLon, minLat, maxLon, maxLat] = bbox ?? [null, null, null, null];
  const hasBbox = !!bbox;
  const hasSpatialGeometry = spatialFilter?.kind === "geometry";
  const hasCircle = spatialFilter?.kind === "circle";
  const spatialGeometry =
    spatialFilter?.kind === "geometry" ? JSON.stringify(spatialFilter.geometry) : null;
  const circleLon = spatialFilter?.kind === "circle" ? spatialFilter.center[0] : null;
  const circleLat = spatialFilter?.kind === "circle" ? spatialFilter.center[1] : null;
  const circleRadius = spatialFilter?.kind === "circle" ? spatialFilter.radius : null;

  return prisma.$queryRaw<HousingGeoJsonRow[]>`
    SELECT
      h.id,
      h.cod_proyecto,
      h.periodo,
      h.proyecto,
      h.fase,
      h.departamento,
      h.municipio,
      h.categoria,
      h.zona,
      h.subzona,
      h.estado,
      h.uso,
      h.mercado,
      h.desarrollador,
      h.precio_promedio,
      h.total_unidades,
      h.unidades_disponibles,
      h.latitud,
      h.longitud,
      h.url_imagen,
      h.created_at
    FROM geo_subzonas.housing_universe h
    WHERE
      h.latitud IS NOT NULL
      AND h.longitud IS NOT NULL
      AND (${zona}::text IS NULL OR h.zona = ${zona})
      AND (${subzona}::text IS NULL OR h.subzona = ${subzona})
      AND (${categoria}::text IS NULL OR h.categoria = ${categoria})
      AND (${uso}::text IS NULL OR h.uso = ${uso})
      AND (${mercado}::text IS NULL OR h.mercado = ${mercado})
      AND (${estado}::text IS NULL OR h.estado = ${estado})
      AND (
        ${anio}::text IS NULL
        OR TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 1)) = ${anio}
      )
      AND (
        ${trimestre}::text IS NULL
        OR (
          CASE
            WHEN UPPER(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 2))) IN ('1T', 'T1') THEN '1T'
            WHEN UPPER(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 2))) IN ('2T', 'T2') THEN '2T'
            WHEN UPPER(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 2))) IN ('3T', 'T3') THEN '3T'
            WHEN UPPER(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 2))) IN ('4T', 'T4') THEN '4T'
            ELSE UPPER(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 2)))
          END
        ) = ${trimestre}
      )
      AND (
        ${q}::text IS NULL
        OR COALESCE(h.proyecto, '') ILIKE '%' || ${q} || '%'
        OR COALESCE(h.cod_proyecto, '') ILIKE '%' || ${q} || '%'
        OR COALESCE(h.desarrollador, '') ILIKE '%' || ${q} || '%'
        OR COALESCE(h.zona, '') ILIKE '%' || ${q} || '%'
        OR COALESCE(h.subzona, '') ILIKE '%' || ${q} || '%'
        OR COALESCE(h.categoria, '') ILIKE '%' || ${q} || '%'
      )
      AND (
        CASE
          WHEN ${hasBbox}::boolean THEN
            h.longitud BETWEEN ${minLon}::double precision AND ${maxLon}::double precision
            AND h.latitud BETWEEN ${minLat}::double precision AND ${maxLat}::double precision
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${hasSpatialGeometry}::boolean THEN
            ST_Intersects(
              ST_SetSRID(ST_MakePoint(h.longitud::double precision, h.latitud::double precision), 4326),
              ST_CollectionExtract(
                ST_Buffer(
                  ST_MakeValid(
                    ST_SnapToGrid(
                      ST_SetSRID(ST_GeomFromGeoJSON(${spatialGeometry}), 4326),
                      0.0000001
                    )
                  ),
                  0
                ),
                3
              )
            )
          WHEN ${hasCircle}::boolean THEN
            ST_DWithin(
              ST_SetSRID(ST_MakePoint(h.longitud::double precision, h.latitud::double precision), 4326)::geography,
              ST_SetSRID(ST_MakePoint(${circleLon}::double precision, ${circleLat}::double precision), 4326)::geography,
              ${circleRadius}::double precision
            )
          ELSE TRUE
        END
      )
    ORDER BY h.zona ASC NULLS LAST, h.subzona ASC NULLS LAST, h.proyecto ASC NULLS LAST, h.id ASC
    LIMIT ${limit}
  `;
}

function mapRowsToFeatureCollection(rows: HousingGeoJsonRow[], limit: number) {
  const features = rows
    .map((row) => {
      const lat = toNumber(row.latitud);
      const lon = toNumber(row.longitud);
      if (lat === null || lon === null) return null;

      return {
        type: "Feature" as const,
        id: row.id,
        geometry: {
          type: "Point" as const,
          coordinates: [lon, lat],
        },
        properties: {
          id: row.id,
          codigoProyecto: row.cod_proyecto,
          periodo: row.periodo,
          proyecto: row.proyecto,
          nombreProyecto: row.proyecto,
          fase: row.fase,
          departamento: row.departamento,
          municipio: row.municipio,
          categoria: row.categoria,
          zona: row.zona,
          subzona: row.subzona,
          estado: row.estado,
          uso: row.uso,
          mercado: row.mercado,
          desarrollador: row.desarrollador,
          nombreDesarrollador: row.desarrollador,
          precioPromedio: toNumber(row.precio_promedio),
          totalUnidades: row.total_unidades,
          unidadesDisponibles: row.unidades_disponibles,
          urlImagen: row.url_imagen,
          imagen: row.url_imagen,
          createdAt: row.created_at.toISOString(),
        },
      };
    })
    .filter(Boolean);

  return {
    type: "FeatureCollection" as const,
    features,
    meta: {
      total: features.length,
      limit,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = normalizeFilters({
      q: searchParams.get("q"),
      zona: searchParams.get("zona"),
      subzona: searchParams.get("subzona"),
      categoria: searchParams.get("categoria"),
      uso: searchParams.get("uso"),
      mercado: searchParams.get("mercado"),
      estado: searchParams.get("estado"),
      anio: searchParams.get("anio"),
      trimestre: searchParams.get("trimestre"),
    });
    const bbox = parseBbox(searchParams.get("bbox"));

    if (searchParams.get("bbox") && !bbox) {
      return Response.json(
        { error: "bbox invalido. Formato esperado: minLon,minLat,maxLon,maxLat" },
        { status: 400 }
      );
    }

    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "5000"), 1), 20000);
    const rows = await queryMarkers({
      filters,
      limit,
      bbox,
      spatialFilter: null,
    });

    return successResponse(mapRowsToFeatureCollection(rows, limit));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      geojson?: unknown;
      filters?: MarkerFilterPayload;
      limit?: unknown;
      bbox?: unknown;
    };

    const spatialFilter = parseSpatialFilter(body?.geojson);
    if (!spatialFilter) {
      return Response.json(
        { error: "geojson invalido. Debe ser Feature, FeatureCollection o geometria GeoJSON." },
        { status: 400 }
      );
    }

    const limit = Math.min(Math.max(Number(body?.limit ?? 5000), 1), 20000);
    const bbox = parseBbox(typeof body?.bbox === "string" ? body.bbox : null);
    if (body?.bbox && !bbox) {
      return Response.json(
        { error: "bbox invalido. Formato esperado: minLon,minLat,maxLon,maxLat" },
        { status: 400 }
      );
    }

    const rows = await queryMarkers({
      filters: normalizeFilters(body?.filters),
      limit,
      bbox,
      spatialFilter,
    });

    return successResponse(mapRowsToFeatureCollection(rows, limit));
  } catch (error) {
    return handleApiError(error);
  }
}
