import styles from "./EnterpriseDashboardBody.module.scss";
import Link from "next/link";

type KpiItem = {
  title: string;
  href: string;
};

type ModuleItem = {
  title: string;
  subtitle?: string;
  height?: "sm" | "md" | "lg";
};

const KPI_ITEMS: KpiItem[] = [
  { title: "Mapa dinamico", href: "/enterprise/mapa-dinamico" },
  { title: "Mapa de absorcion", href: "/enterprise/mapa-absorcion" },
];

const MAIN_MODULES: ModuleItem[] = [
  { title: "Revenue Summary", subtitle: "Módulo para gráfica principal de ingresos", height: "md" },
  { title: "Property Breakdown", subtitle: "Módulo para barras por tipo de propiedad", height: "md" },
  { title: "Property Price Index", subtitle: "Módulo para evolución de precios", height: "md" },
  { title: "Property Map", subtitle: "Módulo para mapa geográfico", height: "md" },
  { title: "Recent Activity", subtitle: "Módulo para timeline de actividad", height: "sm" },
  { title: "Top Agents", subtitle: "Módulo para ranking de agentes", height: "sm" },
  { title: "Properties by Types", subtitle: "Módulo para dona/composición", height: "sm" },
];

const SIDEBAR_MODULES: ModuleItem[] = [
  { title: "Feature / CTA", subtitle: "Módulo promocional lateral", height: "sm" },
  { title: "Popular Properties", subtitle: "Módulo de propiedades destacadas", height: "lg" },
];

function ModuleCard({ title, subtitle, height = "md" }: ModuleItem) {
  return (
    <article className={styles.moduleCard}>
      <header className={styles.moduleHeader}>
        <h4>{title}</h4>
      </header>
      {subtitle ? <p className={styles.moduleSubtitle}>{subtitle}</p> : null}
      <div
        className={`${styles.placeholder} ${height === "sm" ? styles.hSm : ""} ${
          height === "lg" ? styles.hLg : ""
        }`}
      >
        Espacio reservado para gráfica / widget
      </div>
    </article>
  );
}

function KpiCard({ title, href }: KpiItem) {
  return (
    <article className={styles.kpiCard}>
      <span>{title}</span>
      <Link href={href} className={styles.kpiActionBtn}>
        Mapa
      </Link>
    </article>
  );
}

export default function EnterpriseDashboardBody() {
  return (
    <section className={styles.dashboardArea} aria-label="Dashboard Enterprise">
      <div className="container">
        <div className={styles.sectionHeading}>
          <h3>Nuestros servicios</h3>
        </div>

        <div className={styles.kpiGrid}>
          {KPI_ITEMS.map((item) => (
            <KpiCard key={item.title} title={item.title} href={item.href} />
          ))}
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.mainGrid}>
            {MAIN_MODULES.map((module) => (
              <ModuleCard key={module.title} {...module} />
            ))}
          </div>

          <aside className={styles.sidebarGrid}>
            {SIDEBAR_MODULES.map((module) => (
              <ModuleCard key={module.title} {...module} />
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
