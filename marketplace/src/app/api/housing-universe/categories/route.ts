import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

type CategoryRow = {
  categoria: string | null;
};

function normalizeCategory(value: string | null): string | null {
  if (!value) return null;
  const out = value.trim();
  return out.length ? out : null;
}

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<CategoryRow[]>`
      SELECT DISTINCT h.categoria
      FROM geo_subzonas.housing_universe h
      WHERE h.categoria IS NOT NULL
      ORDER BY h.categoria ASC
    `;

    const categories = rows
      .map((row) => normalizeCategory(row.categoria))
      .filter((value): value is string => Boolean(value));

    return successResponse({
      data: categories,
      meta: {
        total: categories.length,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
