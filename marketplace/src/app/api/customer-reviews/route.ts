import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getSessionWithRoles } from "@/lib/auth-helpers";
import { getOrCreateVendedorForUserId } from "@/lib/api-propiedades";

const postBodySchema = z.object({
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  numeroTelefono: z.string().min(1, "El número de teléfono es requerido"),
  mensaje: z.string().min(1, "El mensaje es requerido"),
  idPropiedad: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idPropiedadPublic = searchParams.get("idPropiedad");
    if (!idPropiedadPublic) {
      return NextResponse.json(
        { error: "idPropiedad (id público de la propiedad) es requerido" },
        { status: 400 }
      );
    }
    const propiedad = await prisma.propiedad.findUnique({
      where: { idPublic: idPropiedadPublic },
      select: { id: true, nombrePropiedad: true, idVendedor: true },
    });
    if (!propiedad) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const { roles, idUsuario } = await getSessionWithRoles();
    const isVendedor = idUsuario != null && roles.includes("VENDEDOR");
    if (isVendedor && idUsuario != null) {
      const vendedor = await getOrCreateVendedorForUserId(BigInt(idUsuario));
      if (propiedad.idVendedor !== vendedor.id) {
        return NextResponse.json(
          { error: "No tiene acceso a las reseñas de esta propiedad" },
          { status: 403 }
        );
      }
    }

    const reviews = await prisma.customerReview.findMany({
      where: { idPropiedad: propiedad.id },
      orderBy: { fechaCreacion: "desc" },
    });
    const data = reviews.map((r) => ({
      idPublic: r.idPublic,
      nombreCompleto: r.nombreCompleto,
      numeroTelefono: r.numeroTelefono,
      email: r.email,
      mensaje: r.mensaje,
      estado: r.estado,
      deseaPublicar: r.deseaPublicar,
      visiblePublico: r.visiblePublico,
      fechaCreacion: r.fechaCreacion.toISOString(),
    }));
    return successResponse({
      propiedad: { idPublic: idPropiedadPublic, nombrePropiedad: propiedad.nombrePropiedad },
      reseñas: data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para enviar una reseña" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = postBodySchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join("; ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const { nombreCompleto, email, numeroTelefono, mensaje, idPropiedad: idPropiedadPublic } =
      parsed.data;

    const idUsuario = BigInt(session.user.id);
    let idPropiedad: bigint | null = null;
    if (idPropiedadPublic) {
      const prop = await prisma.propiedad.findUnique({
        where: { idPublic: idPropiedadPublic },
        select: { id: true },
      });
      if (prop) idPropiedad = prop.id;
    }

    const review = await prisma.customerReview.create({
      data: {
        nombreCompleto: nombreCompleto.trim(),
        numeroTelefono: numeroTelefono.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
        idUsuario,
        idPropiedad: idPropiedad ?? undefined,
        deseaPublicar: false,
        visiblePublico: false,
        estado: "NUEVA",
      },
    });

    return successResponse({
      idPublic: review.idPublic,
      mensaje: "Reseña enviada correctamente",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
