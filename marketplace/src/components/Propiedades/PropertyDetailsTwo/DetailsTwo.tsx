"use client";

import { useState, useEffect } from "react";
import DetailsReusableArea from "../PropertyDetailsOne/subComponents/DetailsReusableArea";
import PropertySliderTwo from "./subComponents/PropertySliderTwo";
import { propertyData } from "@/data/propertyData";
import { IdProps } from "@/types/custom-interface";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { mapApiPropiedadToCardItem, type ApiPropiedadItem } from "@/lib/mapApiPropiedadToCard";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ApiPropiedadFull = {
    idPublic?: string;
    descripcionGeneral?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    habitaciones?: number | null;
    banos?: number | null;
    parqueos?: number | null;
    metrosConstruccion?: number | null;
    metrosTerreno?: number | null;
    anoConstruccion?: number | null;
    fechaCreacion?: string;
    fechaActualizacion?: string;
    categoria?: { nombre: string } | null;
    tipoOperacion?: { nombre: string } | null;
    zona?: { nombre: string } | null;
    ciudad?: string | null;
    departamento?: string | null;
    pais?: string | null;
    imagenes?: Array<{ url: string; esPortada?: boolean }>;
    amenidades?: Array<{ idPublic: string; nombreAmenidad: string }>;
    planesPiso?: Array<{ idPublic: string; nombreDelPlano: string; url: string; orden: number }>;
    reseñasClientes?: Array<{ nombreCompleto: string; mensaje: string; fechaCreacion: string }>;
    vendedor?: {
        nombre: string;
        fotoUrl?: string | null;
        correo?: string | null;
        telefono?: string | null;
        propiedadesCount?: number;
    } | null;
};

export default function PropertyDetailsTwoArea({ id }: IdProps) {
    const isUuid = typeof id === "string" && UUID_REGEX.test(id);
    const [apiProperty, setApiProperty] = useState<IFeaturedPropertyDT | null>(null);
    const [apiPropertyRaw, setApiPropertyRaw] = useState<ApiPropiedadFull | null>(null);
    const [apiImagenes, setApiImagenes] = useState<Array<{ url: string }> | null>(null);
    const [loading, setLoading] = useState(isUuid);
    const [error, setError] = useState<string | null>(null);
    const staticProperty = !isUuid ? propertyData.find((p) => String(p.id) === String(id)) : undefined;

    useEffect(() => {
        if (!isUuid) return;
        setLoading(true);
        setError(null);
        fetch(`/api/propiedades/${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json?.error) {
                    setError(json.error);
                    setApiProperty(null);
                    setApiPropertyRaw(null);
                    setApiImagenes(null);
                    return;
                }
                const api = json as ApiPropiedadItem & { imagenes?: Array<{ url: string }> };
                setApiProperty(mapApiPropiedadToCardItem(api));
                setApiPropertyRaw(json as ApiPropiedadFull);
                setApiImagenes(api.imagenes ?? null);
            })
            .catch((e) => {
                setError(e instanceof Error ? e.message : "Error al cargar");
                setApiProperty(null);
                setApiPropertyRaw(null);
                setApiImagenes(null);
            })
            .finally(() => setLoading(false));
    }, [isUuid, id]);

    const property = apiProperty ?? staticProperty;

    if (isUuid && loading) {
        return (
            <section className="slider-area fix tp-slider-5-wrap">
                <div className="container py-5 text-center">
                    <p className="text-muted">Cargando…</p>
                </div>
            </section>
        );
    }

    if (isUuid && error) {
        return (
            <section className="slider-area fix tp-slider-5-wrap">
                <div className="container py-5 text-center">
                    <p className="text-danger">{error}</p>
                </div>
            </section>
        );
    }

    if (!property && !loading) {
        return (
            <section className="slider-area fix tp-slider-5-wrap">
                <div className="container py-5 text-center">
                    <p className="text-muted">Propiedad no encontrada.</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="slider-area fix tp-slider-5-wrap">
                <PropertySliderTwo property={property} imagenes={apiImagenes ?? undefined} />
            </section>
            <DetailsReusableArea spacingClass="pt-140" propertyDetails={apiPropertyRaw ?? undefined} />
        </>
    );
}