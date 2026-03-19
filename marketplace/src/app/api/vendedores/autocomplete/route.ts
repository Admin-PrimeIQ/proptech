import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

/**
 * GET /api/vendedores/autocomplete
 * Autocompletado por nombre de la compañía (no por vendedor).
 * Query: nombreCompania (o search) = texto a buscar.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nombreCompania =
      searchParams.get("nombreCompania")?.trim() ||
      searchParams.get("search")?.trim() ||
      "";

    const where = nombreCompania
      ? {
          nombre: {
            contains: nombreCompania,
            mode: "insensitive" as const,
          },
        }
      : {};

    const items = await prisma.vendedor.findMany({
      where,
      orderBy: { nombre: "asc" },
      take: 20,
    });

    // Eliminar duplicados por nombre de compañía (case-insensitive)
    const seen = new Set<string>();
    const uniqueItems = items.filter((v) => {
      const key = v.nombre.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const data = uniqueItems.map((v) => ({
      idPublic: v.idPublic,
      nombre: v.nombre,
    }));

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
