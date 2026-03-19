"use client";

import propertyBg from "../../../public/assets/img/rent/property-bg.jpg";
import PropertyFilterWidget from "./subComponents/PropertyFilterWidget";
import SidebarPropertyItem from "./subComponents/SidebarPropertyItem";
import AdvancedSearch from "./subComponents/AdvancedSearch";
import ColumnFilterSvg from "../SVG/ColumnFilterSvg";
import GridFilterSvg from "../SVG/GridFilterSvg";
import SearchSvg from "@/components/SVG/BannerSvg/SearchSvg";
import HeroBannerTabContent from "@/components/HeroBanner/subComponents/HeroBannerTab";
import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function filtrosFromSearchParams(sp: URLSearchParams) {
  return {
    categoriaIdPublic: sp.get("categoriaIdPublic")?.trim() || null,
    departamentoIdPublic: sp.get("departamentoIdPublic")?.trim() || null,
    tipoOperacionIdPublic: sp.get("tipoOperacionIdPublic")?.trim() || null,
    vendedorIdPublic: sp.get("vendedorIdPublic")?.trim() || null,
    ciudadIdPublic: sp.get("ciudadIdPublic")?.trim() || null,
    search: sp.get("search")?.trim() || null,
  };
}

export default function PropertyLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPropiedadesPage = pathname === "/propiedades";

  const [filtros, setFiltros] = useState<{
    categoriaIdPublic?: string | null;
    departamentoIdPublic?: string | null;
    tipoOperacionIdPublic?: string | null;
    vendedorIdPublic?: string | null;
    ciudadIdPublic?: string | null;
    search?: string | null;
  }>(() => filtrosFromSearchParams(searchParams));

  const [operacionesOptions, setOperacionesOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "Todos" }]);

  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [isClosingAdvanced, setIsClosingAdvanced] = useState(false);
  const [isOpeningAdvanced, setIsOpeningAdvanced] = useState(false);
  const closeAdvancedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCategoriaSelect = useCallback(
    (categoria: { idPublic: string; nombre: string; slug?: string } | null) => {
      setFiltros((prev) => ({
        ...prev,
        categoriaIdPublic: categoria?.idPublic || null,
      }));
    },
    []
  );

  const handleDepartamentoSelect = useCallback(
    (departamento: { idPublic: string; nombre: string } | null) => {
      setFiltros((prev) => ({
        ...prev,
        departamentoIdPublic: departamento?.idPublic || null,
      }));
    },
    []
  );

  const handleSearch = useCallback((search: string) => {
    setFiltros((prev) => ({
      ...prev,
      search: search.trim() || null,
    }));
  }, []);

  const handleOperacionChange = useCallback(
    (item: { value: string; label: string }) => {
      const nuevoTipoOperacion = item.value || null;
      setFiltros((prev) => ({
        ...prev,
        tipoOperacionIdPublic: nuevoTipoOperacion,
      }));
    },
    []
  );

  const handleVendedorSelect = useCallback(
    (vendedor: { idPublic: string; nombre: string } | null) => {
      setFiltros((prev) => ({
        ...prev,
        vendedorIdPublic: vendedor?.idPublic || null,
      }));
    },
    []
  );

  const handleCiudadSelect = useCallback(
    (ciudad: { idPublic: string; nombre: string } | null) => {
      setFiltros((prev) => ({
        ...prev,
        ciudadIdPublic: ciudad?.idPublic || null,
      }));
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tipo-operacion-inmobiliaria")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const list = Array.isArray(d) ? d : d?.data ?? d;
        const opts: { value: string; label: string }[] = [
          { value: "", label: "Todos" },
        ];
        if (Array.isArray(list)) {
          list.forEach((op: { idPublic: string; nombre: string }) => {
            const n = op.nombre.toLowerCase();
            let label = op.nombre;
            if (n.includes("venta") || n.includes("compra")) label = "Compra";
            else if (n.includes("renta") || n.includes("alquiler"))
              label = "Renta";
            opts.push({ value: op.idPublic, label });
          });
        }
        setOperacionesOptions(opts);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (filtros.categoriaIdPublic) {
      params.set("categoriaIdPublic", filtros.categoriaIdPublic);
    } else {
      params.delete("categoriaIdPublic");
    }
    if (filtros.departamentoIdPublic) {
      params.set("departamentoIdPublic", filtros.departamentoIdPublic);
    } else {
      params.delete("departamentoIdPublic");
    }
    if (filtros.tipoOperacionIdPublic) {
      params.set("tipoOperacionIdPublic", filtros.tipoOperacionIdPublic);
    } else {
      params.delete("tipoOperacionIdPublic");
    }
    if (filtros.vendedorIdPublic) {
      params.set("vendedorIdPublic", filtros.vendedorIdPublic);
    } else {
      params.delete("vendedorIdPublic");
    }
    if (filtros.ciudadIdPublic) {
      params.set("ciudadIdPublic", filtros.ciudadIdPublic);
    } else {
      params.delete("ciudadIdPublic");
    }
    if (filtros.search) {
      params.set("search", filtros.search);
    } else {
      params.delete("search");
    }
    const queryString = params.toString();
    router.push(`/propiedades${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [filtros, router]);

  const closeAdvancedFilter = useCallback(() => {
    if (closeAdvancedTimeoutRef.current) clearTimeout(closeAdvancedTimeoutRef.current);
    setIsClosingAdvanced(true);
    closeAdvancedTimeoutRef.current = setTimeout(() => {
      setShowAdvancedFilter(false);
      setIsClosingAdvanced(false);
      closeAdvancedTimeoutRef.current = null;
    }, 260);
  }, []);

  useEffect(() => {
    return () => {
      if (closeAdvancedTimeoutRef.current) clearTimeout(closeAdvancedTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (showAdvancedFilter && !isClosingAdvanced) {
      setIsOpeningAdvanced(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsOpeningAdvanced(false));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [showAdvancedFilter]);

  const handleSearchClick = useCallback(() => {
    updateUrl();
    closeAdvancedFilter();
  }, [updateUrl, closeAdvancedFilter]);

  // Sincronizar filtros desde la URL (home → propiedades, back/forward). Solo en /propiedades.
  const searchParamsStr = searchParams.toString();
  useEffect(() => {
    if (!isPropiedadesPage) return;
    setFiltros(filtrosFromSearchParams(searchParams));
  }, [isPropiedadesPage, searchParamsStr, searchParams]);

  // Al cargar/recargar la página, reiniciar el filtro de precio: quitar precioMin, precioMax y moneda de la URL
  // para que el filtro quede en "Todas las monedas" y rango completo (todas las propiedades). Solo en /propiedades.
  const hasResetPriceOnMount = useRef(false);
  useEffect(() => {
    if (!isPropiedadesPage) return;
    if (hasResetPriceOnMount.current) return;
    hasResetPriceOnMount.current = true;
    const hasPriceParams =
      searchParams.has("precioMin") || searchParams.has("precioMax") || searchParams.has("moneda");
    if (!hasPriceParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("precioMin");
    params.delete("precioMax");
    params.delete("moneda");
    const queryString = params.toString();
    router.replace(`/propiedades${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [isPropiedadesPage, router, searchParams]);

  // Sincronizar automáticamente los filtros de búsqueda avanzada con la URL. Solo en /propiedades
  // para no redirigir a /propiedades al navegar a detalles de propiedad.
  const isFirstRef = useRef(true);
  useEffect(() => {
    if (!isPropiedadesPage) return;
    if (isFirstRef.current) {
      isFirstRef.current = false;
      return;
    }
    updateUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPropiedadesPage, filtros.tipoOperacionIdPublic, filtros.vendedorIdPublic, filtros.ciudadIdPublic]);

  return (
    <>
      <section
        className="tp-property-ptb pt-140 pb-120"
        style={{ backgroundImage: `url(${propertyBg.src})` }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="tp-property-heading mb-60">
                <h4 className="tp-property-section-title">Propiedades</h4>
                <div className="tp-property-list">
                  <span>
                    <Link href="/">Inicio</Link>
                  </span>{" "}
                  <span className="dvdr"></span>{" "}
                  <span className="active">Propiedades</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="tp-property-tabs-box d-flex flex-wrap mb-40 justify-content-end">
                <div className="tp-property-tabs">
                  <ul className="nav nav-tabs" id="filterTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="home-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#home"
                        type="button"
                        role="tab"
                        aria-controls="home"
                        aria-selected="true"
                      >
                        <GridFilterSvg />
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#profile"
                        type="button"
                        role="tab"
                        aria-controls="profile"
                        aria-selected="false"
                      >
                        <ColumnFilterSvg />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Filtro: nombre, categoría, departamento, búsqueda avanzada (móvil), Buscar */}
          <div className="row mb-40">
            <div className="col-lg-12">
              <div className="tp-hero-tab tp-hero-tab--properties">
                <div className="row">
                  <div className="tab-content" id="propiedades-filter">
                    <HeroBannerTabContent
                      id="propiedades-filter-tab"
                      isActive={true}
                      onSortChange={() => {}}
                      onCategoriaSelect={handleCategoriaSelect}
                      onDepartamentoSelect={handleDepartamentoSelect}
                      onSearch={handleSearch}
                      onSearchClick={handleSearchClick}
                      initialSearch={filtros.search ?? undefined}
                      initialCategoriaIdPublic={filtros.categoriaIdPublic ?? undefined}
                      initialDepartamentoIdPublic={filtros.departamentoIdPublic ?? undefined}
                      extraEndNode={
                        <button
                          type="button"
                          className="add d-lg-none"
                          onClick={() => {
                          if (showAdvancedFilter) closeAdvancedFilter();
                          else setShowAdvancedFilter(true);
                        }}
                          aria-expanded={showAdvancedFilter}
                          aria-controls="mobile-advanced-filter"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {showAdvancedFilter ? "Ocultar avanzada" : "Búsqueda avanzada"}
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>
              {/* Solo móvil: panel desplegable de búsqueda avanzada (debajo de la barra) */}
              {(showAdvancedFilter || isClosingAdvanced) && (
                <div
                  id="mobile-advanced-filter"
                  className="tp-property-mobile-advanced mt-3 p-3 rounded d-lg-none"
                  style={{
                    background: "var(--tp-common-white)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    transition: "opacity 0.25s ease, max-height 0.26s ease, margin-top 0.26s ease, padding 0.26s ease",
                    opacity: isClosingAdvanced || isOpeningAdvanced ? 0 : 1,
                    maxHeight: isClosingAdvanced || isOpeningAdvanced ? 0 : 1200,
                    overflow: "hidden",
                    marginTop: isClosingAdvanced || isOpeningAdvanced ? 0 : undefined,
                    padding: isClosingAdvanced || isOpeningAdvanced ? 0 : undefined,
                  }}
                >
                  <AdvancedSearch
                    operacionesOptions={operacionesOptions}
                    initialTipoOperacionIdPublic={filtros.tipoOperacionIdPublic ?? undefined}
                    initialVendedorIdPublic={filtros.vendedorIdPublic ?? undefined}
                    initialCiudadIdPublic={filtros.ciudadIdPublic ?? undefined}
                    onOperacionChange={handleOperacionChange}
                    onVendedorSelect={handleVendedorSelect}
                    onCiudadSelect={handleCiudadSelect}
                  />
                  <PropertyFilterWidget />
                  <div className="tp-hero-tab-search mt-3">
                    <button
                      type="button"
                      className="add w-100"
                      onClick={handleSearchClick}
                    >
                      Buscar{" "}
                      <span>
                        <SearchSvg />
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              {/* Main content section */}
              {children}
            </div>
            <div className="col-lg-4">
              {/* Sidebar de filtros: solo en desktop; en móvil se muestra en el panel desplegable */}
              <div className="d-none d-lg-block">
                <AdvancedSearch
                  operacionesOptions={operacionesOptions}
                  initialTipoOperacionIdPublic={filtros.tipoOperacionIdPublic ?? undefined}
                  initialVendedorIdPublic={filtros.vendedorIdPublic ?? undefined}
                  initialCiudadIdPublic={filtros.ciudadIdPublic ?? undefined}
                  onOperacionChange={handleOperacionChange}
                  onVendedorSelect={handleVendedorSelect}
                  onCiudadSelect={handleCiudadSelect}
                />
                <PropertyFilterWidget />
              </div>
              <SidebarPropertyItem customClass="tp-team-details-item" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
