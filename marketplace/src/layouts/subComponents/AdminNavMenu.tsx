"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import type { PermisosUsuario } from "@/types/permisos";

const DEFAULT_PERMISOS: PermisosUsuario = {
  accesoGeneral: false,
  accesoHome: false,
  accesoPropiedades: false,
  accesoConfiguracionPerfil: false,
};

interface NavItem {
  id: number;
  label: string;
  url?: string;
  signOut?: boolean;
}

export default function AdminNavMenu() {
  const [hovered, setHovered] = useState(false);
  const { data: session, status } = useSession();
  const permisos = session?.user?.permisos ?? DEFAULT_PERMISOS;
  const roles = session?.user?.roles ?? [];
  const isVendedor = roles.includes("VENDEDOR");
  const showConfigPropiedades = permisos.accesoPropiedades || isVendedor;

  const items: NavItem[] = [];
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
    items.push({ id: ++id, label: "Agregar nueva propiedad", url: "/administrador/agregar-nueva-propiedad" });
    items.push({ id: ++id, label: "Propiedades", url: "/administrador/propiedades" });
    items.push({ id: ++id, label: "Solicitudes", url: "/dashboard/review" });
  }
  items.push({ id: ++id, label: "Mi perfil", url: "/dashboard/my-profile" });
  if (permisos.accesoConfiguracionPerfil) {
    items.push({ id: ++id, label: "Gestion de usuarios", url: "/administrador/gestion-usuarios" });
  }
  items.push({ id: ++id, label: "Cerrar sesion", signOut: true });

  if (status === "loading") {
    return (
      <ul>
        <li className="has-dropdown">
          <Link className="hover" href="/administrador">Mi perfil</Link>
          <ul className="sub-menu">
            <li><Link href="/dashboard/my-profile"><span>Mi perfil</span></Link></li>
          </ul>
        </li>
      </ul>
    );
  }

  return (
    <ul>
      <li
        className="has-dropdown"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link className={hovered ? "hover" : ""} href="/administrador">Mi perfil</Link>
        <ul className="sub-menu">
          {items.map((item) => (
            <li key={item.id}>
              {item.signOut ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/sign-in" })}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                    color: "inherit",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link href={item.url!}><span>{item.label}</span></Link>
              )}
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
}
