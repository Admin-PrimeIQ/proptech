import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

const updateSolicitudSchema = z.object({
  estado: z.enum(["PENDIENTE", "CONTACTADO", "NO_CONTACTAR"]).optional(),
  contactado: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;
    const body = await request.json();
    const parsed = updateSolicitudSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { estado, contactado } = parsed.data;

    const existing = await prisma.solicitudContacto.findUnique({
      where: { idPublic },
    });
    if (!existing) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    const data: { estado?: string; contactado?: boolean } = {};
    if (estado !== undefined) {
      data.estado = estado;
      data.contactado = estado === "CONTACTADO";
    }
    if (contactado !== undefined) data.contactado = contactado;

    const updated = await prisma.solicitudContacto.update({
      where: { idPublic },
      data,
    });

    return successResponse({
      idPublic: updated.idPublic,
      estado: updated.estado,
      contactado: updated.contactado,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
