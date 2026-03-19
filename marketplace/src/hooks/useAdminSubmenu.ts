"use client";

import { useSession } from "next-auth/react";
import type { PermisosUsuario } from "@/types/permisos";

const DEFAULT_PERMISOS: PermisosUsuario = {
  accesoGeneral: false,
  accesoHome: false,
  accesoPropiedades: false,
  accesoConfiguracionPerfil: false,
};

export interface AdminSubItem {
  id: number;
  label: string;
  url?: string;
  signOut?: boolean;
}

export function useAdminSubmenu() {
  const { data: session, status } = useSession();
  const permisos = (session?.user as { permisos?: PermisosUsuario })?.permisos ?? DEFAULT_PERMISOS;
  const roles = (session?.user as { roles?: string[] })?.roles ?? [];
  const isVendedor = roles.includes("VENDEDOR");
  const showConfigPropiedades = permisos.accesoPropiedades || isVendedor;

  const items: AdminSubItem[] = [];
  let id = 0;
  if (permisos.accesoHome) {
    items.push({ id: ++id, label: "Dashboard", url: "/dashboard" });
  }
  if (permisos.accesoGeneral) {
    items.push({ id: ++id, label: "General", url: "/administrador/general" });
    items.push({ id: ++id, label: "Pagina principal", url: "/administrador/pagina-principal" });
    items.push({ id: ++id, label: "Acerca de nosotros", url: "/administrador/acerca-de-nosotros" });
    items.push({ id: ++id, label: "Enterprise", url: "/administrador/enterprise" });
  }
  if (showConfigPropiedades) {
    // Secciones de propiedades y solicitudes se muestran en el menu "Venta" del header.
    // Aqui solo mantenemos opciones propias del perfil/administracion general.
  }
  items.push({ id: ++id, label: "Mi perfil", url: "/dashboard/my-profile" });
  if (permisos.accesoConfiguracionPerfil) {
    items.push({ id: ++id, label: "Gestion de usuarios", url: "/administrador/gestion-usuarios" });
  }
  items.push({ id: ++id, label: "Cerrar sesion", signOut: true });

  return { items, status };
}
