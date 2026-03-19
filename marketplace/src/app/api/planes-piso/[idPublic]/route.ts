import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;
    const body = await request.json();
    const { nombreDelPlano, orden, activo } = body;

    const existente = await prisma.planPiso.findUnique({
      where: { idPublic },
      include: { recurso: true },
    });
    if (!existente) {
      return NextResponse.json({ error: "Plan de piso no encontrado" }, { status: 404 });
    }

    const updateData: { nombreDelPlano?: string; orden?: number; activo?: boolean } = {};
    if (nombreDelPlano !== undefined && typeof nombreDelPlano === "string" && nombreDelPlano.trim()) {
      updateData.nombreDelPlano = nombreDelPlano.trim();
    }
    if (orden !== undefined) {
      updateData.orden = typeof orden === "number" ? orden : parseInt(String(orden), 10) || 0;
    }
    if (activo !== undefined) updateData.activo = !!activo;

    const actualizado = await prisma.planPiso.update({
      where: { idPublic },
      data: updateData,
      include: { recurso: true },
    });

    return successResponse({
      idPublic: actualizado.idPublic,
      nombreDelPlano: actualizado.nombreDelPlano,
      idRecurso: actualizado.recurso.idPublic,
      url: actualizado.recurso.url,
      orden: actualizado.orden,
      activo: actualizado.activo,
      fechaCreacion: actualizado.fechaCreacion.toISOString(),
      fechaActualizacion: actualizado.fechaActualizacion.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;

    const plan = await prisma.planPiso.findUnique({
      where: { idPublic },
      include: { recurso: true },
    });
    if (!plan) {
      return NextResponse.json({ error: "Plan de piso no encontrado" }, { status: 404 });
    }

    await prisma.planPiso.delete({
      where: { idPublic },
    });

    return successResponse({ message: "Plan de piso eliminado correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
