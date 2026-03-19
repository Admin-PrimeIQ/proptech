import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.solucionEmpresarial.findMany({
      include: { recurso: true },
      orderBy: { fechaActualizacion: "desc" },
    });

    return successResponse(
      items.map((item) => ({
        idPublic: item.idPublic,
        tituloHero: item.tituloHero,
        tituloSeccionInformacion: item.tituloSeccionInformacion,
        contextoSeccionInformacion: item.contextoSeccionInformacion,
        imagen: item.recurso ? { idPublic: item.recurso.idPublic, url: item.recurso.url } : null,
        fechaCreacion: item.fechaCreacion.toISOString(),
        fechaActualizacion: item.fechaActualizacion.toISOString(),
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tituloHero, tituloSeccionInformacion, contextoSeccionInformacion, imagenIdRecurso } = body;

    if (!tituloHero?.trim()) {
      return NextResponse.json({ error: "tituloHero es requerido" }, { status: 400 });
    }
    if (!imagenIdRecurso?.trim()) {
      return NextResponse.json({ error: "imagenIdRecurso es requerido" }, { status: 400 });
    }

    const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso.trim() } });
    if (!recurso) {
      return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
    }

    const created = await prisma.solucionEmpresarial.create({
      data: {
        tituloHero: tituloHero.trim(),
        tituloSeccionInformacion: tituloSeccionInformacion?.trim() || null,
        contextoSeccionInformacion: contextoSeccionInformacion?.trim() || null,
        idRecursos: recurso.id,
      },
      include: { recurso: true },
    });

    return successResponse({
      idPublic: created.idPublic,
      tituloHero: created.tituloHero,
      tituloSeccionInformacion: created.tituloSeccionInformacion,
      contextoSeccionInformacion: created.contextoSeccionInformacion,
      imagen: created.recurso ? { idPublic: created.recurso.idPublic, url: created.recurso.url } : null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPublic, tituloHero, tituloSeccionInformacion, contextoSeccionInformacion, imagenIdRecurso } = body;

    if (!idPublic?.trim()) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existing = await prisma.solucionEmpresarial.findUnique({ where: { idPublic: idPublic.trim() } });
    if (!existing) {
      return NextResponse.json({ error: "Registro no encontrado" }, { status: 404 });
    }

    const data: {
      tituloHero?: string;
      tituloSeccionInformacion?: string | null;
      contextoSeccionInformacion?: string | null;
      idRecursos?: bigint;
    } = {};

    if (tituloHero !== undefined) data.tituloHero = String(tituloHero).trim();
    if (tituloSeccionInformacion !== undefined) data.tituloSeccionInformacion = tituloSeccionInformacion?.trim() || null;
    if (contextoSeccionInformacion !== undefined) data.contextoSeccionInformacion = contextoSeccionInformacion?.trim() || null;

    if (imagenIdRecurso?.trim()) {
      const recurso = await prisma.recurso.findUnique({ where: { idPublic: imagenIdRecurso.trim() } });
      if (!recurso) {
        return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
      }
      data.idRecursos = recurso.id;
    }

    const updated = await prisma.solucionEmpresarial.update({
      where: { idPublic: idPublic.trim() },
      data,
      include: { recurso: true },
    });

    return successResponse({
      idPublic: updated.idPublic,
      tituloHero: updated.tituloHero,
      tituloSeccionInformacion: updated.tituloSeccionInformacion,
      contextoSeccionInformacion: updated.contextoSeccionInformacion,
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

    await prisma.solucionEmpresarial.delete({ where: { idPublic: idPublic.trim() } });
    return successResponse({ message: "Registro eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
