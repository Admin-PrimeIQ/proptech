import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { requireAdminWithDbCheck } from "@/lib/auth-helpers";

const ROUNDS = 10;
const ROLES_ADMIN_CREABLES = ["ADMIN", "SUPER_ADMIN"];

export async function GET(request: NextRequest) {
  const { authorized } = await requireAdminWithDbCheck();
  if (!authorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const nombre = searchParams.get("nombre")?.trim() || "";
    const rol = searchParams.get("rol")?.trim() || "";

    const where: {
      OR?: Array<{ nombreCompleto?: { contains: string; mode: "insensitive" }; correo?: { contains: string; mode: "insensitive" } }>;
      roles?: { some: { rol: { claveRol: string } } };
    } = {};

    if (nombre) {
      where.OR = [
        { nombreCompleto: { contains: nombre, mode: "insensitive" } },
        { correo: { contains: nombre, mode: "insensitive" } },
      ];
    }
    if (rol) {
      where.roles = { some: { rol: { claveRol: rol } } };
    }

    const usuarios = await prisma.usuario.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      select: {
        idPublic: true,
        correo: true,
        nombreCompleto: true,
        activo: true,
        fechaCreacion: true,
        roles: { include: { rol: true } },
      },
      orderBy: { fechaCreacion: "desc" },
    });
    const list = usuarios.map((u) => ({
      idPublic: u.idPublic,
      correo: u.correo,
      nombreCompleto: u.nombreCompleto,
      activo: u.activo,
      fechaCreacion: u.fechaCreacion,
      roles: u.roles.map((ur) => ur.rol.claveRol),
    }));
    return successResponse(list);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  const result = await requireAdminWithDbCheck();
  if (!result.authorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const currentUserRoles = result.roles ?? [];
  const isSuperAdmin = currentUserRoles.includes("SUPER_ADMIN");

  try {
    const body = await request.json();
    const { correo, password, nombreCompleto, rol } = body as {
      correo?: string;
      password?: string;
      nombreCompleto?: string;
      rol?: string;
    };

    const email = typeof correo === "string" ? correo.trim().toLowerCase() : "";
    if (!email) {
      return NextResponse.json({ error: "El correo es obligatorio" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }
    const rolClave = rol === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN";
    if (!ROLES_ADMIN_CREABLES.includes(rolClave)) {
      return NextResponse.json(
        { error: "Rol debe ser ADMIN o SUPER_ADMIN" },
        { status: 400 }
      );
    }

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: "Solo un Super Admin puede crear usuarios Admin o Super Admin" },
        { status: 403 }
      );
    }

    const existente = await prisma.usuario.findUnique({ where: { correo: email } });
    if (existente) {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese correo" },
        { status: 409 }
      );
    }

    const rolEntity = await prisma.rol.findUnique({ where: { claveRol: rolClave } });
    if (!rolEntity) {
      return NextResponse.json(
        { error: "Rol no encontrado. Ejecute el seed." },
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
      data: { idUsuario: usuario.id, idRol: rolEntity.id },
    });
    const accesoConfiguracionPerfil = rolClave === "SUPER_ADMIN";
    await prisma.permisosEspecificosUsuario.create({
      data: {
        idUsuario: usuario.id,
        accesoGeneral: true,
        accesoHome: true,
        accesoPropiedades: true,
        accesoConfiguracionPerfil,
      },
    });

    return successResponse({
      idPublic: usuario.idPublic,
      correo: usuario.correo,
      nombreCompleto: usuario.nombreCompleto,
      rol: rolClave,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
