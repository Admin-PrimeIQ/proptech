import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";
import type { PermisosUsuario } from "./permisos";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      idPublic: string;
      correo: string;
      nombreCompleto?: string | null;
      roles: string[];
      permisos?: PermisosUsuario;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    idPublic?: string;
    correo?: string;
    nombreCompleto?: string | null;
    roles?: string[];
  }
}
