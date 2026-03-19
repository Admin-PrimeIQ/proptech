 "use client";

import { useApiProperties } from "@/hooks/useApiProperties";
import PropertyListCardItem from "../PropertyStyleOne/subComponents/PropertyListCardItem";
import PropertySingleCardTwo from "@/components/Common/PropertySingleCardTwo";
import { useFavoritos } from "@/hooks/useFavoritos";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PropertyTwoArea() {
    const searchParams = useSearchParams();
    const { esFavorito } = useFavoritos();

    // Filtros derivados de la URL (?categoriaIdPublic=...&departamentoIdPublic=...&search=...)
    const categoriaIdPublic = searchParams.get("categoriaIdPublic");
    const departamentoIdPublic = searchParams.get("departamentoIdPublic");
    const tipoOperacionIdPublic = searchParams.get("tipoOperacionIdPublic");
    const vendedorIdPublic = searchParams.get("vendedorIdPublic");
    const ciudadIdPublic = searchParams.get("ciudadIdPublic");
    const habitaciones = searchParams.get("habitaciones");
    const banos = searchParams.get("banos");
    const parqueos = searchParams.get("parqueos");
    const precioMin = searchParams.get("precioMin");
    const precioMax = searchParams.get("precioMax");
    const moneda = searchParams.get("moneda");
    const search = searchParams.get("search");

    const { properties, loading, error, refetch } = useApiProperties({
        categoriaIdPublic,
        departamentoIdPublic,
        tipoOperacionIdPublic,
        vendedorIdPublic,
        ciudadIdPublic,
        habitaciones,
        banos,
        parqueos,
        precioMin: precioMin ? parseInt(precioMin, 10) : null,
        precioMax: precioMax ? parseInt(precioMax, 10) : null,
        moneda,
        search,
    });

    // Obtener nombre de categoría para el mensaje
    const [categoriaNombre, setCategoriaNombre] = useState<string | null>(null);
    useEffect(() => {
        if (!categoriaIdPublic) {
            setCategoriaNombre(null);
            return;
        }
        let cancelled = false;
        fetch("/api/categorias-propiedad")
            .then((r) => r.json())
            .then((res) => {
                if (cancelled || !Array.isArray(res)) return;
                const cat = res.find((c: { idPublic: string }) => c.idPublic === categoriaIdPublic);
                if (cat) setCategoriaNombre(cat.nombre);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [categoriaIdPublic]);

    // Generar mensaje descriptivo cuando no hay propiedades
    const getEmptyMessage = () => {
        const filtrosAplicados: string[] = [];
        
        if (categoriaNombre) {
            filtrosAplicados.push(`tipo "${categoriaNombre}"`);
        }
        if (habitaciones) {
            const habNum = parseInt(habitaciones, 10);
            const habText = habNum === 11 ? "11 o más" : `${habNum} o más`;
            filtrosAplicados.push(`${habText} habitaciones`);
        }
        if (banos) {
            const banosNum = parseInt(banos, 10);
            const banosText = banosNum === 11 ? "11 o más" : `${banosNum} o más`;
            filtrosAplicados.push(`${banosText} baños`);
        }
        if (parqueos) {
            const parqNum = parseInt(parqueos, 10);
            const parqText = parqNum === 11 ? "11 o más" : `${parqNum} o más`;
            filtrosAplicados.push(`${parqText} estacionamientos`);
        }
        if (departamentoIdPublic || ciudadIdPublic || vendedorIdPublic || tipoOperacionIdPublic || search) {
            filtrosAplicados.push("otros filtros aplicados");
        }

        if (filtrosAplicados.length === 0) {
            return "No hay propiedades disponibles en este momento.";
        }

        return `No hay propiedades con estas características en este momento: ${filtrosAplicados.join(", ")}.`;
    };

    if (loading) {
        return (
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div className="row">
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">Cargando propiedades…</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div className="row">
                        <div className="col-12 text-center py-5">
                            <p className="text-danger mb-3">{error}</p>
                            <button type="button" className="tp-btn" onClick={refetch}>
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const gridItems = properties.slice(0, 8);
    const listItems = properties.slice(0, 5);

    return (
        <>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div className="row">
                        {gridItems.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <p className="text-muted">{getEmptyMessage()}</p>
                            </div>
                        ) : (
                            gridItems.map((item) => {
                                // Usar el hook para verificar si está en favoritos
                                const idPropiedadPublic = item.idPublic || "";
                                const isWishlisted = idPropiedadPublic ? esFavorito(idPropiedadPublic) : false;
                                return (
                                    <div className="col-xl-6 col-sm-12" key={item.idPublic ?? item.id}>
                                        <PropertySingleCardTwo item={item} isWishlisted={isWishlisted} />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    {listItems.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">{getEmptyMessage()}</p>
                        </div>
                    ) : (
                        listItems.map((item) => (
                            <div className="co-lg-12" key={item.idPublic ?? item.id}>
                                <PropertyListCardItem item={item} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}