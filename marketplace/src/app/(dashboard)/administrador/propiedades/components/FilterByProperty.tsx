"use client";

import { useState, useEffect, useMemo } from "react";
import NiceSelect from "@/components/UI/NiceSelect";
import PropertyAutocomplete from "@/components/Admin/UI/PropertyAutocomplete";

type CategoriaItem = { idPublic: string; nombre: string; slug: string };

interface FilterByPropertyProps {
  categoriaIdPublic?: string;
  onCategoriaChange?: (value: string) => void;
  onPropertySelect?: (propertyName: string | null) => void;
}

export default function FilterByProperty({
  categoriaIdPublic = "",
  onCategoriaChange,
  onPropertySelect,
}: FilterByPropertyProps) {
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

  const categoriaOptions = useMemo(() => {
    const base = [{ value: "", label: "Todas las categorías" }];
    const rest = categorias.map((c) => ({ value: c.idPublic, label: c.nombre }));
    return [...base, ...rest];
  }, [categorias]);

  return (
    <div className="tp-dashboard-property-top d-flex mb-50">
      <div className="tp-property-tabs-select tp-select">
        <NiceSelect
          key="categoria"
          options={categoriaOptions}
          defaultCurrent={0}
          onChange={(item) => onCategoriaChange?.(item.value)}
          name="Categoría"
        />
      </div>
      <div className="tp-dashboard-property-search w-100">
        <PropertyAutocomplete
          onSelect={onPropertySelect || (() => {})}
          placeholder="Buscar por nombre de propiedad"
          scope="admin"
        />
      </div>
    </div>
  );
}
