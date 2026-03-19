import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    const where = search
      ? {
          nombre: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    const items = await prisma.departamento.findMany({
      where,
      orderBy: { nombre: "asc" },
      take: 20,
    });

    // Eliminar duplicados por nombre (case-insensitive)
    const seen = new Set<string>();
    const uniqueItems = items.filter((d) => {
      const key = d.nombre.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const data = uniqueItems.map((d) => ({
      idPublic: d.idPublic,
      nombre: d.nombre,
    }));

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
