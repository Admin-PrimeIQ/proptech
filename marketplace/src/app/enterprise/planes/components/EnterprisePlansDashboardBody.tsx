"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./EnterprisePlansDashboardBody.module.scss";
import { getEnterprisePlansDashboardData } from "../services/enterprisePlansDashboard.service";
import { EnterprisePlansDashboardData } from "../types";
import EnterpriseMobileBottomNav from "@/components/Enterprise/EnterpriseMobileBottomNav";

export default function EnterprisePlansDashboardBody() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EnterprisePlansDashboardData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const result = await getEnterprisePlansDashboardData();
        if (cancelled) return;
        setData(result);
      } catch {
        if (cancelled) return;
        setError("No se pudo cargar la información del dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const maxSeriesValue = useMemo(() => {
    if (!data?.lifestyleSeries?.length) return 1;
    return Math.max(...data.lifestyleSeries, 1);
  }, [data?.lifestyleSeries]);

  if (loading) {
    return (
      <section className={styles.pageWrap} aria-label="Cargando dashboard de planes">
        <div className={styles.fullViewport}>
          <p className={styles.feedbackText}>Cargando dashboard de planes...</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.pageWrap} aria-label="Error de dashboard de planes">
        <div className={styles.fullViewport}>
          <p className={styles.feedbackText}>{error ?? "No se encontró información del dashboard."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.pageWrap} aria-label="Dashboard de planes enterprise">
      <div className={styles.fullViewport}>
        <div className={`${styles.dashboardShell} ${styles.desktopOnly}`}>
          <div className={styles.contentWrap}>
            <h1 className={styles.welcomeTitle}>Bienvenido de nuevo, {data.userName}</h1>
            <p className={styles.dateLine}>{data.dateLabel}</p>

            <div className={styles.actionRow}>
              <Link href="/enterprise/planes/proyectos" className={styles.btnSecondary}>
                Ver información guardada
              </Link>
            </div>

            <article className={styles.subscriptionCard}>
              <div className={styles.subscriptionInfo}>
                <span className={styles.badge}>{data.subscriptionLabel}</span>
                <h2>{data.subscriptionTitle}</h2>
                <p>{data.subscriptionDescription}</p>
                <Link href="/enterprise/planes/mejorar" className={styles.upgradeBtn}>
                  Mejorar Plan
                </Link>
              </div>
              <div className={styles.subscriptionArt} aria-hidden>
                <div className={styles.graphArt}></div>
              </div>
            </article>

            <div className={styles.bottomGrid}>
              <article className={styles.mapCard}>
                <div className={styles.cardHead}>
                  <h3>Mapa Dinámico</h3>
                  <Link href="/enterprise/mapa-dinamico">Ver detalles</Link>
                </div>
                <div className={styles.mapMock} aria-hidden>
                  <div className={styles.mapPin}></div>
                  <span className={styles.mapCity}>Madrid</span>
                </div>
              </article>

              <article className={styles.metricCard}>
                <div className={styles.cardHead}>
                  <h3>Lifestyle Matcher</h3>
                  <span className={styles.growthLabel}>{data.lifestyleGrowthLabel}</span>
                </div>
                <p className={styles.metricLabel}>Crecimiento de coincidencia mensual</p>
                <p className={styles.metricValue}>{data.lifestyleMatchPercent.toFixed(1)}%</p>
                <Link href="/enterprise/lifestyle-matcher" className={styles.metricOverlayLink} aria-label="Abrir Lifestyle Matcher"></Link>
                <div className={styles.chartBars} aria-label="Serie mensual lifestyle matcher">
                  {data.lifestyleSeries.map((value, idx) => {
                    const isHighlight = idx === data.lifestyleSeries.length - 2;
                    const height = `${Math.max((value / maxSeriesValue) * 100, 14)}%`;
                    return (
                      <div key={data.lifestyleMonths[idx]} className={styles.barCol}>
                        <span
                          className={`${styles.bar} ${isHighlight ? styles.barActive : ""}`}
                          style={{ height }}
                        ></span>
                        <small>{data.lifestyleMonths[idx]}</small>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          </div>
        </div>

        <div className={styles.mobileOnly}>
          <div className={styles.mobileContent}>
            <h1 className={styles.mobileTitle}>Bienvenido de nuevo, {data.userName}</h1>
            <p className={styles.mobileRole}>ANALISTA DE DATOS SENIOR</p>

            <h2 className={styles.mobileSectionTitle}>ACCIONES RÁPIDAS</h2>
            <div className={styles.mobileActionGrid}>
              <Link
                href="/enterprise/planes/proyectos"
                className={`${styles.mobileActionCard} ${styles.mobileActionSecondary}`}
              >
                <span className={styles.actionIcon}>◉</span>
                <span>Ver información</span>
              </Link>
            </div>

            <article className={styles.mobilePlanCard}>
              <div>
                <p>PLAN ACTUAL</p>
                <h3>Básico</h3>
                <small>Renueva en 12 días</small>
              </div>
              <Link href="/enterprise/planes/mejorar">Upgrade</Link>
            </article>

            <h2 className={styles.mobileSectionTitle}>MONITOREO Y ANÁLISIS</h2>

            <article className={styles.mobileMapCard}>
              <div className={styles.mobileCardHead}>
                <div className={styles.mobileCardTitle}>
                  <span className={styles.iconBox}>⌖</span>
                  <strong>Mapa Dinámico</strong>
                </div>
                <span className={styles.liveBadge}>EN VIVO</span>
              </div>
              <div className={styles.mobileMapMock}></div>
            </article>

            <article className={styles.mobileMetricCard}>
              <div className={styles.mobileMetricHead}>
                <div className={styles.mobileCardTitle}>
                  <span className={styles.iconBox}>↗</span>
                  <div>
                    <strong>Lifestyle Matcher</strong>
                    <p>Crecimiento de segmentación</p>
                  </div>
                </div>
                <div className={styles.mobileGrowth}>
                  <strong>+24.8%</strong>
                  <small>este mes</small>
                </div>
              </div>
              <div className={styles.mobileBars}>
                <span style={{ height: "42%" }}></span>
                <span style={{ height: "58%" }}></span>
                <span style={{ height: "38%" }}></span>
                <span style={{ height: "70%" }}></span>
                <span style={{ height: "52%" }}></span>
                <span style={{ height: "80%" }}></span>
                <span style={{ height: "92%" }}></span>
              </div>
              <Link href="/enterprise/lifestyle-matcher" className={styles.metricOverlayLink} aria-label="Abrir Lifestyle Matcher"></Link>
            </article>
          </div>

          <EnterpriseMobileBottomNav activeTab="dashboard" />
        </div>
      </div>
    </section>
  );
}
