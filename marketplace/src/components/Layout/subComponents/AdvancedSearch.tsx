"use client";

import { useMemo } from "react";
import NiceSelect from "@/components/UI/NiceSelect";
import VendedorAutocomplete from "@/components/HeroBanner/UI/VendedorAutocomplete";
import CiudadAutocomplete from "@/components/HeroBanner/UI/CiudadAutocomplete";

type Option = { value: string; label: string };

interface AdvancedSearchProps {
  operacionesOptions?: Option[];
  initialTipoOperacionIdPublic?: string | null;
  initialVendedorIdPublic?: string | null;
  initialCiudadIdPublic?: string | null;
  onOperacionChange?: (item: Option) => void;
  onVendedorSelect?: (vendedor: { idPublic: string; nombre: string } | null) => void;
  onCiudadSelect?: (ciudad: { idPublic: string; nombre: string } | null) => void;
}

export default function AdvancedSearch({
  operacionesOptions,
  initialTipoOperacionIdPublic,
  initialVendedorIdPublic,
  initialCiudadIdPublic,
  onOperacionChange,
  onVendedorSelect,
  onCiudadSelect,
}: AdvancedSearchProps) {
  const operacionInitialIndex = useMemo(() => {
    if (!operacionesOptions?.length || !initialTipoOperacionIdPublic) return 0;
    const i = operacionesOptions.findIndex((o) => o.value === initialTipoOperacionIdPublic);
    return i >= 0 ? i : 0;
  }, [operacionesOptions, initialTipoOperacionIdPublic]);

  return (
    <div className="tp-property-widget mb-40">
      <div className="tp-property-contact">
        <h4 className="tp-team-details-item-title">Búsqueda avanzada</h4>
        <div style={{ width: "100%" }}>
          <VendedorAutocomplete
            placeholder="Ingresa el nombre del vendedor"
            onSelect={onVendedorSelect || (() => {})}
            className="w-100"
            active={!!(initialVendedorIdPublic?.trim())}
          />
        </div>
        <CiudadAutocomplete
          placeholder="Ciudad"
          onSelect={onCiudadSelect || (() => {})}
          active={!!(initialCiudadIdPublic?.trim())}
        />
        {operacionesOptions && operacionesOptions.length > 0 && (
          <>
            <div style={{ marginTop: "16px", marginBottom: "8px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--tp-text-body)",
                }}
              >
                Operación inmobiliaria
              </label>
            </div>
            <div className={`tp-team-contact-select tp-select${initialTipoOperacionIdPublic?.trim() ? " tp-filter-active" : ""}`}>
              <NiceSelect
                key={`operacion-${operacionInitialIndex}-${initialTipoOperacionIdPublic || ""}`}
                options={operacionesOptions}
                defaultCurrent={operacionInitialIndex}
                onChange={(item) => onOperacionChange?.(item)}
                name="tipoOperacion"
                cls="select wide"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}