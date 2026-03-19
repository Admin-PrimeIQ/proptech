import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getOrCreateInfoPageFeature } from "@/lib/get-info-page-feature";

export async function GET() {
  try {
    const feature = await getOrCreateInfoPageFeature();
    const items = await prisma.informacionPaginaItem.findMany({
      where: { idCaracteristica: feature.id },
      include: { recurso: true },
      orderBy: [{ orden: "asc" }, { fechaCreacion: "desc" }],
    });

    return successResponse(
      items.map((item) => ({
        idPublic: item.idPublic,
        titulo: item.titulo,
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
    const { titulo, descripcion, imagenIdRecurso, orden, activo } = body;

    if (!titulo?.trim()) {
      return NextResponse.json({ error: "titulo es requerido" }, { status: 400 });
    }
    if (!imagenIdRecurso?.trim()) {
      return NextResponse.json({ error: "imagenIdRecurso es requerido" }, { status: 400 });
    }

    const feature = await getOrCreateInfoPageFeature();

    const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso.trim() } });
    if (!recurso) {
      return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
    }

    const created = await prisma.informacionPaginaItem.create({
      data: {
        idCaracteristica: feature.id,
        titulo: titulo.trim(),
        descripcion: typeof descripcion === "string" ? descripcion.trim() || null : null,
        idRecurso: recurso.id,
        orden: Number.isFinite(Number(orden)) ? Number(orden) : 0,
        activo: activo !== undefined ? Boolean(activo) : true,
      },
      include: { recurso: true },
    });

    return successResponse({
      idPublic: created.idPublic,
      titulo: created.titulo,
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
    const { idPublic, titulo, descripcion, imagenIdRecurso, orden, activo } = body;

    if (!idPublic?.trim()) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existing = await prisma.informacionPaginaItem.findUnique({
      where: { idPublic: idPublic.trim() },
      include: { recurso: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Item no encontrado" }, { status: 404 });
    }

    const updateData: {
      titulo?: string;
      descripcion?: string | null;
      idRecurso?: bigint;
      orden?: number;
      activo?: boolean;
    } = {};

    if (titulo !== undefined) updateData.titulo = String(titulo).trim();
    if (descripcion !== undefined) updateData.descripcion = typeof descripcion === "string" ? descripcion.trim() || null : null;
    if (orden !== undefined) updateData.orden = Number(orden) || 0;
    if (activo !== undefined) updateData.activo = Boolean(activo);

    if (imagenIdRecurso?.trim()) {
      const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso.trim() } });
      if (!recurso) {
        return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
      }
      updateData.idRecurso = recurso.id;
    }

    const updated = await prisma.informacionPaginaItem.update({
      where: { idPublic: idPublic.trim() },
      data: updateData,
      include: { recurso: true },
    });

    return successResponse({
      idPublic: updated.idPublic,
      titulo: updated.titulo,
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

    await prisma.informacionPaginaItem.delete({ where: { idPublic: idPublic.trim() } });
    return successResponse({ message: "Item eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}

