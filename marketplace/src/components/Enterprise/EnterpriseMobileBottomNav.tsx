"use client";

import Link from "next/link";
import styles from "./EnterpriseMobileBottomNav.module.scss";

type NavTab = "dashboard" | "planes" | "analysis" | "perfil";

type EnterpriseMobileBottomNavProps = {
  activeTab: NavTab;
};

const NAV_ITEMS: Array<{ key: NavTab; label: string; href: string; icon: string }> = [
  { key: "dashboard", label: "Dashboard", href: "/enterprise/planes", icon: "▦" },
  { key: "planes", label: "Planes", href: "/enterprise/planes/mejorar", icon: "◉" },
  { key: "analysis", label: "Analisis", href: "/enterprise/mapa-dinamico", icon: "◌" },
  { key: "perfil", label: "Perfil", href: "/enterprise/dashboard", icon: "◯" },
];

export default function EnterpriseMobileBottomNav({ activeTab }: EnterpriseMobileBottomNavProps) {
  return (
    <nav className={styles.mobileBottomNav} aria-label="Navegación móvil enterprise">
      {NAV_ITEMS.map((item) => (
        <Link key={item.key} href={item.href} className={activeTab === item.key ? styles.active : ""}>
          <span className={styles.navIcon}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
