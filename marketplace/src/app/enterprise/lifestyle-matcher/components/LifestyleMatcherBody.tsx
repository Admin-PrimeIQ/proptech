"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./LifestyleMatcherBody.module.scss";
import { getLifestyleMatcherData } from "../services/lifestyleMatcher.service";
import { LifestyleMatcherData } from "../types";
import EnterpriseMobileBottomNav from "@/components/Enterprise/EnterpriseMobileBottomNav";
import CategoryList from "./CategoryList";
import type { Category } from "./CategoryItem";
import { loadCachedPriorities, saveCachedPriorities } from "../services/lifestyleMatcherCache.service";
import { PRIORITY_SUGGESTIONS_CATALOG } from "../services/prioritySuggestionsCatalog";
import { PRIORITY_LIST_MAX_ITEMS, serializePriorities } from "./lifestyleMatcherPriorities.constants";

export default function LifestyleMatcherBody() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LifestyleMatcherData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEta, setSelectedEta] = useState<string>("");
  const [averageSpeed, setAverageSpeed] = useState<number>(40);
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [priorities, setPriorities] = useState<Category[]>([]);
  const [priorityCapacityMessage, setPriorityCapacityMessage] = useState<string | null>(null);

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
        const fallbackPriorities = response.priorities.map((priority) => ({
          id: priority.id,
          title: priority.name,
          subtitle: priority.subtitle,
        }));
        const cachedPriorities = loadCachedPriorities();
        const rawPriorities = cachedPriorities && cachedPriorities.length > 0 ? cachedPriorities : fallbackPriorities;
        const nextPriorities = rawPriorities.slice(0, PRIORITY_LIST_MAX_ITEMS);
        setPriorities(nextPriorities);
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

  const prioritiesForList = useMemo(() => {
    if (priorities.length > 0) return priorities;
    if (!data) return [];
    return data.priorities.map((priority) => ({
      id: priority.id,
      title: priority.name,
      subtitle: priority.subtitle,
    }));
  }, [priorities, data]);

  const suggestedPriorities = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];
    const alreadySelected = new Set(prioritiesForList.map((item) => item.title.trim().toLowerCase()));
    return PRIORITY_SUGGESTIONS_CATALOG.filter((option) => {
      if (alreadySelected.has(option.title.trim().toLowerCase())) return false;
      return (
        option.title.toLowerCase().includes(query) ||
        option.subtitle.toLowerCase().includes(query)
      );
    }).slice(0, 6);
  }, [searchTerm, prioritiesForList]);

  const handlePrioritiesChange = useCallback((items: Category[]) => {
    const trimmed = items.slice(0, PRIORITY_LIST_MAX_ITEMS);
    setPriorities((prev) => {
      if (serializePriorities(prev) === serializePriorities(trimmed)) return prev;
      saveCachedPriorities(trimmed);
      return trimmed;
    });
    if (trimmed.length < PRIORITY_LIST_MAX_ITEMS) {
      setPriorityCapacityMessage(null);
    }
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
            {suggestedPriorities.length > 0 ? (
              <div className={styles.searchSuggestions} role="listbox" aria-label="Sugerencias de prioridades">
                {suggestedPriorities.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={styles.searchSuggestionItem}
                    onClick={() => {
                      if (prioritiesForList.length >= PRIORITY_LIST_MAX_ITEMS) {
                        setPriorityCapacityMessage(`Puedes tener como máximo ${PRIORITY_LIST_MAX_ITEMS} prioridades.`);
                        return;
                      }
                      setPriorityCapacityMessage(null);
                      const newId =
                        typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto
                          ? globalThis.crypto.randomUUID()
                          : `custom-${option.key}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
                      const nextCategory: Category = {
                        id: newId,
                        title: option.title,
                        subtitle: option.subtitle,
                      };
                      const next = [...prioritiesForList, nextCategory];
                      setPriorities(next);
                      saveCachedPriorities(next);
                      setSearchTerm("");
                    }}
                  >
                    <strong>{option.title}</strong>
                    <small>{option.subtitle}</small>
                  </button>
                ))}
              </div>
            ) : null}

            {priorityCapacityMessage ? (
              <p className={styles.priorityCapacityHint} role="status">
                {priorityCapacityMessage}
              </p>
            ) : null}

            <CategoryList initialItems={prioritiesForList} onChange={handlePrioritiesChange} />
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
