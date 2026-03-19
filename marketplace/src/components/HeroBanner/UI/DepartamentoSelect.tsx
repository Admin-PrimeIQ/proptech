"use client";

import { useState, useEffect, useMemo } from "react";
import NiceSelect from "@/components/UI/NiceSelect";

type DepartamentoItem = { idPublic: string; nombre: string };

interface DepartamentoSelectProps {
  onSelect: (departamento: DepartamentoItem | null) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string | null;
  active?: boolean;
}

export default function DepartamentoSelect({
  onSelect,
  placeholder = "Departamento",
  className = "",
  initialValue,
  active,
}: DepartamentoSelectProps) {
  const [departamentos, setDepartamentos] = useState<DepartamentoItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/departamentos")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled || !Array.isArray(res)) return;
        setDepartamentos(res);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const options = useMemo(() => {
    const base = [{ value: "", label: "Todos los departamentos" }];
    const rest = departamentos.map((d) => ({ value: d.idPublic, label: d.nombre }));
    return [...base, ...rest];
  }, [departamentos]);

  const initialIndex = useMemo(() => {
    if (!initialValue) return 0;
    const index = options.findIndex((opt) => opt.value === initialValue);
    return index >= 0 ? index : 0;
  }, [initialValue, options]);

  return (
    <div
      className={`tp-hero-tab-select tp-select tp-hero-tab-input ${className} ${active ? "tp-filter-active" : ""}`.trim()}
    >
      <NiceSelect
        key={`departamento-${initialIndex}-${initialValue || ""}`}
        options={options}
        defaultCurrent={initialIndex}
        onChange={(item) => {
          if (!item.value) {
            onSelect(null);
            return;
          }
          const d = departamentos.find((x) => x.idPublic === item.value);
          if (d) onSelect(d);
        }}
        name={placeholder}
      />
    </div>
  );
}
