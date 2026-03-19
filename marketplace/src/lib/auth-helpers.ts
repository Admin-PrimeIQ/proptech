import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];
const ROL_VENDEDOR = "VENDEDOR";

/**
 * Obtiene la sesión actual (para uso en Server Components o API routes).
 */
export async function getSession() {
  return auth();
}

/**
 * Exige sesión; si no hay, retorna null (para usar en API y devolver 401).
 */
export async function requireSession() {
  const session = await auth();
  return session ?? null;
}

/**
 * Verifica que el usuario tenga rol ADMIN o SUPER_ADMIN según la sesión (JWT).
 */
export function isAdminFromSession(session: { user?: { roles?: string[] } } | null): boolean {
  const roles = session?.user?.roles ?? [];
  return ADMIN_ROLES.some((r) => roles.includes(r));
}

/**
 * Verifica si el usuario tiene rol VENDEDOR según la sesión (JWT).
 */
export function isVendedorFromSession(session: { user?: { roles?: string[] } } | null): boolean {
  const roles = session?.user?.roles ?? [];
  return roles.includes(ROL_VENDEDOR);
}

/**
 * Obtiene sesión y roles desde la DB (para APIs que necesitan rol actualizado).
 * Retorna session + roles; si no hay sesión o usuario inactivo, roles = [].
 */
export async function getSessionWithRoles(): Promise<{
  session: Awaited<ReturnType<typeof auth>>;
  roles: string[];
  idUsuario: number | null;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { session, roles: [], idUsuario: null };
  }
  const idUsuario = Number(session.user.id);
  if (Number.isNaN(idUsuario)) {
    return { session, roles: [], idUsuario: null };
  }
  const usuario = await prisma.usuario.findUnique({
    where: { id: idUsuario },
    include: { roles: { include: { rol: true } } },
  });
  if (!usuario?.activo) {
    return { session, roles: [], idUsuario };
  }
  const roles = usuario.roles.map((ur) => ur.rol.claveRol);
  return { session, roles, idUsuario };
}

/**
 * Para rutas admin: además del JWT, hace un check rápido a DB para confirmar roles.
 * Mitiga el problema del token "viejo" (ej. si le quitaste ADMIN a alguien).
 * Usar en APIs de administrador.
 */
export async function requireAdminWithDbCheck() {
  const session = await auth();
  if (!session?.user?.id) return { authorized: false as const, session: null };

  const idUsuario = Number(session.user.id);
  if (Number.isNaN(idUsuario)) return { authorized: false as const, session };

  const usuario = await prisma.usuario.findUnique({
    where: { id: idUsuario },
    include: { roles: { include: { rol: true } } },
  });
  if (!usuario?.activo) return { authorized: false as const, session };

  const roles = usuario.roles.map((ur) => ur.rol.claveRol);
  const isAdmin = ADMIN_ROLES.some((r) => roles.includes(r));
  return {
    authorized: isAdmin as true,
    session,
    roles,
  } as { authorized: true; session: NonNullable<typeof session>; roles: string[] };
}
