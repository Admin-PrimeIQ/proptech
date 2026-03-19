"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import useGlobalContext from "@/hooks/useContext";
import PropertyAutocomplete from "@/components/Admin/UI/PropertyAutocomplete";
import CategoriaSelect from "@/components/HeroBanner/UI/CategoriaSelect";
import DepartamentoSelect from "@/components/HeroBanner/UI/DepartamentoSelect";
import SearchSvg from "@/components/SVG/BannerSvg/SearchSvg";

export default function OffcanvasFilter() {
    const router = useRouter();
    const { toggleOffcanvas } = useGlobalContext();
    const [search, setSearch] = useState("");
    const [categoriaIdPublic, setCategoriaIdPublic] = useState<string | null>(null);
    const [departamentoIdPublic, setDepartamentoIdPublic] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);

    const handleSearchClick = useCallback(() => {
        const params = new URLSearchParams();
        if (categoriaIdPublic) params.set("categoriaIdPublic", categoriaIdPublic);
        if (departamentoIdPublic) params.set("departamentoIdPublic", departamentoIdPublic);
        if (search?.trim()) params.set("search", search.trim());
        const queryString = params.toString();
        router.push(`/propiedades${queryString ? `?${queryString}` : ""}`, { scroll: false });
        toggleOffcanvas();
    }, [search, categoriaIdPublic, departamentoIdPublic, router, toggleOffcanvas]);

    return (
        <div className="offcanvas__filter mb-30">
            <button
                type="button"
                className="offcanvas__filter-title-btn"
                onClick={() => setFilterOpen((prev) => !prev)}
                aria-expanded={filterOpen}
                aria-controls="offcanvas-filter-fields"
            >
                <span className="offcanvas__title offcanvas__filter-title">Buscar propiedad</span>
                <span className="offcanvas__filter-chevron" aria-hidden>{filterOpen ? "▼" : "▶"}</span>
            </button>
            <div
                id="offcanvas-filter-fields"
                className={`offcanvas__filter-fields ${filterOpen ? "offcanvas__filter-fields--open" : ""}`}
                hidden={!filterOpen}
            >
                <div className="offcanvas__filter-field">
                    <PropertyAutocomplete
                        placeholder="Nombre de propiedad"
                        className="w-100"
                        value={search}
                        scope="public"
                        onSelect={(name) => setSearch(name ?? "")}
                        onSearchChange={(text) => setSearch(text)}
                    />
                </div>
                <div className="offcanvas__filter-field">
                    <CategoriaSelect
                        placeholder="Categoría"
                        initialValue={categoriaIdPublic ?? undefined}
                        active={!!categoriaIdPublic}
                        onSelect={(c) => setCategoriaIdPublic(c?.idPublic ?? null)}
                        className="offcanvas__filter-select"
                    />
                </div>
                <div className="offcanvas__filter-field">
                    <DepartamentoSelect
                        placeholder="Departamento"
                        initialValue={departamentoIdPublic ?? undefined}
                        active={!!departamentoIdPublic}
                        onSelect={(d) => setDepartamentoIdPublic(d?.idPublic ?? null)}
                        className="offcanvas__filter-select"
                    />
                </div>
                <div className="offcanvas__filter-field offcanvas__filter-btn-wrap">
                    <button type="button" onClick={handleSearchClick} className="offcanvas__filter-btn">
                        Buscar <span><SearchSvg /></span>
                    </button>
                </div>
            </div>
        </div>
    );
}
