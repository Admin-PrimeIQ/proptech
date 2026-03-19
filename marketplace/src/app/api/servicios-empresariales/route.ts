import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.servicioEmpresarial.findMany({
      include: { recurso: true },
      orderBy: [{ orden: "asc" }, { fechaActualizacion: "desc" }],
    });

    return successResponse(
      items.map((item) => ({
        idPublic: item.idPublic,
        tituloServicio: item.tituloServicio,
        descripcion: item.descripcion,
        orden: item.orden,
        activo: item.activo,
        imagen: item.recurso ? { idPublic: item.recurso.idPublic, url: item.recurso.url } : null,
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tituloServicio, descripcion, imagenIdRecurso, orden, activo } = body;

    if (!tituloServicio?.trim()) {
      return NextResponse.json({ error: "tituloServicio es requerido" }, { status: 400 });
    }
    if (!descripcion?.trim()) {
      return NextResponse.json({ error: "descripcion es requerida" }, { status: 400 });
    }
    if (!imagenIdRecurso?.trim()) {
      return NextResponse.json({ error: "imagenIdRecurso es requerido" }, { status: 400 });
    }

    const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso.trim() } });
    if (!recurso) {
      return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
    }

    const created = await prisma.servicioEmpresarial.create({
      data: {
        tituloServicio: tituloServicio.trim(),
        descripcion: descripcion.trim(),
        idRecursos: recurso.id,
        orden: Number.isFinite(Number(orden)) ? Number(orden) : 0,
        activo: activo !== undefined ? Boolean(activo) : true,
      },
      include: { recurso: true },
    });

    return successResponse({
      idPublic: created.idPublic,
      tituloServicio: created.tituloServicio,
      descripcion: created.descripcion,
      orden: created.orden,
      activo: created.activo,
      imagen: created.recurso ? { idPublic: created.recurso.idPublic, url: created.recurso.url } : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPublic, tituloServicio, descripcion, imagenIdRecurso, orden, activo } = body;

    if (!idPublic?.trim()) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existing = await prisma.servicioEmpresarial.findUnique({ where: { idPublic: idPublic.trim() } });
    if (!existing) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    const data: {
      tituloServicio?: string;
      descripcion?: string;
      idRecursos?: bigint;
      orden?: number;
      activo?: boolean;
    } = {};

    if (tituloServicio !== undefined) data.tituloServicio = String(tituloServicio).trim();
    if (descripcion !== undefined) data.descripcion = String(descripcion).trim();
    if (orden !== undefined) data.orden = Number(orden) || 0;
    if (activo !== undefined) data.activo = Boolean(activo);

    if (imagenIdRecurso?.trim()) {
      const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso.trim() } });
      if (!recurso) {
        return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
      }
      data.idRecursos = recurso.id;
    }

    const updated = await prisma.servicioEmpresarial.update({
      where: { idPublic: idPublic.trim() },
      data,
      include: { recurso: true },
    });

    return successResponse({
      idPublic: updated.idPublic,
      tituloServicio: updated.tituloServicio,
      descripcion: updated.descripcion,
      orden: updated.orden,
      activo: updated.activo,
      imagen: updated.recurso ? { idPublic: updated.recurso.idPublic, url: updated.recurso.url } : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPublic = searchParams.get("idPublic");

    if (!idPublic?.trim()) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    await prisma.servicioEmpresarial.delete({ where: { idPublic: idPublic.trim() } });
    return successResponse({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
