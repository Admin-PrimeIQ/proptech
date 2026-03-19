import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const correo = searchParams.get("correo");

    if (!correo) {
      const firstUser = await prisma.usuario.findFirst();
      if (!firstUser) {
        return NextResponse.json(
          { error: "No hay usuarios en el sistema" },
          { status: 404 }
        );
      }
      return successResponse({
        idPublic: firstUser.idPublic,
        correo: firstUser.correo,
        nombreCompleto: firstUser.nombreCompleto,
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return successResponse({
      idPublic: usuario.idPublic,
      correo: usuario.correo,
      nombreCompleto: usuario.nombreCompleto,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
