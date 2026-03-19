"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";

type SolicitudItem = {
  idPublic: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  mensaje: string | null;
  estado: string;
  contactado: boolean | null;
  fechaCreacion: string;
  propiedad: { idPublic: string; nombrePropiedad: string } | null;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-GT", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function estadoLabel(estado: string): string {
  if (estado === "CONTACTADO") return "Contactado";
  if (estado === "NO_CONTACTAR") return "No contactar";
  return "Pendiente";
}

type EstadoFilter = "" | "PENDIENTE" | "CONTACTADO" | "NO_CONTACTAR";

export default function SolicitudesContent() {
  const [solicitudes, setSolicitudes] = useState<SolicitudItem[]>([]);
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const solicitudesFiltradas =
    estadoFilter === ""
      ? solicitudes
      : solicitudes.filter((s) => s.estado === estadoFilter);

  const fetchSolicitudes = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/solicitudes-contacto")
      .then((r) => r.json())
      .then((res: SolicitudItem[]) => {
        const list = Array.isArray(res) ? res : [];
        setSolicitudes(list);
      })
      .catch(() => {
        setError("Error al cargar las solicitudes.");
        setSolicitudes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [fetchSolicitudes]);

  const handleUpdateEstado = useCallback(
    (idPublic: string, nuevoEstado: "PENDIENTE" | "CONTACTADO" | "NO_CONTACTAR") => {
      setUpdatingId(idPublic);
      fetch(`/api/solicitudes-contacto/${idPublic}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: nuevoEstado,
          contactado: nuevoEstado === "CONTACTADO",
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
            return;
          }
          setSolicitudes((prev) =>
            prev.map((s) =>
              s.idPublic === idPublic
                ? { ...s, estado: nuevoEstado, contactado: nuevoEstado === "CONTACTADO" }
                : s
            )
          );
          toast.success("Estado actualizado.");
        })
        .catch(() => toast.error("Error al actualizar el estado."))
        .finally(() => setUpdatingId(null));
    },
    []
  );

  if (loading) {
    return (
      <div className="tp-dashboard-new-property">
        <h5 className="tp-dashboard-new-title">Solicitudes</h5>
        <div className="tp-postbox-comment">
          <p className="text-muted">Cargando solicitudes…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tp-dashboard-new-property">
        <h5 className="tp-dashboard-new-title">Solicitudes</h5>
        <div className="tp-postbox-comment">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tp-dashboard-new-property">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h5 className="tp-dashboard-new-title mb-0">Solicitudes</h5>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="solicitudes-estado-filter" className="mb-0 me-2" style={{ fontSize: "14px" }}>
            Filtrar por estado:
          </label>
          <select
            id="solicitudes-estado-filter"
            className="form-select tp-select"
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value as EstadoFilter)}
            style={{ minWidth: "160px" }}
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONTACTADO">Contactado</option>
            <option value="NO_CONTACTAR">No contactar</option>
          </select>
        </div>
      </div>
      <div className="tp-postbox-comment">
        {solicitudes.length === 0 ? (
          <p className="text-muted">No hay solicitudes recibidas.</p>
        ) : solicitudesFiltradas.length === 0 ? (
          <p className="text-muted">
            No hay solicitudes con estado &quot;{estadoFilter === "PENDIENTE" ? "Pendiente" : estadoFilter === "CONTACTADO" ? "Contactado" : "No contactar"}&quot;.
          </p>
        ) : (
          <ul>
            {solicitudesFiltradas.map((s) => (
              <li key={s.idPublic}>
                <div className="tp-postbox-comment-box d-flex">
                  <div className="tp-postbox-comment-info flex-grow-1">
                    <div className="tp-postbox-comment-text">
                      <div className="tp-postbox-comment-name d-flex align-items-center flex-wrap gap-2">
                        <h5 className="tp-postbox-comment-name-title mb-0">{s.nombre}</h5>
                        <span className="post-meta">{formatDate(s.fechaCreacion)}</span>
                        <span
                          className="badge rounded-pill"
                          style={{
                            backgroundColor:
                              s.estado === "PENDIENTE"
                                ? "var(--tp-theme-primary)"
                                : s.estado === "CONTACTADO"
                                  ? "#198754"
                                  : "#6c757d",
                            color: "#fff",
                            fontSize: "12px",
                          }}
                        >
                          {estadoLabel(s.estado)}
                        </span>
                      </div>
                      <p className="mb-1">
                        <strong>Correo:</strong>{" "}
                        <a href={`mailto:${s.correo}`}>{s.correo}</a>
                      </p>
                      {s.telefono && (
                        <p className="mb-1">
                          <strong>Teléfono:</strong>{" "}
                          <a href={`tel:${s.telefono}`}>{s.telefono}</a>
                        </p>
                      )}
                      {s.propiedad && (
                        <p className="mb-1">
                          <strong>Propiedad:</strong> {s.propiedad.nombrePropiedad}
                        </p>
                      )}
                      {s.mensaje && (
                        <p className="mb-2 mt-2">
                          <strong>Mensaje:</strong> {s.mensaje}
                        </p>
                      )}
                      <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                        {s.propiedad && (
                          <Link
                            href={`/property-details-2/${s.propiedad.idPublic}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tp-btn tp-btn-border"
                            style={{ padding: "8px 16px", fontSize: "14px" }}
                          >
                            Ver propiedad
                          </Link>
                        )}
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="tp-btn"
                            disabled={updatingId === s.idPublic}
                            onClick={() => handleUpdateEstado(s.idPublic, "CONTACTADO")}
                            style={{
                              padding: "6px 12px",
                              fontSize: "13px",
                              opacity: updatingId === s.idPublic ? 0.7 : 1,
                            }}
                          >
                            {updatingId === s.idPublic ? "Actualizando…" : "Marcar como contactado"}
                          </button>
                          <button
                            type="button"
                            className="tp-btn tp-btn-border"
                            disabled={updatingId === s.idPublic}
                            onClick={() => handleUpdateEstado(s.idPublic, "NO_CONTACTAR")}
                            style={{
                              padding: "6px 12px",
                              fontSize: "13px",
                              opacity: updatingId === s.idPublic ? 0.7 : 1,
                            }}
                          >
                            No contactar
                          </button>
                          {s.estado !== "PENDIENTE" && (
                            <button
                              type="button"
                              className="tp-btn tp-btn-border"
                              disabled={updatingId === s.idPublic}
                              onClick={() => handleUpdateEstado(s.idPublic, "PENDIENTE")}
                              style={{
                                padding: "6px 12px",
                                fontSize: "13px",
                                opacity: updatingId === s.idPublic ? 0.7 : 1,
                              }}
                            >
                              Pendiente
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
