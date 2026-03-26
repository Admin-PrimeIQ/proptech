import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { buildCacheKey, withCacheJson } from "@/lib/cache";

type PeriodRow = {
  anio: string | null;
  trimestre: string | null;
};

const QUARTER_ORDER = ["1T", "2T", "3T", "4T"] as const;
type Quarter = (typeof QUARTER_ORDER)[number];

function normalizeYear(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!/^\d{4}$/.test(text)) return null;
  return text;
}

function normalizeQuarter(value: unknown): Quarter | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim().toUpperCase();
  if (raw === "1T" || raw === "T1") return "1T";
  if (raw === "2T" || raw === "T2") return "2T";
  if (raw === "3T" || raw === "T3") return "3T";
  if (raw === "4T" || raw === "T4") return "4T";
  return null;
}

function sortQuarters(values: Quarter[]) {
  return [...values].sort((a, b) => QUARTER_ORDER.indexOf(a) - QUARTER_ORDER.indexOf(b));
}

export async function GET() {
  try {
    const cacheKey = buildCacheKey({ prefix: "api:housing-universe:periods", version: "v1" });
    const cached = await withCacheJson({
      key: cacheKey,
      ttlSeconds: 60 * 60,
      compute: async () => {
        const rows = await prisma.$queryRaw<PeriodRow[]>`
          SELECT
            NULLIF(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 1)), '') AS anio,
            NULLIF(UPPER(TRIM(SPLIT_PART(COALESCE(h.periodo, ''), '-', 2))), '') AS trimestre
          FROM geo_subzonas.housing_universe h
          WHERE h.periodo IS NOT NULL
            AND TRIM(h.periodo) <> ''
        `;

        const yearsSet = new Set<string>();
        const quartersSet = new Set<Quarter>();
        const quartersByYearMap = new Map<string, Set<Quarter>>();

        rows.forEach((row) => {
          const year = normalizeYear(row.anio);
          const quarter = normalizeQuarter(row.trimestre);
          if (!year || !quarter) return;

          yearsSet.add(year);
          quartersSet.add(quarter);

          if (!quartersByYearMap.has(year)) {
            quartersByYearMap.set(year, new Set<Quarter>());
          }
          quartersByYearMap.get(year)?.add(quarter);
        });

        const years = Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
        const quartersByYear = Object.fromEntries(
          years.map((year) => [year, sortQuarters(Array.from(quartersByYearMap.get(year) ?? []))])
        );
        const availableQuarters = sortQuarters(Array.from(quartersSet));

        return {
          years,
          quartersByYear,
          availableQuarters,
        };
      },
    });

    const response = successResponse(cached.value);
    response.headers.set("X-Cache", cached.cache);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
