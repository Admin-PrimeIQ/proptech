import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paisIdPublic = searchParams.get("pais");
    const nombre = searchParams.get("nombre");

    const where: { idPais?: bigint; nombre?: string } = {};
    if (paisIdPublic) {
      const pais = await prisma.pais.findUnique({
        where: { idPublic: paisIdPublic },
      });
      if (pais) where.idPais = pais.id;
    }
    if (nombre) {
      where.nombre = nombre;
    }

    const items = await prisma.departamento.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { nombre: "asc" },
    });
    const data = items.map((d) => ({
      idPublic: d.idPublic,
      nombre: d.nombre,
    }));
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
