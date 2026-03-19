import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

/** GET: perfil del usuario actual (nombreCompleto, correo, telefono). */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const idUsuario = BigInt(session.user.id);
    const usuario = await prisma.usuario.findUnique({
      where: { id: idUsuario },
      select: { idPublic: true, nombreCompleto: true, correo: true, telefono: true },
    });
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    return successResponse({
      idPublic: usuario.idPublic,
      nombreCompleto: usuario.nombreCompleto ?? "",
      correo: usuario.correo,
      telefono: usuario.telefono ?? "",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/** PATCH: actualizar perfil del usuario actual (nombreCompleto, correo, telefono). */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const idUsuario = BigInt(session.user.id);
    const usuario = await prisma.usuario.findUnique({
      where: { id: idUsuario },
    });
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { nombreCompleto, correo, telefono } = body as {
      nombreCompleto?: string | null;
      correo?: string;
      telefono?: string | null;
    };

    const data: { nombreCompleto?: string | null; correo?: string; telefono?: string | null } = {};
    if (nombreCompleto !== undefined) {
      data.nombreCompleto = typeof nombreCompleto === "string" ? nombreCompleto.trim() || null : null;
    }
    if (correo !== undefined) {
      const email = typeof correo === "string" ? correo.trim().toLowerCase() : "";
      if (!email) {
        return NextResponse.json({ error: "El correo no puede estar vacío" }, { status: 400 });
      }
      const existente = await prisma.usuario.findFirst({
        where: { correo: email, id: { not: usuario.id } },
      });
      if (existente) {
        return NextResponse.json(
          { error: "Ya existe otro usuario con ese correo" },
          { status: 409 }
        );
      }
      data.correo = email;
    }
    if (telefono !== undefined) {
      data.telefono = typeof telefono === "string" ? telefono.trim() || null : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
    }

    const updated = await prisma.usuario.update({
      where: { id: idUsuario },
      data,
      select: { idPublic: true, nombreCompleto: true, correo: true, telefono: true },
    });

    return successResponse({
      idPublic: updated.idPublic,
      nombreCompleto: updated.nombreCompleto ?? "",
      correo: updated.correo,
      telefono: updated.telefono ?? "",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
