import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, successResponse } from "@/lib/api-helpers";
import { requireAdminWithDbCheck } from "@/lib/auth-helpers";

const DEFAULT_PERMISOS = {
  accesoGeneral: false,
  accesoHome: false,
  accesoPropiedades: false,
  accesoConfiguracionPerfil: false,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  const result = await requireAdminWithDbCheck();
  if (!result.authorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const isSuperAdmin = (result.roles ?? []).includes("SUPER_ADMIN");
  if (!isSuperAdmin) {
    return NextResponse.json(
      { error: "Solo Super Admin puede consultar permisos de usuario" },
      { status: 403 }
    );
  }

  const { idPublic } = await params;
  if (!idPublic?.trim()) {
    return NextResponse.json({ error: "idPublic requerido" }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { idPublic: idPublic.trim() },
      select: {
        idPublic: true,
        correo: true,
        nombreCompleto: true,
        activo: true,
        roles: { include: { rol: true } },
        permisos: true,
      },
    });
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const roles = usuario.roles.map((ur) => ur.rol.claveRol);
    const permisos = usuario.permisos
      ? {
          accesoGeneral: usuario.permisos.accesoGeneral,
          accesoHome: usuario.permisos.accesoHome,
          accesoPropiedades: usuario.permisos.accesoPropiedades,
          accesoConfiguracionPerfil: usuario.permisos.accesoConfiguracionPerfil,
        }
      : { ...DEFAULT_PERMISOS };

    return successResponse({
      usuario: {
        idPublic: usuario.idPublic,
        correo: usuario.correo,
        nombreCompleto: usuario.nombreCompleto,
        activo: usuario.activo,
        roles,
      },
      permisos,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  const result = await requireAdminWithDbCheck();
  if (!result.authorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const isSuperAdmin = (result.roles ?? []).includes("SUPER_ADMIN");
  if (!isSuperAdmin) {
    return NextResponse.json(
      { error: "Solo Super Admin puede editar usuarios" },
      { status: 403 }
    );
  }

  const { idPublic } = await params;
  if (!idPublic?.trim()) {
    return NextResponse.json({ error: "idPublic requerido" }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { idPublic: idPublic.trim() },
    });
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { nombreCompleto, correo, activo, permisos: permisosBody } = body as {
      nombreCompleto?: string | null;
      correo?: string;
      activo?: boolean;
      permisos?: {
        accesoHome?: boolean;
        accesoGeneral?: boolean;
        accesoPropiedades?: boolean;
        accesoConfiguracionPerfil?: boolean;
      };
    };

    const data: { nombreCompleto?: string | null; correo?: string; activo?: boolean } = {};
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
    if (typeof activo === "boolean") {
      data.activo = activo;
    }

    if (Object.keys(data).length === 0 && !permisosBody) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
    }

    let actualizado = usuario;
    if (Object.keys(data).length > 0) {
      actualizado = await prisma.usuario.update({
        where: { idPublic: idPublic.trim() },
        data,
      });
    }

    if (permisosBody && typeof permisosBody === "object") {
      const permData = {
        accesoHome: typeof permisosBody.accesoHome === "boolean" ? permisosBody.accesoHome : undefined,
        accesoGeneral: typeof permisosBody.accesoGeneral === "boolean" ? permisosBody.accesoGeneral : undefined,
        accesoPropiedades: typeof permisosBody.accesoPropiedades === "boolean" ? permisosBody.accesoPropiedades : undefined,
        accesoConfiguracionPerfil: typeof permisosBody.accesoConfiguracionPerfil === "boolean" ? permisosBody.accesoConfiguracionPerfil : undefined,
      };
      const permKeys = Object.keys(permData).filter((k) => (permData as Record<string, unknown>)[k] !== undefined);
      if (permKeys.length > 0) {
        const existing = await prisma.permisosEspecificosUsuario.findUnique({
          where: { idUsuario: usuario.id },
        });
        const toUpsert = {
          accesoHome: permData.accesoHome ?? existing?.accesoHome ?? false,
          accesoGeneral: permData.accesoGeneral ?? existing?.accesoGeneral ?? false,
          accesoPropiedades: permData.accesoPropiedades ?? existing?.accesoPropiedades ?? false,
          accesoConfiguracionPerfil: permData.accesoConfiguracionPerfil ?? existing?.accesoConfiguracionPerfil ?? false,
        };
        if (existing) {
          await prisma.permisosEspecificosUsuario.update({
            where: { idUsuario: usuario.id },
            data: toUpsert,
          });
        } else {
          await prisma.permisosEspecificosUsuario.create({
            data: {
              idUsuario: usuario.id,
              ...toUpsert,
            },
          });
        }
      }
    }

    return successResponse({
      idPublic: actualizado.idPublic,
      correo: actualizado.correo,
      nombreCompleto: actualizado.nombreCompleto,
      activo: actualizado.activo,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ idPublic: string }> }
) {
  const result = await requireAdminWithDbCheck();
  if (!result.authorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const isSuperAdmin = (result.roles ?? []).includes("SUPER_ADMIN");
  if (!isSuperAdmin) {
    return NextResponse.json(
      { error: "Solo Super Admin puede eliminar usuarios" },
      { status: 403 }
    );
  }

  const { idPublic } = await params;
  if (!idPublic?.trim()) {
    return NextResponse.json({ error: "idPublic requerido" }, { status: 400 });
  }

  const currentIdPublic = result.session?.user?.idPublic;
  if (currentIdPublic === idPublic.trim()) {
    return NextResponse.json(
      { error: "No puedes eliminar tu propio usuario" },
      { status: 400 }
    );
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { idPublic: idPublic.trim() },
    });
    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    await prisma.usuario.delete({
      where: { idPublic: idPublic.trim() },
    });

    return successResponse({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
