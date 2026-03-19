"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import type { PermisosUsuario } from "@/types/permisos";

const DEFAULT_PERMISOS: PermisosUsuario = {
  accesoGeneral: false,
  accesoHome: false,
  accesoPropiedades: false,
  accesoConfiguracionPerfil: false,
};

function pathRequires(path: string): keyof PermisosUsuario | "always" | null {
  if (path === "/dashboard/my-profile") return "always";
  if (path === "/dashboard") return "accesoHome";
  if (path === "/dashboard/review") return "accesoPropiedades";
  if (path.startsWith("/administrador/agregar-vendedor") || path.startsWith("/administrador/gestion-usuarios")) return "accesoConfiguracionPerfil";
  if (
    path === "/administrador" ||
    path === "/administrador/general" ||
    path === "/administrador/pagina-principal" ||
    path === "/administrador/acerca-de-nosotros" ||
    path === "/administrador/enterprise"
  )
    return "accesoGeneral";
  if (
    path.startsWith("/administrador/agregar-nueva-propiedad") ||
    path.startsWith("/administrador/propiedades")
  )
    return "accesoPropiedades";
  return null;
}

function firstAllowedRoute(p: PermisosUsuario, isVendedor: boolean): string {
  if (p.accesoHome) return "/dashboard";
  if (p.accesoGeneral) return "/administrador/general";
  if (p.accesoPropiedades || isVendedor) return "/administrador/propiedades";
  return "/dashboard/my-profile";
}

export default function PermissionGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const permisos = session?.user?.permisos ?? DEFAULT_PERMISOS;
  const roles = session?.user?.roles ?? [];
  const isVendedor = roles.includes("VENDEDOR");
  const accesoPropiedadesEffective = permisos.accesoPropiedades || isVendedor;

  useEffect(() => {
    if (status !== "authenticated" || !pathname) return;
    const req = pathRequires(pathname);
    if (req === "always") return;
    if (req === null) return;
    const has =
      req === "always" ||
      (req === "accesoPropiedades" ? accesoPropiedadesEffective : permisos[req]);
    if (!has) {
      const target = firstAllowedRoute(permisos, isVendedor);
      router.replace(target);
    }
  }, [pathname, permisos, status, router, accesoPropiedadesEffective, isVendedor]);

  return <>{children}</>;
}
