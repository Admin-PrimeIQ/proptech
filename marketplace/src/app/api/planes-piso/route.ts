import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPropiedadIdPublic = searchParams.get("idPropiedadIdPublic")?.trim();

    if (!idPropiedadIdPublic) {
      return NextResponse.json(
        { error: "idPropiedadIdPublic es requerido" },
        { status: 400 }
      );
    }

    const propiedad = await prisma.propiedad.findUnique({
      where: { idPublic: idPropiedadIdPublic },
    });
    if (!propiedad) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const items = await prisma.planPiso.findMany({
      where: { idPropiedad: propiedad.id },
      include: { recurso: true },
      orderBy: [{ orden: "asc" }, { fechaCreacion: "asc" }],
    });

    const data = items.map((p) => ({
      idPublic: p.idPublic,
      nombreDelPlano: p.nombreDelPlano,
      idRecurso: p.recurso.idPublic,
      url: p.recurso.url,
      orden: p.orden,
      activo: p.activo,
      fechaCreacion: p.fechaCreacion.toISOString(),
      fechaActualizacion: p.fechaActualizacion.toISOString(),
    }));

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPropiedadIdPublic, nombreDelPlano, idRecurso, orden = 0 } = body;

    if (!idPropiedadIdPublic || !nombreDelPlano || !idRecurso) {
      return NextResponse.json(
        { error: "idPropiedadIdPublic, nombreDelPlano e idRecurso son requeridos" },
        { status: 400 }
      );
    }

    const propiedad = await prisma.propiedad.findUnique({
      where: { idPublic: idPropiedadIdPublic },
    });
    if (!propiedad) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const recurso = await prisma.recurso.findUnique({
      where: { idPublic: idRecurso },
    });
    if (!recurso) {
      return NextResponse.json({ error: "Recurso (imagen) no encontrado" }, { status: 404 });
    }

    const creado = await prisma.planPiso.create({
      data: {
        nombreDelPlano: String(nombreDelPlano).trim(),
        idRecurso: recurso.id,
        idPropiedad: propiedad.id,
        orden: typeof orden === "number" ? orden : parseInt(String(orden), 10) || 0,
        activo: true,
      },
      include: { recurso: true },
    });

    return successResponse({
      idPublic: creado.idPublic,
      nombreDelPlano: creado.nombreDelPlano,
      idRecurso: creado.recurso.idPublic,
      url: creado.recurso.url,
      orden: creado.orden,
      activo: creado.activo,
      fechaCreacion: creado.fechaCreacion.toISOString(),
      fechaActualizacion: creado.fechaActualizacion.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
