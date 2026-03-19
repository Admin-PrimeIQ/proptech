import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { handleApiError } from "@/lib/api-helpers";
import { sendEmail } from "@/lib/send-email";
import crypto from "crypto";

const ROUNDS = 10;

/** Genera una contraseña aleatoria segura (ej. 16 caracteres alfanuméricos). */
function generateNewPassword(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  const bytes = crypto.randomBytes(16);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        { error: "El correo es obligatorio" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo: email },
    });

    // Respuesta genérica para no revelar si el correo existe
    const successMessage =
      "Si el correo está registrado, recibirás una nueva contraseña en unos momentos.";

    if (!usuario) {
      return NextResponse.json({ message: successMessage }, { status: 200 });
    }

    const newPassword = generateNewPassword();
    const contrasenaHash = await bcrypt.hash(newPassword, ROUNDS);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { contrasenaHash },
    });

    await sendEmail({
      to: usuario.correo,
      subject: "Nueva contraseña - Reinicio de contraseña",
      text: `Hola,\n\nTu nueva contraseña es: ${newPassword}\n\nTe recomendamos cambiarla después de iniciar sesión.\n\nSaludos.`,
    });

    return NextResponse.json({ message: successMessage }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
