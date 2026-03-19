import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

type SearchRow = {
  id: string;
  id_public: string;
  zona_primaria: string | null;
  nombre_descriptivo: string | null;
  nombre: string | null;
  relevance: number;
};

function compact(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, "");
}

function getSearchTerms(rawInput: string) {
  let rawCompact = compact(rawInput);
  if (/^zo(n(a)?)?$/i.test(rawCompact)) {
    rawCompact = "zona";
  }

  const withoutPrefix = rawCompact.replace(/^(zona|z)/i, "");
  const core = withoutPrefix;
  const isNumericCore = /^\d+$/.test(core);
  const corePad2 = isNumericCore && core.length === 1 ? core.padStart(2, "0") : null;

  return {
    rawCompact,
    core,
    zCore: core ? `z${core}` : "z",
    zonaCore: core ? `zona${core}` : "zona",
    corePad2,
    zCorePad2: corePad2 ? `z${corePad2}` : null,
  };
}

/**
 * GET /api/search/subzonas?q=...
 *
 * Ejemplos:
 * curl "http://localhost:3000/api/search/subzonas?q=zona%2010"
 * curl "http://localhost:3000/api/search/subzonas?q=Z10"
 * curl "http://localhost:3000/api/search/subzonas?q=10"
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return successResponse({ results: [] });
    }

    const { rawCompact, core, zCore, zonaCore, corePad2, zCorePad2 } = getSearchTerms(q);
    if (!rawCompact) return successResponse({ results: [] });

    const rows = await prisma.$queryRaw<SearchRow[]>`
      WITH base AS (
        SELECT
          s.id::text AS id,
          s.id_public::text AS id_public,
          s.zona_primaria,
          s.nombre_descriptivo,
          s.nombre,
          lower(regexp_replace(coalesce(s.zona_primaria, ''), '\\s+', '', 'g')) AS zona_norm
        FROM geo_subzonas.subzona s
        WHERE s.zona_primaria IS NOT NULL
      ),
      ranked AS (
        SELECT
          b.id,
          b.id_public,
          b.zona_primaria,
          b.nombre_descriptivo,
          b.nombre,
          CASE
            WHEN b.zona_norm LIKE ${rawCompact} || '%' THEN 1
            WHEN b.zona_norm LIKE ${zCore} || '%' THEN 2
            WHEN b.zona_norm LIKE ${zonaCore} || '%' THEN 3
            WHEN ${core}::text <> '' AND b.zona_norm LIKE ${core} || '%' THEN 4
            WHEN ${corePad2}::text IS NOT NULL AND b.zona_norm LIKE ${corePad2} || '%' THEN 5
            WHEN ${zCorePad2}::text IS NOT NULL AND b.zona_norm LIKE ${zCorePad2} || '%' THEN 6
            WHEN b.zona_norm LIKE '%' || ${rawCompact} || '%' THEN 7
            WHEN b.zona_norm LIKE '%' || ${zCore} || '%' THEN 8
            WHEN b.zona_norm LIKE '%' || ${zonaCore} || '%' THEN 9
            WHEN ${core}::text <> '' AND b.zona_norm LIKE '%' || ${core} || '%' THEN 10
            WHEN ${corePad2}::text IS NOT NULL AND b.zona_norm LIKE '%' || ${corePad2} || '%' THEN 11
            WHEN ${zCorePad2}::text IS NOT NULL AND b.zona_norm LIKE '%' || ${zCorePad2} || '%' THEN 12
            ELSE 99
          END AS relevance
        FROM base b
        WHERE
          b.zona_norm LIKE '%' || ${rawCompact} || '%'
          OR b.zona_norm LIKE '%' || ${zCore} || '%'
          OR b.zona_norm LIKE '%' || ${zonaCore} || '%'
          OR (${core}::text <> '' AND b.zona_norm LIKE '%' || ${core} || '%')
          OR (${corePad2}::text IS NOT NULL AND b.zona_norm LIKE '%' || ${corePad2} || '%')
          OR (${zCorePad2}::text IS NOT NULL AND b.zona_norm LIKE '%' || ${zCorePad2} || '%')
      ),
      best_by_zona AS (
        SELECT DISTINCT ON (r.zona_primaria)
          r.id,
          r.id_public,
          r.zona_primaria,
          r.nombre_descriptivo,
          r.nombre,
          r.relevance
        FROM ranked r
        ORDER BY r.zona_primaria, r.relevance, r.id
      )
      SELECT
        z.id,
        z.id_public,
        z.zona_primaria,
        z.nombre_descriptivo,
        z.nombre,
        z.relevance
      FROM best_by_zona z
      ORDER BY z.relevance ASC, z.zona_primaria ASC
      LIMIT 10
    `;

    const results = rows.map((row) => ({
      id: row.id,
      id_public: row.id_public,
      zona_primaria: row.zona_primaria,
      nombre_subzona: row.nombre_descriptivo ?? row.nombre,
    }));

    return successResponse({ results });
  } catch (error) {
    return handleApiError(error);
  }
}
