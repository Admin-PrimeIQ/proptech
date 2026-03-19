import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getOrCreateHomeFeature } from "@/lib/get-home-feature";

export async function GET() {
  try {
    const feature = await getOrCreateHomeFeature();
    const items = await prisma.comentarioPersona.findMany({
      where: { idCaracteristica: feature.id },
      include: { recurso: true },
      orderBy: { fechaCreacion: "desc" },
    });

    const formatted = items.map((item) => ({
      idPublic: item.idPublic,
      nombrePersonaComentario: item.nombrePersonaComentario,
      puesto: item.puesto,
      comentario: item.comentario,
      imagen: item.recurso ? { idPublic: item.recurso.idPublic, url: item.recurso.url } : null,
      fechaCreacion: item.fechaCreacion.toISOString(),
      fechaActualizacion: item.fechaActualizacion.toISOString(),
    }));

    return successResponse(formatted);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombrePersonaComentario, puesto, comentario, imagenIdRecurso } = body;

    if (!nombrePersonaComentario || !puesto || !comentario) {
      return NextResponse.json(
        { error: "nombrePersonaComentario, puesto y comentario son requeridos" },
        { status: 400 }
      );
    }

    const feature = await getOrCreateHomeFeature();

    if (!imagenIdRecurso) {
      return NextResponse.json({ error: "imagenIdRecurso es requerido" }, { status: 400 });
    }

    const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso } });
    if (!recurso) {
      return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
    }

    const nuevo = await prisma.comentarioPersona.create({
      data: {
        nombrePersonaComentario,
        puesto,
        comentario,
        idRecurso: recurso.id,
        idCaracteristica: feature.id,
      },
      include: { recurso: true },
    });

    return successResponse({
      idPublic: nuevo.idPublic,
      nombrePersonaComentario: nuevo.nombrePersonaComentario,
      puesto: nuevo.puesto,
      comentario: nuevo.comentario,
      imagen: nuevo.recurso ? { idPublic: nuevo.recurso.idPublic, url: nuevo.recurso.url } : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPublic, nombrePersonaComentario, puesto, comentario, imagenIdRecurso } = body;

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existente = await prisma.comentarioPersona.findUnique({
      where: { idPublic },
      include: { recurso: true },
    });

    if (!existente) {
      return NextResponse.json({ error: "Comentario no encontrado" }, { status: 404 });
    }

    const updateData: any = {};
    if (nombrePersonaComentario !== undefined) updateData.nombrePersonaComentario = nombrePersonaComentario;
    if (puesto !== undefined) updateData.puesto = puesto;
    if (comentario !== undefined) updateData.comentario = comentario;

    if (imagenIdRecurso) {
      const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso } });
      if (!recurso) {
        return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
      }
      updateData.idRecurso = recurso.id;
    }

    const actualizado = await prisma.comentarioPersona.update({
      where: { idPublic },
      data: updateData,
      include: { recurso: true },
    });

    return successResponse({
      idPublic: actualizado.idPublic,
      nombrePersonaComentario: actualizado.nombrePersonaComentario,
      puesto: actualizado.puesto,
      comentario: actualizado.comentario,
      imagen: actualizado.recurso ? { idPublic: actualizado.recurso.idPublic, url: actualizado.recurso.url } : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPublic = searchParams.get("idPublic");

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    await prisma.comentarioPersona.delete({
      where: { idPublic },
    });

    return successResponse({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
