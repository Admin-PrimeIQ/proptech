import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deptIdPublic = searchParams.get("departamento");

    const where: { idDepartamento?: bigint } = {};
    if (deptIdPublic) {
      const dept = await prisma.departamento.findUnique({
        where: { idPublic: deptIdPublic },
      });
      if (dept) where.idDepartamento = dept.id;
    }

    const items = await prisma.ciudad.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { nombre: "asc" },
    });
    const data = items.map((c) => ({
      idPublic: c.idPublic,
      nombre: c.nombre,
    }));
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
