import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.tipoOperacionInmobiliaria.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    });
    const data = items.map((t) => ({
      idPublic: t.idPublic,
      nombre: t.nombre,
    }));
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
