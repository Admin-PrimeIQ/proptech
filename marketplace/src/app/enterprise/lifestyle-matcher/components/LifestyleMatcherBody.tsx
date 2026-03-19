"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./LifestyleMatcherBody.module.scss";
import { getLifestyleMatcherData } from "../services/lifestyleMatcher.service";
import { LifestyleMatcherData } from "../types";
import EnterpriseMobileBottomNav from "@/components/Enterprise/EnterpriseMobileBottomNav";
import CategoryList from "./CategoryList";

export default function LifestyleMatcherBody() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LifestyleMatcherData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEta, setSelectedEta] = useState<string>("");
  const [averageSpeed, setAverageSpeed] = useState<number>(40);
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getLifestyleMatcherData();
        if (cancelled) return;
        setData(response);
        setSelectedEta(response.selectedEta);
        setAverageSpeed(response.averageSpeed);
        setTrafficEnabled(response.trafficEnabled);
      } catch {
        if (cancelled) return;
        setError("No se pudo cargar Lifestyle Matcher.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    document.body.classList.add("lifestyle-matcher-page");

    return () => {
      cancelled = true;
      document.body.classList.remove("lifestyle-matcher-page");
    };
  }, []);

  if (loading) {
    return (
      <section className={styles.pageWrap}>
        <p className={styles.feedbackText}>Cargando Lifestyle Matcher...</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.pageWrap}>
        <p className={styles.feedbackText}>{error ?? "No se encontró información."}</p>
      </section>
    );
  }

  return (
    <section className={styles.pageWrap} aria-label="Lifestyle Matcher">
      <div className={styles.mapBackground} aria-hidden>
      
      </div>

      <div className={styles.modalCard}>
        <button type="button" className={styles.closeBtn} aria-label="Cerrar">
          ×
        </button>

        <header className={styles.headerArea}>
          <div className={styles.headerTopRow}>
            <span className={styles.headerMiniTitle}>Búsqueda Ideal</span>
            <small>PASO 1 DE 2</small>
          </div>
          <div>
            <h1>{data.title}</h1>
            <p>{data.subtitle}</p>
          </div>
        </header>

        <div className={styles.progressMeta}>
          <span>{data.stepLabel}</span>
          <small>{data.progressPercent}% completado</small>
        </div>
        <div className={styles.progressBar}>
          <span style={{ width: `${data.progressPercent}%` }}></span>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.leftPane}>
            <h3>Ranking de Prioridades (POI)</h3>
            <p>Arrastra para ordenar tus puntos de interés de mayor a menor importancia.</p>

            <input
              type="text"
              className={styles.searchInput}
              placeholder="Buscar prioridades (ej. Escuela, Hospital)..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Buscar prioridades"
            />

            <CategoryList
              initialItems={data.priorities.map((priority) => ({
                id: priority.id,
                title: priority.name,
                subtitle: priority.subtitle,
              }))}
              searchTerm={searchTerm}
            />

            <div className={styles.paginationMock}>‹ 1 2 3 ›</div>
          </div>

          <div className={styles.rightPane}>
            <h3>Tiempo máximo de traslado</h3>
            <div className={styles.etaRow}>
              {data.etaOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.etaBtn} ${option === selectedEta ? styles.etaBtnActive : ""}`}
                  onClick={() => setSelectedEta(option)}
                  aria-pressed={option === selectedEta}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className={styles.speedRow}>
              <span>VELOCIDAD PROMEDIO</span>
              <strong>{averageSpeed} km/h</strong>
            </div>

            <div className={styles.speedControlArea}>
              <input
                type="range"
                min={10}
                max={120}
                step={5}
                value={averageSpeed}
                onChange={(event) => setAverageSpeed(Number(event.target.value))}
                className={styles.speedSlider}
                aria-label="Seleccionar velocidad promedio"
              />
              <div className={styles.speedScale} aria-hidden>
                {[10, 30, 50, 70, 90, 110].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
            </div>

            <div className={styles.trafficCard}>
              <div>
                <strong>Tráfico en tiempo real</strong>
                <small>Ajustar según flujo actual</small>
              </div>
              <button
                type="button"
                className={trafficEnabled ? styles.toggleOn : styles.toggleOff}
                aria-label="Toggle tráfico en tiempo real"
                aria-pressed={trafficEnabled}
                onClick={() => setTrafficEnabled((prev) => !prev)}
              >
                <span></span>
              </button>
            </div>
          </div>
        </div>

        <footer className={styles.footerArea}>
          <div className={styles.footerActions}>
            <Link href="/enterprise/planes" className={styles.prevBtn}>
              ← Anterior
            </Link>
            <Link href="/enterprise/lifestyle-matcher/puntos" className={styles.nextBtn}>
              Siguiente →
            </Link>
          </div>
        </footer>
      </div>

      <EnterpriseMobileBottomNav activeTab="analysis" />
    </section>
  );
}
