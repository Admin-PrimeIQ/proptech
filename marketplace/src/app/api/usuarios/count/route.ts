import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const count = await prisma.usuario.count({
      where: {
        activo: true, // Solo contar usuarios activos
      },
    });

    return successResponse({ count });
  } catch (error) {
    return handleApiError(error);
  }
}
