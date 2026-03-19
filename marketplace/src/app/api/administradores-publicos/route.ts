import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getOrCreateHomeFeature } from "@/lib/get-home-feature";

export async function GET() {
  try {
    const feature = await getOrCreateHomeFeature();
    const items = await prisma.administradorPublico.findMany({
      where: { idCaracteristica: feature.id },
      include: { recurso: true },
      orderBy: [{ orden: "asc" }, { fechaCreacion: "desc" }],
    });

    const formatted = items.map((item) => ({
      idPublic: item.idPublic,
      nombre: item.nombre,
      puesto: item.puesto,
      imagen: item.recurso ? { idPublic: item.recurso.idPublic, url: item.recurso.url } : null,
      orden: item.orden,
      activo: item.activo,
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
    const { nombre, puesto, imagenIdRecurso, orden, activo } = body;

    if (!nombre || !puesto) {
      return NextResponse.json({ error: "nombre y puesto son requeridos" }, { status: 400 });
    }

    const feature = await getOrCreateHomeFeature();

    if (!imagenIdRecurso) {
      return NextResponse.json({ error: "imagenIdRecurso es requerido" }, { status: 400 });
    }

    const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso } });
    if (!recurso) {
      return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
    }

    const nuevo = await prisma.administradorPublico.create({
      data: {
        nombre,
        puesto,
        idRecurso: recurso.id,
        idCaracteristica: feature.id,
        orden: orden ?? 0,
        activo: activo !== undefined ? activo : true,
      },
      include: { recurso: true },
    });

    return successResponse({
      idPublic: nuevo.idPublic,
      nombre: nuevo.nombre,
      puesto: nuevo.puesto,
      imagen: nuevo.recurso ? { idPublic: nuevo.recurso.idPublic, url: nuevo.recurso.url } : null,
      orden: nuevo.orden,
      activo: nuevo.activo,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPublic, nombre, puesto, imagenIdRecurso, orden, activo } = body;

    if (!idPublic) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existente = await prisma.administradorPublico.findUnique({
      where: { idPublic },
      include: { recurso: true },
    });

    if (!existente) {
      return NextResponse.json({ error: "Administrador público no encontrado" }, { status: 404 });
    }

    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (puesto !== undefined) updateData.puesto = puesto;
    if (orden !== undefined) updateData.orden = orden;
    if (activo !== undefined) updateData.activo = activo;

    if (imagenIdRecurso) {
      const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso } });
      if (!recurso) {
        return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
      }
      updateData.idRecurso = recurso.id;
    }

    const actualizado = await prisma.administradorPublico.update({
      where: { idPublic },
      data: updateData,
      include: { recurso: true },
    });

    return successResponse({
      idPublic: actualizado.idPublic,
      nombre: actualizado.nombre,
      puesto: actualizado.puesto,
      imagen: actualizado.recurso ? { idPublic: actualizado.recurso.idPublic, url: actualizado.recurso.url } : null,
      orden: actualizado.orden,
      activo: actualizado.activo,
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

    await prisma.administradorPublico.delete({
      where: { idPublic },
    });

    return successResponse({ message: "Administrador público eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
