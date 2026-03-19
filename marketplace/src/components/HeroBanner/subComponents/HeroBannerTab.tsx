"use client";

import React from "react";
import SearchSvg from "@/components/SVG/BannerSvg/SearchSvg";
import CategoriaSelect from "../UI/CategoriaSelect";
import DepartamentoSelect from "../UI/DepartamentoSelect";
import PropertyAutocomplete from "@/components/Admin/UI/PropertyAutocomplete";
import { ITabContentProps } from "@/types/banner-d-t";

// TabContent Component
export default function HeroBannerTabContent({
  id,
  isActive,
  onSortChange,
  onCategoriaSelect,
  onDepartamentoSelect,
  onSearch,
  onSearchClick,
  initialSearch,
  initialCategoriaIdPublic,
  initialDepartamentoIdPublic,
  tipoOperacionNode,
  extraEndNode,
}: ITabContentProps) {

  return (
    <div
      className={`tab-pane fade ${isActive ? "show active" : ""}`}
      id={id}
      role="tabpanel"
    >
      <form
        className="tp-hero-tab-box d-flex align-items-center"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchClick?.();
        }}
      >
        <div className={`tp-hero-tab-input${initialSearch?.trim() ? " tp-filter-active" : ""}`}>
          <PropertyAutocomplete
            placeholder="Buscar por nombre de propiedad"
            className="w-100"
            value={initialSearch ?? undefined}
            scope="public"
            onSelect={(name) => onSearch?.(name ?? "")}
            onSearchChange={(text) => onSearch?.(text)}
          />
        </div>
        {tipoOperacionNode && (
          <div className="tp-hero-tab-select tp-select">
            {tipoOperacionNode}
          </div>
        )}
        <CategoriaSelect
          placeholder="Categoría"
          initialValue={initialCategoriaIdPublic ?? undefined}
          active={!!(initialCategoriaIdPublic?.trim())}
          onSelect={(categoria) => {
            onCategoriaSelect?.(categoria);
          }}
        />
        <DepartamentoSelect
          placeholder="Departamento"
          initialValue={initialDepartamentoIdPublic ?? undefined}
          active={!!(initialDepartamentoIdPublic?.trim())}
          onSelect={(departamento) => {
            onDepartamentoSelect?.(departamento);
          }}
        />
        {extraEndNode != null && (
          <div className="tp-hero-tab-select tp-select">
            {extraEndNode}
          </div>
        )}
        <div className="tp-hero-tab-search">
          <button type="submit" onClick={onSearchClick}>
            Buscar{" "}
            <span>
              <SearchSvg />
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
