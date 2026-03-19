import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { createVendedor, getPrimerUsuarioId } from "@/lib/api-propiedades";

/**
 * GET /api/vendedores
 * Lista compañías (vendedores). Filtro por nombre de la compañía.
 * Query: nombreCompania (o search) = texto a buscar en nombre de la compañía.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nombreCompania =
      searchParams.get("nombreCompania")?.trim() ||
      searchParams.get("search")?.trim() ||
      null;

    const where = nombreCompania
      ? {
          nombre: {
            contains: nombreCompania,
            mode: "insensitive" as const,
          },
        }
      : {};

    const items = await prisma.vendedor.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { nombre: "asc" },
      include: { foto: true },
    });
    const data = items.map((v) => ({
      idPublic: v.idPublic,
      nombre: v.nombre,
      verificado: v.verificado,
      fotoUrl: v.foto?.url ?? null,
    }));
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, idFotoRecurso } = body as {
      nombre: string;
      idFotoRecurso?: string | null;
    };
    if (!nombre?.trim()) {
      return NextResponse.json(
        { error: "El nombre del vendedor es requerido" },
        { status: 400 }
      );
    }
    const idUsuario = await getPrimerUsuarioId();
    const { idPublic } = await createVendedor({
      nombre: nombre.trim(),
      idUsuario,
      idFotoRecursoPublic: idFotoRecurso ?? null,
    });
    const v = await prisma.vendedor.findUnique({
      where: { idPublic },
      include: { foto: true },
    });
    return successResponse({
      idPublic: v!.idPublic,
      nombre: v!.nombre,
      verificado: v!.verificado,
      fotoUrl: v!.foto?.url ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
