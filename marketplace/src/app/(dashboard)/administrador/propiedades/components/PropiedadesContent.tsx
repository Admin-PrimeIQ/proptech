"use client";

import { useState, useEffect, useCallback } from "react";
import PropertyPagination from "@/components/Common/pagination/PropertyPagination";
import DashboardPropertyItem from "./DashboardPropertyItem";
import FilterByProperty from "./FilterByProperty";
import { mapApiPropiedadToCardItem } from "@/lib/mapApiPropiedadToCard";
import type { IFeaturedPropertyDT } from "@/types/property-d-t";
import { toast } from "sonner";

type ApiPropiedad = {
  idPublic: string;
  nombrePropiedad: string;
  referenciaCorta?: string | null;
  direccionPublica?: string | null;
  habitaciones?: number | null;
  banos?: number | null;
  parqueos?: number | null;
  metrosConstruccion?: number | null;
  metrosTerreno?: number | null;
  tipoOperacion?: { nombre: string } | null;
  zona?: { nombre: string } | null;
  vendedor?: { nombre: string } | null;
  precio?: { precio: number; moneda?: string } | null;
  imagenes?: Array<{ url: string; esPortada?: boolean }>;
};

type GetPropiedadFull = {
  idPublic: string;
  nombrePropiedad: string;
  referenciaCorta?: string | null;
  descripcionGeneral?: string | null;
  estadoPublicacion?: string;
  categoria?: { idPublic: string; nombre: string; slug: string } | null;
  tipoOperacion?: { idPublic: string; nombre: string } | null;
  zona?: { idPublic: string; nombre: string } | null;
  direccionPublica?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  habitaciones?: number | null;
  banos?: number | null;
  parqueos?: number | null;
  metrosConstruccion?: number | null;
  metrosTerreno?: number | null;
  anoConstruccion?: number | null;
  vendedor?: { idPublic: string; nombre: string } | null;
  precio?: {
    moneda: string;
    precio: number;
    precioPorM2Construccion?: number | null;
    mantenimiento?: number | null;
  } | null;
  imagenes?: Array<{
    idRecurso: string;
    orden: number;
    esPortada: boolean;
  }>;
};

const LIMIT_PER_PAGE = 4;

export default function PropiedadesContent() {
  const [categoriaIdPublic, setCategoriaIdPublic] = useState("");
  const [selectedPropertyName, setSelectedPropertyName] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [properties, setProperties] = useState<IFeaturedPropertyDT[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicateTarget, setDuplicateTarget] = useState<IFeaturedPropertyDT | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IFeaturedPropertyDT | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProperties = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT_PER_PAGE),
      scope: "admin",
    });
    if (categoriaIdPublic) params.set("categoriaIdPublic", categoriaIdPublic);
    fetch(`/api/propiedades?${params}`)
      .then((r) => r.json())
      .then((res: { data?: ApiPropiedad[]; pagination?: { totalPages: number } }) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        let mapped = list.map((p) => mapApiPropiedadToCardItem(p));

        if (selectedPropertyName) {
          const searchName = selectedPropertyName.toLowerCase().trim();
          mapped = mapped.filter((p) =>
            p.title.toLowerCase().trim() === searchName
          );
        }

        setProperties(mapped);
        const tp = res?.pagination?.totalPages;
        setTotalPages(typeof tp === "number" && tp >= 1 ? tp : 1);
      })
      .catch(() => {
        setProperties([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [categoriaIdPublic, selectedPropertyName, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleCategoriaChange = useCallback((value: string) => {
    setCategoriaIdPublic(value);
    setPage(1);
  }, []);

  const handlePropertySelect = useCallback((propertyName: string | null) => {
    setSelectedPropertyName(propertyName);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
  }, []);

  const handleDuplicateRequest = useCallback((property: IFeaturedPropertyDT) => {
    setDeleteTarget(null);
    setDuplicateTarget(property);
  }, []);

  const handleDeleteRequest = useCallback((property: IFeaturedPropertyDT) => {
    setDuplicateTarget(null);
    setDeleteTarget(property);
  }, []);

  const handleDuplicateConfirm = useCallback(async () => {
    const p = duplicateTarget;
    if (!p?.idPublic || actionLoading) return;
    setActionLoading(true);
    try {
      const [propRes, refRes] = await Promise.all([
        fetch(`/api/propiedades/${p.idPublic}?scope=admin`),
        fetch("/api/propiedades/siguiente-referencia"),
      ]);
      const propData = await propRes.json();
      const refData = await refRes.json();
      if (!propRes.ok || !propData?.idPublic) {
        toast.error(propData?.error || "Error al cargar la propiedad.");
        return;
      }
      if (!refRes.ok || !refData?.referenciaCorta) {
        toast.error(refData?.error || "Error al generar referencia.");
        return;
      }
      const full = propData as GetPropiedadFull;
      const body = {
        nombrePropiedad: `Copia de ${full.nombrePropiedad}`,
        referenciaCorta: refData.referenciaCorta,
        descripcionGeneral: full.descripcionGeneral ?? null,
        estadoPublicacion: "BORRADOR",
        categoria: full.categoria?.slug ?? "",
        operacionInmobiliaria: full.tipoOperacion?.nombre ?? "",
        zonaIdPublic: full.zona?.idPublic ?? undefined,
        direccionPublica: full.direccionPublica ?? null,
        latitud: full.latitud ?? null,
        longitud: full.longitud ?? null,
        habitaciones: full.habitaciones ?? null,
        banos: full.banos ?? null,
        parqueos: full.parqueos ?? null,
        metroConstruccion: full.metrosConstruccion ?? null,
        metrosTerreno: full.metrosTerreno ?? null,
        anoConstruccion: full.anoConstruccion ?? null,
        vendedorIdPublic: full.vendedor?.idPublic ?? undefined,
        precio: full.precio
          ? {
              moneda: full.precio.moneda,
              precio: full.precio.precio,
              precioPorM2Construccion: full.precio.precioPorM2Construccion ?? null,
              mantenimiento: full.precio.mantenimiento ?? null,
            }
          : undefined,
        imagenes: (full.imagenes ?? []).map((im) => ({
          idRecurso: im.idRecurso,
          orden: im.orden,
          esPortada: im.esPortada,
        })),
      };
      const createRes = await fetch("/api/propiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) {
        toast.error(createJson?.error || "Error al duplicar la propiedad.");
        return;
      }
      toast.success("Propiedad duplicada correctamente.");
      setDuplicateTarget(null);
      fetchProperties();
    } catch (e) {
      toast.error("Error al duplicar. Intenta de nuevo.");
    } finally {
      setActionLoading(false);
    }
  }, [duplicateTarget, actionLoading, fetchProperties]);

  const handleDeleteConfirm = useCallback(async () => {
    const p = deleteTarget;
    if (!p?.idPublic || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/propiedades/${p.idPublic}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Error al eliminar la propiedad.");
        return;
      }
      toast.success("Propiedad eliminada.");
      setDeleteTarget(null);
      fetchProperties();
    } catch {
      toast.error("Error al eliminar. Intenta de nuevo.");
    } finally {
      setActionLoading(false);
    }
  }, [deleteTarget, actionLoading, fetchProperties]);

  return (
    <>
      <div className="tp-dashboard-property-wrap">
        <FilterByProperty
          categoriaIdPublic={categoriaIdPublic}
          onCategoriaChange={handleCategoriaChange}
          onPropertySelect={handlePropertySelect}
        />
      </div>
      <div className="tp-dashboard-property-wrapper">
        <div className="row">
          {loading ? (
            <div className="col-12 py-5 text-center">Cargando…</div>
          ) : properties.length === 0 ? (
            <div className="col-12 py-5 text-center">No hay propiedades.</div>
          ) : (
            properties.map((property) => (
              <DashboardPropertyItem
                property={property}
                key={property.idPublic ?? property.id}
                onDuplicateRequest={handleDuplicateRequest}
                onDeleteRequest={handleDeleteRequest}
              />
            ))
          )}
          <div className="col-lg-12">
            <PropertyPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {(duplicateTarget || deleteTarget) && (
        <div
          className="modal-backdrop show"
          style={{ position: "fixed", inset: 0, zIndex: 1040, backgroundColor: "rgba(0,0,0,.5)" }}
          aria-hidden="true"
        />
      )}

      {duplicateTarget && (
        <div
          className="modal show d-block"
          style={{ position: "fixed", inset: 0, zIndex: 1050, overflowX: "hidden", overflowY: "auto" }}
          tabIndex={-1}
          aria-modal
          aria-labelledby="modal-duplicar-title"
          onClick={() => !actionLoading && setDuplicateTarget(null)}
          role="presentation"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-duplicar-title"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modal-duplicar-title">
                  Duplicar propiedad
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => !actionLoading && setDuplicateTarget(null)}
                  disabled={actionLoading}
                />
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  ¿Desea duplicar la propiedad &quot;{duplicateTarget.title}&quot;? Se creará una nueva
                  propiedad en borrador con la misma información.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => !actionLoading && setDuplicateTarget(null)}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleDuplicateConfirm}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Procesando…" : "Duplicar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="modal show d-block"
          style={{ position: "fixed", inset: 0, zIndex: 1050, overflowX: "hidden", overflowY: "auto" }}
          tabIndex={-1}
          aria-modal
          aria-labelledby="modal-eliminar-title"
          onClick={() => !actionLoading && setDeleteTarget(null)}
          role="presentation"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="modal-eliminar-title"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modal-eliminar-title">
                  Eliminar propiedad
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => !actionLoading && setDeleteTarget(null)}
                  disabled={actionLoading}
                />
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  ¿Desea eliminar la propiedad &quot;{deleteTarget.title}&quot;? Esta acción no se puede
                  deshacer.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => !actionLoading && setDeleteTarget(null)}
                  disabled={actionLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Eliminando…" : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
