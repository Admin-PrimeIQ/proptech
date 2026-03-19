import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

type CommercialGeoJsonRow = {
  id: number;
  nombre_centro_comercial: string | null;
  direccion_exacta: string | null;
  zona: string | null;
  municipio: string | null;
  departamento: string | null;
  latitud: unknown;
  longitud: unknown;
  status: string | null;
  tipo_cc: string | null;
  desarrollador: string | null;
  total_m2: unknown;
  total_parqueo: number | null;
  link_directorio: string | null;
  juegos_infantiles: boolean;
  areas_descanso: boolean;
  valet_parking: boolean;
  areas_verdes: boolean;
  find_my_car: boolean;
  created_at: Date;
};

type CommercialFilterPayload = {
  q?: unknown;
  zona?: unknown;
  municipio?: unknown;
  departamento?: unknown;
  status?: unknown;
  tipoCc?: unknown;
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

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "bigint") {
    return Number(value);
  }
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

function parseNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

function parseSpatialFilter(rawGeoJson: unknown): SpatialFilter {
  if (!rawGeoJson || typeof rawGeoJson !== "object") return null;

  const candidate = rawGeoJson as { type?: unknown; geometry?: unknown; properties?: unknown };
  const type = typeof candidate.type === "string" ? candidate.type : null;

  if (type === "FeatureCollection") {
    const geometries = extractGeometriesFromFeatureCollection(rawGeoJson);
    if (!geometries.length) return null;
    return { kind: "geometry", geometry: { type: "GeometryCollection", geometries } };
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

  if (type) {
    if (type === "Point") {
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

function normalizeFilters(filters: CommercialFilterPayload | null | undefined) {
  return {
    q: normalizeText(filters?.q ?? null),
    zona: normalizeText(filters?.zona ?? null),
    municipio: normalizeText(filters?.municipio ?? null),
    departamento: normalizeText(filters?.departamento ?? null),
    status: normalizeText(filters?.status ?? null),
    tipoCc: normalizeText(filters?.tipoCc ?? null),
  };
}

async function queryCommercialCenters(params: {
  filters: ReturnType<typeof normalizeFilters>;
  limit: number;
  bbox: [number, number, number, number] | null;
  spatialFilter: SpatialFilter;
}) {
  const { filters, limit, bbox, spatialFilter } = params;
  const { q, zona, municipio, departamento, status, tipoCc } = filters;
  const [minLon, minLat, maxLon, maxLat] = bbox ?? [null, null, null, null];
  const hasBbox = !!bbox;
  const hasSpatialGeometry = spatialFilter?.kind === "geometry";
  const hasCircle = spatialFilter?.kind === "circle";
  const spatialGeometry =
    spatialFilter?.kind === "geometry" ? JSON.stringify(spatialFilter.geometry) : null;
  const circleLon = spatialFilter?.kind === "circle" ? spatialFilter.center[0] : null;
  const circleLat = spatialFilter?.kind === "circle" ? spatialFilter.center[1] : null;
  const circleRadius = spatialFilter?.kind === "circle" ? spatialFilter.radius : null;

  return prisma.$queryRaw<CommercialGeoJsonRow[]>`
    SELECT
      c.id,
      c.nombre_centro_comercial,
      c.direccion_exacta,
      c.zona,
      c.municipio,
      c.departamento,
      c.latitud,
      c.longitud,
      c.status,
      c.tipo_cc,
      c.desarrollador,
      c.total_m2,
      c.total_parqueo,
      c.link_directorio,
      s.juegos_infantiles,
      s.areas_descanso,
      s.valet_parking,
      s.areas_verdes,
      s.find_my_car,
      c.fecha_creacion AS created_at
    FROM geo_subzonas.universo_centro_comercial c
    JOIN geo_subzonas.servicio s ON s.id = c.servicio_id
    WHERE
      c.latitud IS NOT NULL
      AND c.longitud IS NOT NULL
      AND (${zona}::text IS NULL OR c.zona = ${zona})
      AND (${municipio}::text IS NULL OR c.municipio = ${municipio})
      AND (${departamento}::text IS NULL OR c.departamento = ${departamento})
      AND (${status}::text IS NULL OR c.status = ${status})
      AND (${tipoCc}::text IS NULL OR c.tipo_cc = ${tipoCc})
      AND (
        ${q}::text IS NULL
        OR COALESCE(c.nombre_centro_comercial, '') ILIKE '%' || ${q} || '%'
        OR COALESCE(c.desarrollador, '') ILIKE '%' || ${q} || '%'
        OR COALESCE(c.zona, '') ILIKE '%' || ${q} || '%'
        OR COALESCE(c.municipio, '') ILIKE '%' || ${q} || '%'
      )
      AND (
        CASE
          WHEN ${hasBbox}::boolean THEN
            c.longitud BETWEEN ${minLon}::double precision AND ${maxLon}::double precision
            AND c.latitud BETWEEN ${minLat}::double precision AND ${maxLat}::double precision
          ELSE TRUE
        END
      )
      AND (
        CASE
          WHEN ${hasSpatialGeometry}::boolean THEN
            ST_Intersects(
              ST_SetSRID(ST_MakePoint(c.longitud::double precision, c.latitud::double precision), 4326),
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
              ST_SetSRID(ST_MakePoint(c.longitud::double precision, c.latitud::double precision), 4326)::geography,
              ST_SetSRID(ST_MakePoint(${circleLon}::double precision, ${circleLat}::double precision), 4326)::geography,
              ${circleRadius}::double precision
            )
          ELSE TRUE
        END
      )
    ORDER BY c.zona ASC NULLS LAST, c.municipio ASC NULLS LAST, c.nombre_centro_comercial ASC NULLS LAST, c.id ASC
    LIMIT ${limit}
  `;
}

function mapRowsToFeatureCollection(rows: CommercialGeoJsonRow[], limit: number) {
  const features = rows
    .map((row) => {
      const id = toNumber(row.id);
      const lat = toNumber(row.latitud);
      const lon = toNumber(row.longitud);
      if (id === null || lat === null || lon === null) return null;

      return {
        type: "Feature" as const,
        id: `commercial-${id}`,
        geometry: {
          type: "Point" as const,
          coordinates: [lon, lat],
        },
        properties: {
          id,
          markerSource: "commercial",
          codigoProyecto: null,
          proyecto: row.nombre_centro_comercial,
          nombreProyecto: row.nombre_centro_comercial,
          departamento: row.departamento,
          municipio: row.municipio,
          categoria: row.tipo_cc,
          uso: "Comercio",
          estado: row.status,
          zona: row.zona,
          desarrollador: row.desarrollador,
          nombreDesarrollador: row.desarrollador,
          totalM2: toNumber(row.total_m2),
          parqueos: row.total_parqueo,
          precioPromedio: null,
          direccionExacta: row.direccion_exacta,
          tipoCc: row.tipo_cc,
          linkDirectorio: row.link_directorio,
          juegosInfantiles: row.juegos_infantiles,
          areasDescanso: row.areas_descanso,
          valetParking: row.valet_parking,
          areasVerdes: row.areas_verdes,
          findMyCar: row.find_my_car,
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
      municipio: searchParams.get("municipio"),
      departamento: searchParams.get("departamento"),
      status: searchParams.get("status"),
      tipoCc: searchParams.get("tipoCc"),
    });
    const bbox = parseBbox(searchParams.get("bbox"));
    if (searchParams.get("bbox") && !bbox) {
      return Response.json(
        { error: "bbox invalido. Formato esperado: minLon,minLat,maxLon,maxLat" },
        { status: 400 }
      );
    }

    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "5000"), 1), 20000);
    const rows = await queryCommercialCenters({
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
      filters?: CommercialFilterPayload;
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

    const rows = await queryCommercialCenters({
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
