import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.categoriaPropiedad.findMany({
      where: { activa: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    });
    const data = items.map((c) => ({
      idPublic: c.idPublic,
      nombre: c.nombre,
      slug: c.slug,
    }));
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
