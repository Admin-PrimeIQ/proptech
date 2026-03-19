import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET() {
  try {
    const items = await prisma.beneficioPlan.findMany({
      include: { plan: true },
      orderBy: [{ orden: "asc" }, { fechaCreacion: "desc" }],
    });

    return successResponse(
      items.map((item) => ({
        idPublic: item.idPublic,
        idPlanPublic: item.plan.idPublic,
        planTitulo: item.plan.titulo,
        tituloVentaja: item.tituloVentaja,
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
    const { idPlanPublic, tituloVentaja, orden, activo } = body;

    if (!idPlanPublic?.trim()) {
      return NextResponse.json({ error: "idPlanPublic es requerido" }, { status: 400 });
    }
    if (!tituloVentaja?.trim()) {
      return NextResponse.json({ error: "tituloVentaja es requerido" }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({ where: { idPublic: idPlanPublic.trim() } });
    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
    }

    const created = await prisma.beneficioPlan.create({
      data: {
        idPlan: plan.id,
        tituloVentaja: tituloVentaja.trim(),
        orden: Number.isFinite(Number(orden)) ? Number(orden) : 0,
        activo: activo !== undefined ? Boolean(activo) : true,
      },
      include: { plan: true },
    });

    return successResponse({
      idPublic: created.idPublic,
      idPlanPublic: created.plan.idPublic,
      planTitulo: created.plan.titulo,
      tituloVentaja: created.tituloVentaja,
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
    const { idPublic, idPlanPublic, tituloVentaja, orden, activo } = body;

    if (!idPublic?.trim()) {
      return NextResponse.json({ error: "idPublic es requerido" }, { status: 400 });
    }

    const existing = await prisma.beneficioPlan.findUnique({ where: { idPublic: idPublic.trim() } });
    if (!existing) {
      return NextResponse.json({ error: "Beneficio no encontrado" }, { status: 404 });
    }

    const data: {
      idPlan?: number;
      tituloVentaja?: string;
      orden?: number;
      activo?: boolean;
    } = {};

    if (idPlanPublic?.trim()) {
      const plan = await prisma.plan.findUnique({ where: { idPublic: idPlanPublic.trim() } });
      if (!plan) {
        return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
      }
      data.idPlan = plan.id;
    }
    if (tituloVentaja !== undefined) data.tituloVentaja = String(tituloVentaja).trim();
    if (orden !== undefined) data.orden = Number(orden) || 0;
    if (activo !== undefined) data.activo = Boolean(activo);

    const updated = await prisma.beneficioPlan.update({
      where: { idPublic: idPublic.trim() },
      data,
      include: { plan: true },
    });

    return successResponse({
      idPublic: updated.idPublic,
      idPlanPublic: updated.plan.idPublic,
      planTitulo: updated.plan.titulo,
      tituloVentaja: updated.tituloVentaja,
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

    await prisma.beneficioPlan.delete({ where: { idPublic: idPublic.trim() } });
    return successResponse({ message: "Beneficio eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
