"use client"
import { AddPropertySvg, MyPropertiesSvg, ReviewsSvg, IdentityDockSvg, LogoutSvg, DashboardSvg } from "@/components/SVG";
import Link from "next/link";
import { JSX, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import type { PermisosUsuario } from "@/types/permisos";

interface SidebarItem {
  href: string;
  label: string;
  icon: JSX.Element;
  signOut?: boolean;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const DEFAULT_PERMISOS: PermisosUsuario = {
  accesoGeneral: false,
  accesoHome: false,
  accesoPropiedades: false,
  accesoConfiguracionPerfil: false,
};

const Sidebar = () => {
  const [activePath, setActivePath] = useState<string>("");
  const { data: session, status } = useSession();
  const permisos = session?.user?.permisos ?? DEFAULT_PERMISOS;

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  const mainSection: SidebarSection = {
    title: "Inicio",
    items: [{ href: "/dashboard", label: "Dashboard", icon: <DashboardSvg /> }],
  };

  const configuracionPaginaSection: SidebarSection = {
    title: "Configuracion Pagina",
    items: [
      { href: "/administrador/general", label: "General", icon: <DashboardSvg /> },
      { href: "/administrador/pagina-principal", label: "Pagina principal", icon: <DashboardSvg /> },
      { href: "/administrador/acerca-de-nosotros", label: "Acerca de nosotros", icon: <DashboardSvg /> },
      { href: "/administrador/enterprise", label: "Enterprise", icon: <DashboardSvg /> },
    ],
  };

  const configuracionPropiedadesSection: SidebarSection = {
    title: "Configuracion Propiedades",
    items: [
      { href: "/administrador/agregar-nueva-propiedad", label: "Agregar nueva propiedad", icon: <AddPropertySvg /> },
      { href: "/administrador/propiedades", label: "Propiedades", icon: <MyPropertiesSvg /> },
      { href: "/dashboard/review", label: "Solicitudes", icon: <ReviewsSvg /> },
    ],
  };

  const manageAccountBase: SidebarItem[] = [
    { href: "/dashboard/my-profile", label: "Mi perfil", icon: <IdentityDockSvg /> },
  ];
  const manageAccountExtra: SidebarItem[] = permisos.accesoConfiguracionPerfil
    ? [{ href: "/administrador/gestion-usuarios", label: "Gestion de usuarios", icon: <AddPropertySvg /> }]
    : [];
  const manageAccountSection: SidebarSection = {
    title: "Administracion de cuenta",
    items: [
      ...manageAccountBase,
      ...manageAccountExtra,
      { href: "#", label: "Cerrar sesion", icon: <LogoutSvg />, signOut: true },
    ],
  };

  const renderSection = (section: SidebarSection) => (
    <div className="tp-dashboard-sidebar-content pb-70">
      <h4 className="tp-dashboard-sidebar-title">{section.title}</h4>
      {section.items.map((item, index) => (
        <div className="tp-dashboard-sidebar-item" key={index}>
          {item.signOut ? (
            <button
              type="button"
              className="tp-dashboard-sidebar-signout"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ) : (
            <Link
              href={item.href}
              className={activePath === item.href ? "active" : ""}
              onClick={() => setActivePath(item.href)}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );

  const roles = session?.user?.roles ?? [];
  const isVendedor = roles.includes("VENDEDOR");
  const showConfigPropiedades = permisos.accesoPropiedades || isVendedor;

  const sections: { show: boolean; section: SidebarSection }[] = [
    { show: permisos.accesoHome, section: mainSection },
    { show: permisos.accesoGeneral, section: configuracionPaginaSection },
    { show: showConfigPropiedades, section: configuracionPropiedadesSection },
    { show: true, section: manageAccountSection },
  ];

  if (status === "loading") {
    return (
      <div className="tp-dashboard-sidebar d-none d-xxl-block">
        <div className="tp-dashboard-sidebar-wrap">
          {renderSection(mainSection)}
          {renderSection(configuracionPaginaSection)}
          {renderSection(configuracionPropiedadesSection)}
          {renderSection(manageAccountSection)}
        </div>
      </div>
    );
  }

  return (
    <div className="tp-dashboard-sidebar d-none d-xxl-block">
      <div className="tp-dashboard-sidebar-wrap">
        {sections.filter((s) => s.show).map((s, i) => (
          <div key={i}>{renderSection(s.section)}</div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
