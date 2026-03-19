"use client";

import { useMemo, useEffect, useRef } from "react";
import NiceSelect from "@/components/UI/NiceSelect";
import CategoriaSelect from "@/components/HeroBanner/UI/CategoriaSelect";
import RangeFilter from "./RangeFilter";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

// Generar opciones numéricas (1-10+)
const generateNumericOptions = (label: string, max: number = 10) => {
  const options = [{ value: "", label }];
  for (let i = 1; i <= max; i++) {
    options.push({ value: String(i), label: String(i) });
  }
  options.push({ value: String(max + 1), label: `${max}+` });
  return options;
};

export default function PropertyFilterWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPropiedadesPage = pathname === "/propiedades";

  const [filtros, setFiltros] = useState<{
    categoriaIdPublic?: string | null;
    habitaciones?: string | null;
    banos?: string | null;
    parqueos?: string | null;
    precioMin?: number | null;
    precioMax?: number | null;
    moneda?: string | null;
  }>(() => ({
    categoriaIdPublic: searchParams.get("categoriaIdPublic") || null,
    habitaciones: searchParams.get("habitaciones") || null,
    banos: searchParams.get("banos") || null,
    parqueos: searchParams.get("parqueos") || null,
    precioMin: searchParams.get("precioMin") ? parseInt(searchParams.get("precioMin")!, 10) : null,
    precioMax: searchParams.get("precioMax") ? parseInt(searchParams.get("precioMax")!, 10) : null,
    moneda: searchParams.get("moneda") || null,
  }));

  const searchParamsStr = searchParams.toString();
  useEffect(() => {
    setFiltros({
      categoriaIdPublic: searchParams.get("categoriaIdPublic") || null,
      habitaciones: searchParams.get("habitaciones") || null,
      banos: searchParams.get("banos") || null,
      parqueos: searchParams.get("parqueos") || null,
      precioMin: searchParams.get("precioMin") ? parseInt(searchParams.get("precioMin")!, 10) : null,
      precioMax: searchParams.get("precioMax") ? parseInt(searchParams.get("precioMax")!, 10) : null,
      moneda: searchParams.get("moneda") || null,
    });
  }, [searchParamsStr, searchParams]);

  const habitacionesOptions = useMemo(
    () => generateNumericOptions("Habitaciones"),
    []
  );
  const banosOptions = useMemo(() => generateNumericOptions("Baños"), []);
  const parqueosOptions = useMemo(
    () => generateNumericOptions("Estacionamientos"),
    []
  );

  // Encontrar el índice inicial para cada select basado en la URL
  const getInitialIndex = useCallback(
    (options: { value: string; label: string }[], value: string | null) => {
      if (!value) return 0;
      const index = options.findIndex((opt) => opt.value === value);
      return index >= 0 ? index : 0;
    },
    []
  );

  const habitacionesInitialIndex = useMemo(
    () => getInitialIndex(habitacionesOptions, filtros.habitaciones),
    [habitacionesOptions, filtros.habitaciones, getInitialIndex]
  );
  const banosInitialIndex = useMemo(
    () => getInitialIndex(banosOptions, filtros.banos),
    [banosOptions, filtros.banos, getInitialIndex]
  );
  const parqueosInitialIndex = useMemo(
    () => getInitialIndex(parqueosOptions, filtros.parqueos),
    [parqueosOptions, filtros.parqueos, getInitialIndex]
  );

  const handleCategoriaSelect = useCallback(
    (categoria: { idPublic: string; nombre: string; slug?: string } | null) => {
      setFiltros((prev) => ({
        ...prev,
        categoriaIdPublic: categoria?.idPublic || null,
      }));
    },
    []
  );

  const handleHabitacionesChange = useCallback(
    (item: { value: string; label: string }) => {
      setFiltros((prev) => ({
        ...prev,
        habitaciones: item.value || null,
      }));
    },
    []
  );

  const handleBanosChange = useCallback(
    (item: { value: string; label: string }) => {
      setFiltros((prev) => ({
        ...prev,
        banos: item.value || null,
      }));
    },
    []
  );

  const handleParqueosChange = useCallback(
    (item: { value: string; label: string }) => {
      setFiltros((prev) => ({
        ...prev,
        parqueos: item.value || null,
      }));
    },
    []
  );

  const handlePriceChange = useCallback(
    (min: number | null, max: number | null, moneda: string | null) => {
      setFiltros((prev) => ({
        ...prev,
        precioMin: min,
        precioMax: max,
        moneda: moneda || null,
      }));
    },
    []
  );

  const updateUrl = useCallback(() => {
    // Obtener todos los parámetros actuales de la URL para preservarlos
    const currentParams = new URLSearchParams(searchParams.toString());
    
    // Actualizar solo los filtros de este widget
    if (filtros.categoriaIdPublic) {
      currentParams.set("categoriaIdPublic", filtros.categoriaIdPublic);
    } else {
      currentParams.delete("categoriaIdPublic");
    }
    
    if (filtros.habitaciones) {
      currentParams.set("habitaciones", filtros.habitaciones);
    } else {
      currentParams.delete("habitaciones");
    }
    
    if (filtros.banos) {
      currentParams.set("banos", filtros.banos);
    } else {
      currentParams.delete("banos");
    }
    
    if (filtros.parqueos) {
      currentParams.set("parqueos", filtros.parqueos);
    } else {
      currentParams.delete("parqueos");
    }
    
    if (filtros.precioMin != null && filtros.precioMax != null) {
      currentParams.set("precioMin", String(filtros.precioMin));
      currentParams.set("precioMax", String(filtros.precioMax));
    } else {
      currentParams.delete("precioMin");
      currentParams.delete("precioMax");
    }
    
    if (filtros.moneda) {
      currentParams.set("moneda", filtros.moneda);
    } else {
      currentParams.delete("moneda");
    }
    
    const queryString = currentParams.toString();
    router.push(`/propiedades${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [filtros, router, searchParams]);

  // Sincronizar automáticamente los filtros con la URL. Solo en /propiedades para no redirigir
  // a /propiedades cuando el widget se muestra en la página de detalles de propiedad.
  const isFirstRef = useRef(true);
  useEffect(() => {
    if (!isPropiedadesPage) return;
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }
    updateUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPropiedadesPage, filtros.categoriaIdPublic, filtros.habitaciones, filtros.banos, filtros.parqueos, filtros.precioMin, filtros.precioMax, filtros.moneda]);

  return (
    <div className="tp-property-widget mb-40">
      <div className="tp-property-filter-wrap">
        <h4 className="tp-team-details-item-title">Encuentra tu propiedad</h4>
        <CategoriaSelect
          placeholder="Tipo de propiedad"
          onSelect={handleCategoriaSelect}
          className="tp-team-contact-select"
          initialValue={filtros.categoriaIdPublic}
          active={!!(filtros.categoriaIdPublic?.trim())}
        />
        <div className={`tp-team-contact-select tp-select${filtros.habitaciones?.trim() ? " tp-filter-active" : ""}`}>
          <NiceSelect
            key={`habitaciones-${habitacionesInitialIndex}`}
            options={habitacionesOptions}
            defaultCurrent={habitacionesInitialIndex}
            onChange={handleHabitacionesChange}
            name="habitaciones"
            cls="select wide"
          />
        </div>
        <div className={`tp-team-contact-select tp-select${filtros.banos?.trim() ? " tp-filter-active" : ""}`}>
          <NiceSelect
            key={`banos-${banosInitialIndex}`}
            options={banosOptions}
            defaultCurrent={banosInitialIndex}
            onChange={handleBanosChange}
            name="banos"
            cls="select wide"
          />
        </div>
        <div className={`tp-team-contact-select tp-select${filtros.parqueos?.trim() ? " tp-filter-active" : ""}`}>
          <NiceSelect
            key={`parqueos-${parqueosInitialIndex}`}
            options={parqueosOptions}
            defaultCurrent={parqueosInitialIndex}
            onChange={handleParqueosChange}
            name="parqueos"
            cls="select wide"
          />
        </div>
        {/* slider range */}
        <RangeFilter onPriceChange={handlePriceChange} />
      </div>
    </div>
  );
}
