import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.pais.findMany({
      orderBy: { nombre: "asc" },
    });
    const data = items.map((p) => ({
      idPublic: p.idPublic,
      nombre: p.nombre,
    }));
    return successResponse({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
