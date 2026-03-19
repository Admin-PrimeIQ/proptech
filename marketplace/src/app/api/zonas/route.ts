import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ciudadIdPublic = searchParams.get("ciudad");

    const where: { idCiudad?: bigint } = {};
    if (ciudadIdPublic) {
      const ciudad = await prisma.ciudad.findUnique({
        where: { idPublic: ciudadIdPublic },
      });
      if (ciudad) where.idCiudad = ciudad.id;
    }

    const items = await prisma.zona.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { nombre: "asc" },
    });
    const data = items.map((z) => ({
      idPublic: z.idPublic,
      nombre: z.nombre,
      slug: z.slug,
    }));
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
