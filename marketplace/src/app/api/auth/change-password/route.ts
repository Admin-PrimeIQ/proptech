import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { handleApiError, successResponse } from "@/lib/api-helpers";

const ROUNDS = 10;

/** POST: cambiar contraseña del usuario actual (contraseña anterior + nueva). */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const { currentPassword, newPassword } = body as {
      currentPassword?: string;
      newPassword?: string;
    };
    if (typeof currentPassword !== "string" || !currentPassword.trim()) {
      return NextResponse.json(
        { error: "La contraseña actual es obligatoria" },
        { status: 400 }
      );
    }
    if (typeof newPassword !== "string" || !newPassword.trim()) {
      return NextResponse.json(
        { error: "La nueva contraseña es obligatoria" },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "La nueva contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const idUsuario = BigInt(session.user.id);
    const usuario = await prisma.usuario.findUnique({
      where: { id: idUsuario },
    });
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    if (!usuario.contrasenaHash) {
      return NextResponse.json(
        { error: "Este usuario no tiene contraseña configurada (inicio con red social)" },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(currentPassword.trim(), usuario.contrasenaHash);
    if (!valid) {
      return NextResponse.json(
        { error: "La contraseña actual no es correcta" },
        { status: 400 }
      );
    }

    const contrasenaHash = await bcrypt.hash(newPassword.trim(), ROUNDS);
    await prisma.usuario.update({
      where: { id: idUsuario },
      data: { contrasenaHash },
    });

    return successResponse({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return handleApiError(error);
  }
}
