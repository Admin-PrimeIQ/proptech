"use client"
import heroBg from "../../../public/assets/img/hero/hero-bg-1.jpg";
import HeroBannerTabContent from './subComponents/HeroBannerTab';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties } from "react";
import type { HomeConfigResponse } from "@/lib/home-config";
import DashboardHomeSvg from "@/components/SVG/DashboardSvg/HomeSvg";

type HeroBannerOneProps = {
  heroConfig?: HomeConfigResponse | null;
};

const DEFAULT_TITULO = "Descubre Tu Lugar";
const DEFAULT_SUBTITULO = "Comienza en Pocos Clics";

export default function HeroBannerOne({ heroConfig }: HeroBannerOneProps) {
    const router = useRouter();
    const handleSorting = () => { };

    // Estado de filtros (siempre "por todo": sin venta/alquiler)
    const [filtros, setFiltros] = useState<{
        categoriaIdPublic?: string | null;
        departamentoIdPublic?: string | null;
        search?: string | null;
    }>({});

    // Manejar selección de categoría
    const handleCategoriaSelect = useCallback((categoria: { idPublic: string; nombre: string; slug?: string } | null) => {
        setFiltros((prev) => ({
            ...prev,
            categoriaIdPublic: categoria?.idPublic || null,
        }));
    }, []);

    // Manejar selección de departamento
    const handleDepartamentoSelect = useCallback((departamento: { idPublic: string; nombre: string } | null) => {
        setFiltros((prev) => ({
            ...prev,
            departamentoIdPublic: departamento?.idPublic || null,
        }));
    }, []);

    // Búsqueda por nombre de propiedad (autocompletado o texto libre)
    const handleSearch = useCallback((search: string) => {
        setFiltros((prev) => ({
            ...prev,
            search: search.trim() || null,
        }));
    }, []);


    // Manejar clic en buscar (siempre "por todo", sin filtro venta/alquiler)
    const handleSearchClick = useCallback(() => {
        const params = new URLSearchParams();
        if (filtros.categoriaIdPublic) {
            params.set("categoriaIdPublic", filtros.categoriaIdPublic);
        }
        if (filtros.departamentoIdPublic) {
            params.set("departamentoIdPublic", filtros.departamentoIdPublic);
        }
        if (filtros.search) {
            params.set("search", filtros.search);
        }
        const queryString = params.toString();
        router.push(`/propiedades${queryString ? `?${queryString}` : ""}`);
    }, [filtros, router]);

    const titulo = heroConfig?.tituloHero?.trim() || DEFAULT_TITULO;
    const subtitulo = heroConfig?.subtituloHero?.trim() || DEFAULT_SUBTITULO;
    const bgImage = heroConfig?.imagenHero?.url || heroBg.src;
    const textoBoton = heroConfig?.textoBotonHero?.trim() || null;
    const linkBoton = heroConfig?.linkBotonHero?.trim() || "/propiedades";
    const heroStyle = {
        backgroundImage: `url(${bgImage})`,
        ["--hero-bg-image" as string]: `url(${bgImage})`,
    } as CSSProperties;

    return (
        <>
            {/* -- hero area start -- */}
            <section className="tp-hero-ptb tp-hero-hight tp-hero-home-one p-relative" style={heroStyle}>
                <div className="tp-hero-overlay" aria-hidden="true" />
                <div className="tp-hero-glass-panel">
                    <div className="container tp-hero-inner">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="tp-hero-content">
                                    <div className="tp-hero-heading text-center">
                                        <h3 className="tp-hero-heading-title wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">{titulo}</h3>
                                        <p className="wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">{subtitulo}</p>
                                        <Link
                                            href="/propiedades"
                                            className="tp-hero-house-icon d-inline-flex align-items-center justify-content-center wow fadeInUp"
                                            data-wow-duration="1s"
                                            data-wow-delay=".55s"
                                            aria-label="Ver propiedades"
                                            style={{
                                                marginTop: "1.25rem",
                                                color: "var(--tp-common-white)",
                                                transition: "opacity 0.25s ease, transform 0.25s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.opacity = "0.9";
                                                e.currentTarget.style.transform = "scale(1.08)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.opacity = "1";
                                                e.currentTarget.style.transform = "scale(1)";
                                            }}
                                        >
                                            <DashboardHomeSvg width={48} height={48} color="currentColor" />
                                        </Link>
                                        {textoBoton && (
                                            <div className="wow fadeInUp" data-wow-duration="1s" data-wow-delay=".6s" style={{ marginTop: "1rem" }}>
                                                {linkBoton.startsWith("/") ? (
                                                    <Link href={linkBoton} className="add">
                                                        {textoBoton}
                                                    </Link>
                                                ) : (
                                                    <a href={linkBoton} className="add" target="_blank" rel="noopener noreferrer">
                                                        {textoBoton}
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Filtro sobre la imagen, abajo; no afecta altura ni componentes siguientes */}
                    <div className="tp-hero-filter-on-image">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="tp-hero-tab p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".7s">
                                        <div className="row">
                                            <div className="tab-content" id="nav-tabContent">
                                                <HeroBannerTabContent
                                                    id="nav-home"
                                                    isActive={true}
                                                    onSortChange={handleSorting}
                                                    onCategoriaSelect={handleCategoriaSelect}
                                                    onDepartamentoSelect={handleDepartamentoSelect}
                                                    onSearch={handleSearch}
                                                    onSearchClick={handleSearchClick}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* -- hero area end -- */}
        </>
    );
};
