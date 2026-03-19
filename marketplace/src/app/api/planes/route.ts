import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.plan.findMany({
      orderBy: [{ orden: "asc" }, { fechaActualizacion: "desc" }],
    });

    return successResponse(
      items.map((item) => ({
        idPublic: item.idPublic,
        titulo: item.titulo,
        montoQuetzales: item.montoQuetzales.toString(),
        montoDolares: item.montoDolares.toString(),
        orden: item.orden,
        activo: item.activo,
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, montoQuetzales, montoDolares, orden, activo } = body;

    if (!titulo?.trim()) {
      return NextResponse.json({ error: "titulo es requerido" }, { status: 400 });
    }
    if (montoQuetzales === undefined || montoDolares === undefined) {
      return NextResponse.json({ error: "Los montos son requeridos" }, { status: 400 });
    }

    const created = await prisma.plan.create({
      data: {
        titulo: titulo.trim(),
        montoQuetzales: String(montoQuetzales),
        montoDolares: String(montoDolares),
        orden: Number.isFinite(Number(orden)) ? Number(orden) : 0,
        activo: activo !== undefined ? Boolean(activo) : true,
      },
    });

    return successResponse({
      idPublic: created.idPublic,
      titulo: created.titulo,
      montoQuetzales: created.montoQuetzales.toString(),
      montoDolares: created.montoDolares.toString(),
      orden: created.orden,
      activo: created.activo,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idPublic, titulo, montoQuetzales, montoDolares, orden, activo } = body;

    if (!idPublic?.trim()) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existing = await prisma.plan.findUnique({ where: { idPublic: idPublic.trim() } });
    if (!existing) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }

    const data: {
      titulo?: string;
      montoQuetzales?: string;
      montoDolares?: string;
      orden?: number;
      activo?: boolean;
    } = {};

    if (titulo !== undefined) data.titulo = String(titulo).trim();
    if (montoQuetzales !== undefined) data.montoQuetzales = String(montoQuetzales);
    if (montoDolares !== undefined) data.montoDolares = String(montoDolares);
    if (orden !== undefined) data.orden = Number(orden) || 0;
    if (activo !== undefined) data.activo = Boolean(activo);

    const updated = await prisma.plan.update({
      where: { idPublic: idPublic.trim() },
      data,
    });

    return successResponse({
      idPublic: updated.idPublic,
      titulo: updated.titulo,
      montoQuetzales: updated.montoQuetzales.toString(),
      montoDolares: updated.montoDolares.toString(),
      orden: updated.orden,
      activo: updated.activo,
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

    await prisma.plan.delete({ where: { idPublic: idPublic.trim() } });
    return successResponse({ message: "Plan eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
