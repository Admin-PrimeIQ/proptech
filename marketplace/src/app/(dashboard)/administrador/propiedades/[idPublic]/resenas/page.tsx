"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import { toast } from "sonner";

type Resena = {
  idPublic: string;
  nombreCompleto: string;
  numeroTelefono: string;
  email: string;
  mensaje: string;
  estado: string;
  deseaPublicar: boolean;
  visiblePublico: boolean;
  fechaCreacion: string;
};

type ApiResponse = {
  propiedad?: { idPublic: string; nombrePropiedad: string };
  reseñas?: Resena[];
  error?: string;
};

export default function ResenasPropiedadPage() {
  const params = useParams();
  const idPublic = typeof params?.idPublic === "string" ? params.idPublic : "";
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idPublic) {
      setLoading(false);
      setError("ID de propiedad no válido.");
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/customer-reviews?idPropiedad=${encodeURIComponent(idPublic)}`)
      .then((r) => r.json())
      .then((json: ApiResponse & { data?: ApiResponse }) => {
        const payload = json?.data ?? json;
        if (payload?.error) {
          setError(payload.error);
          setData(null);
        } else {
          setData(payload);
          setError(null);
        }
      })
      .catch(() => {
        setError("Error al cargar las reseñas.");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [idPublic]);

  const refreshData = useCallback(() => {
    if (!idPublic) return;
    fetch(`/api/customer-reviews?idPropiedad=${encodeURIComponent(idPublic)}`)
      .then((r) => r.json())
      .then((json: ApiResponse & { data?: ApiResponse }) => {
        const payload = json?.data ?? json;
        if (!payload?.error) setData(payload);
      })
      .catch(() => {});
  }, [idPublic]);

  const handleToggle = useCallback(
    async (idPublicResena: string, field: "deseaPublicar" | "visiblePublico", value: boolean) => {
      try {
        const res = await fetch(`/api/customer-reviews/${idPublicResena}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        });
        const json = await res.json();
        if (!res.ok) {
          toast.error(json?.error ?? "Error al actualizar.");
          return;
        }
        toast.success("Actualizado.");
        refreshData();
      } catch {
        toast.error("Error al actualizar.");
      }
    },
    [refreshData]
  );

  return (
    <DashboardLayout>
      <div className="tp-dashboard-profile-wrapper">
        <Link
          href="/administrador/propiedades"
          className="tp-btn tp-btn-border mb-4 d-inline-flex align-items-center"
          style={{ gap: "8px" }}
        >
          <i className="fa-light fa-arrow-left" />
          Regresar a propiedades
        </Link>
        <AdminPageHeader
          title="Reseñas"
          subtitle={
            data?.propiedad?.nombrePropiedad
              ? `Reseñas de la propiedad: ${data.propiedad.nombrePropiedad}`
              : "Reseñas de esta propiedad"
          }
        />
        {loading && (
          <div className="py-5 text-center text-muted">Cargando reseñas…</div>
        )}
        {error && (
          <div className="py-5 text-center text-danger">{error}</div>
        )}
        {!loading && !error && data?.reseñas !== undefined && (
          <>
            {data.reseñas.length === 0 ? (
              <p className="text-muted mb-0">No hay reseñas para esta propiedad.</p>
            ) : (
              <div className="row">
                {data.reseñas.map((r) => (
                  <div
                    key={r.idPublic}
                    className="col-12 mb-4"
                  >
                    <div
                      className="p-4 rounded border bg-light"
                      style={{ borderColor: "var(--tp-border-primary, #e5e7eb)" }}
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                        <strong>{r.nombreCompleto}</strong>
                        <span className="badge bg-secondary">{r.estado}</span>
                      </div>
                      <p className="text-muted small mb-1">
                        {r.email} · {r.numeroTelefono}
                      </p>
                      <p className="mb-2">{r.mensaje}</p>
                      <div className="d-flex flex-wrap gap-3 align-items-center mb-2">
                        <label className="d-flex align-items-center gap-2 small">
                          <input
                            type="checkbox"
                            checked={r.deseaPublicar}
                            onChange={(e) =>
                              handleToggle(r.idPublic, "deseaPublicar", e.target.checked)
                            }
                          />
                          Desea publicar
                        </label>
                        <label className="d-flex align-items-center gap-2 small">
                          <input
                            type="checkbox"
                            checked={r.visiblePublico}
                            onChange={(e) =>
                              handleToggle(r.idPublic, "visiblePublico", e.target.checked)
                            }
                          />
                          Visible al público
                        </label>
                      </div>
                      <p className="small text-muted mb-0">
                        {new Date(r.fechaCreacion).toLocaleString("es-GT", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
