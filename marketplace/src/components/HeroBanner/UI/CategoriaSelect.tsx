"use client";

import { useState, useEffect, useMemo } from "react";
import NiceSelect from "@/components/UI/NiceSelect";

type CategoriaItem = { idPublic: string; nombre: string; slug?: string };

interface CategoriaSelectProps {
  onSelect: (categoria: CategoriaItem | null) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string | null;
  active?: boolean;
}

export default function CategoriaSelect({
  onSelect,
  placeholder = "Categoría",
  className = "",
  initialValue,
  active,
}: CategoriaSelectProps) {
  const [categorias, setCategorias] = useState<CategoriaItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/categorias-propiedad")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled || !Array.isArray(res)) return;
        setCategorias(res);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const options = useMemo(() => {
    const base = [{ value: "", label: "Todas las categorías" }];
    const rest = categorias.map((c) => ({ value: c.idPublic, label: c.nombre }));
    return [...base, ...rest];
  }, [categorias]);

  const initialIndex = useMemo(() => {
    if (!initialValue) return 0;
    const index = options.findIndex((opt) => opt.value === initialValue);
    return index >= 0 ? index : 0;
  }, [initialValue, options]);

  // Determinar la clase base según el contexto de uso
  const baseClass = className.includes("tp-team-contact-select")
    ? "tp-team-contact-select tp-select"
    : "tp-hero-tab-select tp-select tp-hero-tab-input";

  return (
    <div className={`${baseClass} ${className} ${active ? "tp-filter-active" : ""}`.trim()}>
      <NiceSelect
        key={`categoria-${initialIndex}-${initialValue || ""}`}
        options={options}
        defaultCurrent={initialIndex}
        onChange={(item) => {
          if (!item.value) {
            onSelect(null);
            return;
          }
          const c = categorias.find((x) => x.idPublic === item.value);
          if (c) onSelect(c);
        }}
        name={placeholder}
        cls={className.includes("tp-team-contact-select") ? "select wide" : undefined}
      />
    </div>
  );
}
