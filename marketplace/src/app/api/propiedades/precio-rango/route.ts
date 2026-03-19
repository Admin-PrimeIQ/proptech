import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

/**
 * GET /api/propiedades/precio-rango?moneda=USD
 * Obtiene el precio mínimo y máximo de todas las propiedades filtradas por moneda.
 * Si no se especifica moneda, devuelve el rango de todas las monedas.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moneda = searchParams.get("moneda")?.trim().toUpperCase() || null;

    // Construir filtro para precio
    const precioWhere: any = {
      precio: {
        not: null,
      },
    };

    if (moneda) {
      precioWhere.moneda = moneda;
    }

    // Obtener min y max en una sola query usando agregación
    const [minResult, maxResult] = await Promise.all([
      prisma.precioPropiedad.findFirst({
        where: precioWhere,
        orderBy: { precio: "asc" },
        select: { precio: true, moneda: true },
      }),
      prisma.precioPropiedad.findFirst({
        where: precioWhere,
        orderBy: { precio: "desc" },
        select: { precio: true, moneda: true },
      }),
    ]);

    const min = minResult?.precio ? Number(minResult.precio) : 0;
    const max = maxResult?.precio ? Number(maxResult.precio) : 1000;

    return successResponse({
      min,
      max,
      moneda: moneda || null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
