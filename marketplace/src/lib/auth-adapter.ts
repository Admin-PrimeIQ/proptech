/**
 * Adapter de Auth.js que usa Usuario + Account.
 * Permite OAuth (Google, Facebook) manteniendo Usuario como única entidad de usuario.
 */

import type { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";

const DEFAULT_ROL_VENDEDOR = "VENDEDOR";

function toAdapterUser(usuario: {
  id: bigint;
  idPublic: string;
  correo: string;
  nombreCompleto: string | null;
}): AdapterUser {
  return {
    id: String(usuario.id),
    email: usuario.correo,
    name: usuario.nombreCompleto ?? usuario.correo,
    emailVerified: null,
  };
}

export const AuthAdapter: Adapter = {
  async createUser(user) {
    const email = (user.email ?? "").trim().toLowerCase();
    if (!email) throw new Error("Email requerido para crear usuario");

    const existente = await prisma.usuario.findUnique({
      where: { correo: email },
    });
    if (existente) {
      return toAdapterUser(existente);
    }

    const rolVendedor = await prisma.rol.findUnique({
      where: { claveRol: DEFAULT_ROL_VENDEDOR },
    });
    if (!rolVendedor) throw new Error("Rol VENDEDOR no configurado. Ejecute el seed.");

    const usuario = await prisma.usuario.create({
      data: {
        correo: email,
        contrasenaHash: null,
        nombreCompleto: (user.name ?? email).trim() || null,
        activo: true,
      },
    });

    await prisma.usuarioRol.create({
      data: {
        idUsuario: usuario.id,
        idRol: rolVendedor.id,
      },
    });

    return {
      id: String(usuario.id),
      email: usuario.correo,
      name: usuario.nombreCompleto ?? usuario.correo,
      image: (user as { image?: string | null }).image ?? null,
      emailVerified: null,
    };
  },

  async getUser(id) {
    const idNum = BigInt(id);
    const usuario = await prisma.usuario.findUnique({
      where: { id: idNum },
    });
    if (!usuario) return null;
    return toAdapterUser(usuario);
  },

  async getUserByEmail(email) {
    const usuario = await prisma.usuario.findUnique({
      where: { correo: email.trim().toLowerCase() },
    });
    if (!usuario) return null;
    return toAdapterUser(usuario);
  },

  async getUserByAccount({ provider, providerAccountId }) {
    const account = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: { provider, providerAccountId },
      },
    });
    if (!account) return null;
    return this.getUser(account.userId);
  },

  async linkAccount(account: AdapterAccount) {
    await prisma.account.create({
      data: {
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token ?? undefined,
        access_token: account.access_token ?? undefined,
        expires_at: account.expires_at ?? undefined,
        token_type: account.token_type ?? undefined,
        scope: account.scope ?? undefined,
        id_token: account.id_token ?? undefined,
        session_state: account.session_state ?? undefined,
      },
    });
  },
};
