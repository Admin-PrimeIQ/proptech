"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./HousingPeriodFilter.module.scss";
import { fetchHousingPeriodsCatalog } from "../services/markers/housingPeriods.service";
import type { HousingPeriodFilterState, HousingPeriodQuarter, HousingPeriodsCatalog } from "./lifestyleMatcherPoints.types";

type HousingPeriodFilterProps = {
  value: HousingPeriodFilterState;
  onChange: (next: HousingPeriodFilterState) => void;
};

const QUARTER_ORDER: HousingPeriodQuarter[] = ["1T", "2T", "3T", "4T"];

function sortQuarters(quarters: HousingPeriodQuarter[]) {
  return [...quarters].sort((a, b) => QUARTER_ORDER.indexOf(a) - QUARTER_ORDER.indexOf(b));
}

export default function HousingPeriodFilter(props: HousingPeriodFilterProps) {
  const { value, onChange } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<HousingPeriodsCatalog>({
    years: [],
    quartersByYear: {},
    availableQuarters: [],
  });

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const nextCatalog = await fetchHousingPeriodsCatalog();
        if (!active) return;
        setCatalog(nextCatalog);
      } catch (fetchError: unknown) {
        if (!active) return;
        setError(fetchError instanceof Error ? fetchError.message : "No se pudo cargar periodos.");
      } finally {
        if (active) setLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  const availableQuarters = useMemo<HousingPeriodQuarter[]>(() => {
    if (value.anio) {
      return sortQuarters(catalog.quartersByYear[value.anio] ?? []);
    }
    return sortQuarters(catalog.availableQuarters);
  }, [catalog.availableQuarters, catalog.quartersByYear, value.anio]);

  useEffect(() => {
    if (!value.trimestre) return;
    if (availableQuarters.includes(value.trimestre)) return;
    onChange({ ...value, trimestre: null });
  }, [availableQuarters, onChange, value]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Año</span>
          <select
            className={styles.select}
            value={value.anio ?? ""}
            onChange={(event) => {
              const nextYear = event.target.value ? event.target.value : null;
              onChange({ ...value, anio: nextYear });
            }}
            disabled={loading}
          >
            <option value="">Todos</option>
            {catalog.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Trimestre</span>
          <select
            className={styles.select}
            value={value.trimestre ?? ""}
            onChange={(event) => {
              const nextQuarter = event.target.value ? (event.target.value as HousingPeriodQuarter) : null;
              onChange({ ...value, trimestre: nextQuarter });
            }}
            disabled={loading || availableQuarters.length === 0}
          >
            <option value="">Todos</option>
            {availableQuarters.map((quarter) => (
              <option key={quarter} value={quarter}>
                {quarter}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p className={styles.message}>Cargando periodos...</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
