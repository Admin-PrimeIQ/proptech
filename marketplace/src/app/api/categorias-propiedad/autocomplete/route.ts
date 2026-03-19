import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    const where = search
      ? {
          activa: true,
          nombre: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : { activa: true };

    const items = await prisma.categoriaPropiedad.findMany({
      where,
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      take: 20,
    });

    // Eliminar duplicados por nombre (case-insensitive)
    const seen = new Set<string>();
    const uniqueItems = items.filter((c) => {
      const key = c.nombre.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const data = uniqueItems.map((c) => ({
      idPublic: c.idPublic,
      nombre: c.nombre,
      slug: c.slug,
    }));

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
