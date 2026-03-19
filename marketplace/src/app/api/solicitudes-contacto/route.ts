import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getSessionWithRoles } from "@/lib/auth-helpers";
import { getOrCreateVendedorForUserId } from "@/lib/api-propiedades";

export async function GET() {
  try {
    const { roles, idUsuario } = await getSessionWithRoles();
    const isVendedor = idUsuario != null && roles.includes("VENDEDOR");

    const where: { propiedad?: { idVendedor: bigint } } = {};
    if (isVendedor && idUsuario != null) {
      const vendedor = await getOrCreateVendedorForUserId(BigInt(idUsuario));
      where.propiedad = { idVendedor: vendedor.id };
    }

    const list = await prisma.solicitudContacto.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { fechaCreacion: "desc" },
      include: {
        propiedad: {
          select: { idPublic: true, nombrePropiedad: true },
        },
      },
    });
    const data = list.map((s) => ({
      idPublic: s.idPublic,
      nombre: s.nombre,
      correo: s.correo,
      telefono: s.telefono,
      mensaje: s.mensaje,
      estado: s.estado,
      contactado: s.contactado,
      fechaCreacion: s.fechaCreacion.toISOString(),
      propiedad: s.propiedad
        ? { idPublic: s.propiedad.idPublic, nombrePropiedad: s.propiedad.nombrePropiedad }
        : null,
    }));
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

const solicitudContactoSchema = z.object({
  idPropiedad: z.string().uuid("ID de propiedad inválido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  correo: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  mensaje: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para enviar una solicitud de contacto" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = solicitudContactoSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { idPropiedad, nombre, correo, telefono, mensaje } = parsed.data;

    const prop = await prisma.propiedad.findUnique({
      where: { idPublic: idPropiedad },
    });
    if (!prop) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const idUsuario = BigInt(session.user.id);
    const solicitud = await prisma.solicitudContacto.create({
      data: {
        idPropiedad: prop.id,
        idUsuario,
        nombre: nombre.trim(),
        correo: correo.trim(),
        telefono: telefono?.trim() || null,
        mensaje: mensaje?.trim() || null,
        estado: "PENDIENTE",
      },
    });

    return successResponse({
      idPublic: solicitud.idPublic,
      mensaje: "Solicitud enviada correctamente",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
