import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

/**
 * Endpoint que devuelve categorías con el conteo de propiedades por cada una
 */
export async function GET() {
  try {
    const categorias = await prisma.categoriaPropiedad.findMany({
      where: { activa: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      include: {
        _count: {
          select: {
            propiedades: true,
          },
        },
      },
    });

    const data = categorias.map((c) => ({
      idPublic: c.idPublic,
      nombre: c.nombre,
      slug: c.slug,
      conteo: c._count.propiedades,
    }));

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
