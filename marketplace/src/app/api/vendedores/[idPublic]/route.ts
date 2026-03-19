import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { getSessionWithRoles } from "@/lib/auth-helpers";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;
    const v = await prisma.vendedor.findUnique({
      where: { idPublic },
      include: { foto: true },
    });
    if (!v) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 });
    }
    return successResponse({
      idPublic: v.idPublic,
      nombre: v.nombre,
      verificado: v.verificado,
      fotoUrl: v.foto?.url ?? null,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  try {
    const { idPublic } = await params;
    const v = await prisma.vendedor.findUnique({ where: { idPublic } });
    if (!v) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 });
    }
    const { roles, idUsuario } = await getSessionWithRoles();
    const isAdmin = ADMIN_ROLES.some((r) => roles.includes(r));
    const isOwner = idUsuario != null && BigInt(idUsuario) === v.idUsuario;
    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "No autorizado para actualizar este vendedor" }, { status: 403 });
    }
    const body = await request.json();
    const { nombre, idFotoRecurso } = body as {
      nombre?: string;
      idFotoRecurso?: string | null;
    };
    let idFoto: bigint | null = null;
    if (idFotoRecurso !== undefined) {
      if (idFotoRecurso) {
        const r = await prisma.recurso.findUnique({
          where: { idPublic: String(idFotoRecurso) },
        });
        if (r) idFoto = r.id;
      }
    } else {
      idFoto = v.idFotoRecurso;
    }
    const updated = await prisma.vendedor.update({
      where: { id: v.id },
      data: {
        ...(nombre !== undefined && { nombre: nombre.trim() }),
        ...(idFotoRecurso !== undefined && { idFotoRecurso: idFoto }),
      },
      include: { foto: true },
    });
    return successResponse({
      idPublic: updated.idPublic,
      nombre: updated.nombre,
      verificado: updated.verificado,
      fotoUrl: updated.foto?.url ?? null,
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
    const v = await prisma.vendedor.findUnique({ where: { idPublic } });
    if (!v) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 });
    }
    await prisma.vendedor.delete({ where: { id: v.id } });
    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
