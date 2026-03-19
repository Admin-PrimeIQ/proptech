import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { handleApiError, successResponse } from "@/lib/api-helpers";

const ROUNDS = 10;
const DEFAULT_ROL_VENDEDOR = "VENDEDOR";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { correo, password, nombreCompleto } = body as {
      correo?: string;
      password?: string;
      nombreCompleto?: string;
    };

    const email = typeof correo === "string" ? correo.trim().toLowerCase() : "";
    if (!email) {
      return NextResponse.json(
        { error: "El correo es obligatorio" },
        { status: 400 }
      );
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const existente = await prisma.usuario.findUnique({
      where: { correo: email },
    });
    if (existente) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese correo" },
        { status: 409 }
      );
    }

    const rolVendedor = await prisma.rol.findUnique({
      where: { claveRol: DEFAULT_ROL_VENDEDOR },
    });
    if (!rolVendedor) {
      return NextResponse.json(
        { error: "Rol VENDEDOR no configurado. Ejecute el seed." },
        { status: 500 }
      );
    }

    const contrasenaHash = await bcrypt.hash(password, ROUNDS);
    const usuario = await prisma.usuario.create({
      data: {
        correo: email,
        contrasenaHash,
        nombreCompleto: nombreCompleto?.trim() || null,
        activo: true,
      },
    });

    await prisma.usuarioRol.create({
      data: {
        idUsuario: usuario.id,
        idRol: rolVendedor.id,
      },
    });

    return successResponse({
      idPublic: usuario.idPublic,
      correo: usuario.correo,
      nombreCompleto: usuario.nombreCompleto,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
