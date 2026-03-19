import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { AuthAdapter } from "@/lib/auth-adapter";

// JWT corto (30 min) para mitigar token "viejo" si cambian roles
const JWT_MAX_AGE = 30 * 60; // 30 minutos

const defaultPermisos = {
  accesoGeneral: false,
  accesoHome: false,
  accesoPropiedades: false,
  accesoConfiguracionPerfil: false,
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: AuthAdapter,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.correo || !credentials?.password) return null;
        const correo = String(credentials.correo).trim().toLowerCase();
        const password = String(credentials.password);

        const { prisma } = await import("@/lib/prisma");
        const usuario = await prisma.usuario.findUnique({
          where: { correo },
          include: {
            roles: { include: { rol: true } },
          },
        });
        if (!usuario || !usuario.activo) return null;
        if (usuario.contrasenaHash == null) return null;
        const ok = await bcrypt.compare(password, usuario.contrasenaHash);
        if (!ok) return null;

        const roles = usuario.roles.map((ur) => ur.rol.claveRol);
        return {
          id: String(usuario.id),
          idPublic: usuario.idPublic,
          email: usuario.correo,
          name: usuario.nombreCompleto ?? usuario.correo,
          correo: usuario.correo,
          nombreCompleto: usuario.nombreCompleto,
          roles,
        };
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })]
      : []),
    ...(process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET
      ? [Facebook({ clientId: process.env.AUTH_FACEBOOK_ID, clientSecret: process.env.AUTH_FACEBOOK_SECRET })]
      : []),
  ],
  session: { strategy: "jwt", maxAge: JWT_MAX_AGE },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.idPublic = (user as { idPublic?: string }).idPublic;
        token.correo = (user as { correo?: string }).correo ?? user.email ?? "";
        token.nombreCompleto = (user as { nombreCompleto?: string | null }).nombreCompleto ?? user.name ?? null;
        token.roles = (user as { roles?: string[] }).roles ?? [];
        if ((!token.idPublic || token.roles.length === 0) && user.id) {
          const { prisma } = await import("@/lib/prisma");
          try {
            const u = await prisma.usuario.findUnique({
              where: { id: BigInt(user.id) },
              include: { roles: { include: { rol: true } } },
            });
            if (u) {
              if (!token.idPublic) token.idPublic = u.idPublic;
              if (token.roles.length === 0) token.roles = u.roles.map((ur) => ur.rol.claveRol);
            }
          } catch {
            // ignore
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.idPublic = token.idPublic ?? "";
        session.user.correo = token.correo ?? "";
        session.user.nombreCompleto = token.nombreCompleto ?? null;
        session.user.roles = token.roles ?? [];
        const idUsuario = Number(token.id);
        const isEdge = process.env.NEXT_RUNTIME === "edge";
        if (Number.isNaN(idUsuario) || isEdge) {
          session.user.permisos = { ...defaultPermisos };
        } else {
          try {
            const { prisma } = await import("@/lib/prisma");
            const p = await prisma.permisosEspecificosUsuario.findUnique({
              where: { idUsuario },
            });
            session.user.permisos = {
              accesoGeneral: p?.accesoGeneral ?? false,
              accesoHome: p?.accesoHome ?? false,
              accesoPropiedades: p?.accesoPropiedades ?? false,
              accesoConfiguracionPerfil: p?.accesoConfiguracionPerfil ?? false,
            };
          } catch {
            session.user.permisos = { ...defaultPermisos };
          }
        }
      }
      return session;
    },
  },
});
