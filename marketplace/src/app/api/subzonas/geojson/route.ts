import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

type GeoJsonRow = {
  id_public: string;
  codigo_subzona: string;
  nombre: string | null;
  nombre_descriptivo: string;
  zona_primaria: string | null;
  origen_fid: number | null;
  origen_layer: string | null;
  flag_nombre_previo: string | null;
  codigo_reeval_geom: string | null;
  geometry: unknown;
};

function normalizeText(value: string | null): string | null {
  if (!value) return null;
  const out = value.trim();
  return out.length ? out : null;
}

function parseBbox(value: string | null): [number, number, number, number] | null {
  if (!value) return null;
  const parts = value.split(",").map((x) => Number(x.trim()));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;

  const [minLon, minLat, maxLon, maxLat] = parts;
  if (minLon >= maxLon || minLat >= maxLat) return null;
  return [minLon, minLat, maxLon, maxLat];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zonaPrimaria = normalizeText(searchParams.get("zonaPrimaria"));
    const codigoSubzona = normalizeText(searchParams.get("codigoSubzona"));
    const q = normalizeText(searchParams.get("q"));
    const bbox = parseBbox(searchParams.get("bbox"));

    if (searchParams.get("bbox") && !bbox) {
      return NextResponse.json(
        { error: "bbox invalido. Formato esperado: minLon,minLat,maxLon,maxLat" },
        { status: 400 }
      );
    }

    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "5000"), 1), 10000);
    const [minLon, minLat, maxLon, maxLat] = bbox ?? [null, null, null, null];
    const hasBbox = !!bbox;

    const rows = await prisma.$queryRaw<GeoJsonRow[]>`
      SELECT
        s.id_public,
        s.codigo_subzona,
        s.nombre,
        s.nombre_descriptivo,
        s.zona_primaria,
        s.origen_fid,
        s.origen_layer,
        s.flag_nombre_previo,
        s.codigo_reeval_geom,
        ST_AsGeoJSON(s.geom)::jsonb AS geometry
      FROM geo_subzonas.subzona s
      WHERE
        s.geom IS NOT NULL
        AND (${zonaPrimaria}::text IS NULL OR s.zona_primaria = ${zonaPrimaria})
        AND (${codigoSubzona}::text IS NULL OR s.codigo_subzona = ${codigoSubzona})
        AND (
          ${q}::text IS NULL
          OR s.codigo_subzona ILIKE '%' || ${q} || '%'
          OR COALESCE(s.nombre, '') ILIKE '%' || ${q} || '%'
          OR s.nombre_descriptivo ILIKE '%' || ${q} || '%'
        )
        AND (
          CASE
            WHEN ${hasBbox}::boolean THEN
              s.geom && ST_MakeEnvelope(
                ${minLon}::double precision,
                ${minLat}::double precision,
                ${maxLon}::double precision,
                ${maxLat}::double precision,
                4326
              )
            ELSE TRUE
          END
        )
      ORDER BY s.zona_primaria ASC NULLS LAST, s.codigo_subzona ASC
      LIMIT ${limit}
    `;

    const features = rows.map((row) => ({
      type: "Feature" as const,
      id: row.id_public,
      geometry: row.geometry,
      properties: {
        idPublic: row.id_public,
        codigoSubzona: row.codigo_subzona,
        nombre: row.nombre,
        nombreDescriptivo: row.nombre_descriptivo,
        zonaPrimaria: row.zona_primaria,
        origenFid: row.origen_fid,
        origenLayer: row.origen_layer,
        flagNombrePrevio: row.flag_nombre_previo,
        codigoReevalGeom: row.codigo_reeval_geom,
      },
    }));

    return successResponse({
      type: "FeatureCollection",
      features,
      meta: {
        total: features.length,
        limit,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

