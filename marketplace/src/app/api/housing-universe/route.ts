import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

type HousingUniverseRow = {
  id: number;
  cod_proyecto: string | null;
  fecha_recoleccion: Date | null;
  proyecto: string | null;
  fase: string | null;
  torre: string | null;
  periodo: string | null;
  categoria: string | null;
  pais: string | null;
  departamento: string | null;
  municipio: string | null;
  zona: string | null;
  subzona: string | null;
  desarrollador: string | null;
  estado: string | null;
  uso: string | null;
  fecha_inicio: Date | null;
  fecha_entrega: Date | null;
  meses_de_comercializacion: number | null;
  latitud: unknown;
  longitud: unknown;
  precio_promedio: unknown;
  total_unidades: number | null;
  unidades_disponibles: number | null;
  mercado: string | null;
  url_imagen: string | null;
  created_at: Date;
};

type CountRow = { total: bigint };

function normalizeText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const out = String(value).trim();
  return out.length > 0 ? out : null;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapRow(row: HousingUniverseRow) {
  return {
    id: row.id,
    codigoProyecto: row.cod_proyecto,
    fechaRecoleccion: row.fecha_recoleccion?.toISOString().slice(0, 10) ?? null,
    proyecto: row.proyecto,
    fase: row.fase,
    torre: row.torre,
    periodo: row.periodo,
    categoria: row.categoria,
    pais: row.pais,
    departamento: row.departamento,
    municipio: row.municipio,
    zona: row.zona,
    subzona: row.subzona,
    desarrollador: row.desarrollador,
    estado: row.estado,
    uso: row.uso,
    fechaInicio: row.fecha_inicio?.toISOString().slice(0, 10) ?? null,
    fechaEntrega: row.fecha_entrega?.toISOString().slice(0, 10) ?? null,
    mesesComercializacion: row.meses_de_comercializacion,
    latitud: toNumber(row.latitud),
    longitud: toNumber(row.longitud),
    precioPromedio: toNumber(row.precio_promedio),
    totalUnidades: row.total_unidades,
    unidadesDisponibles: row.unidades_disponibles,
    mercado: row.mercado,
    urlImagen: row.url_imagen,
    createdAt: row.created_at.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id") || "");

    const q = normalizeText(searchParams.get("q"));
    const zona = normalizeText(searchParams.get("zona"));
    const subzona = normalizeText(searchParams.get("subzona"));
    const categoria = normalizeText(searchParams.get("categoria"));
    const uso = normalizeText(searchParams.get("uso"));
    const mercado = normalizeText(searchParams.get("mercado"));
    const estado = normalizeText(searchParams.get("estado"));

    const page = Math.max(Number(searchParams.get("page") || "1"), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "50"), 1), 500);
    const offset = (page - 1) * limit;

    if (Number.isInteger(id) && id > 0) {
      const rows = await prisma.$queryRaw<HousingUniverseRow[]>`
        SELECT *
        FROM geo_subzonas.housing_universe h
        WHERE h.id = ${id}
        LIMIT 1
      `;

      if (!rows.length) {
        return Response.json({ error: "Registro no encontrado" }, { status: 404 });
      }

      return successResponse(mapRow(rows[0]));
    }

    const rows = await prisma.$queryRaw<HousingUniverseRow[]>`
      SELECT *
      FROM geo_subzonas.housing_universe h
      WHERE
        (${zona}::text IS NULL OR h.zona = ${zona})
        AND (${subzona}::text IS NULL OR h.subzona = ${subzona})
        AND (${categoria}::text IS NULL OR h.categoria = ${categoria})
        AND (${uso}::text IS NULL OR h.uso = ${uso})
        AND (${mercado}::text IS NULL OR h.mercado = ${mercado})
        AND (${estado}::text IS NULL OR h.estado = ${estado})
        AND (
          ${q}::text IS NULL
          OR COALESCE(h.proyecto, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.cod_proyecto, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.desarrollador, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.zona, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.subzona, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.categoria, '') ILIKE '%' || ${q} || '%'
        )
      ORDER BY h.zona ASC NULLS LAST, h.subzona ASC NULLS LAST, h.proyecto ASC NULLS LAST, h.id ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countRows = await prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*)::bigint AS total
      FROM geo_subzonas.housing_universe h
      WHERE
        (${zona}::text IS NULL OR h.zona = ${zona})
        AND (${subzona}::text IS NULL OR h.subzona = ${subzona})
        AND (${categoria}::text IS NULL OR h.categoria = ${categoria})
        AND (${uso}::text IS NULL OR h.uso = ${uso})
        AND (${mercado}::text IS NULL OR h.mercado = ${mercado})
        AND (${estado}::text IS NULL OR h.estado = ${estado})
        AND (
          ${q}::text IS NULL
          OR COALESCE(h.proyecto, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.cod_proyecto, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.desarrollador, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.zona, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.subzona, '') ILIKE '%' || ${q} || '%'
          OR COALESCE(h.categoria, '') ILIKE '%' || ${q} || '%'
        )
    `;

    const total = Number(countRows[0]?.total || 0n);
    const data = rows.map(mapRow);

    return successResponse({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

