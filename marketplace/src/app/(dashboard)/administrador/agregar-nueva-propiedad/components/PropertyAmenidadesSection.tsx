"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export type AmenidadItem = {
  idPublic: string;
  nombreAmenidad: string;
  activo: boolean;
};

interface PropertyAmenidadesSectionProps {
  selectedIds: string[];
  onSelectedChange: (ids: string[]) => void;
}

export default function PropertyAmenidadesSection({
  selectedIds,
  onSelectedChange,
}: PropertyAmenidadesSectionProps) {
  const [amenidades, setAmenidades] = useState<AmenidadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [newNombre, setNewNombre] = useState("");
  const [saving, setSaving] = useState(false);

  const loadAmenidades = useCallback(async () => {
    try {
      const res = await fetch("/api/amenidades");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error al cargar amenidades");
      const list = Array.isArray(data) ? data : data?.data ?? data;
      setAmenidades(Array.isArray(list) ? list : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al cargar amenidades");
      setAmenidades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAmenidades();
  }, [loadAmenidades]);

  const toggleSelect = (idPublic: string) => {
    if (selectedIds.includes(idPublic)) {
      onSelectedChange(selectedIds.filter((id) => id !== idPublic));
    } else {
      onSelectedChange([...selectedIds, idPublic]);
    }
  };

  const handleCreate = async () => {
    if (!newNombre.trim()) {
      toast.error("Escribe el nombre de la amenidad");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/amenidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreAmenidad: newNombre.trim(), activo: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error al crear");
      setAmenidades((prev) => [
        ...prev,
        {
          idPublic: data.idPublic ?? data.data?.idPublic,
          nombreAmenidad: data.nombreAmenidad ?? data.data?.nombreAmenidad ?? newNombre.trim(),
          activo: true,
        },
      ]);
      setNewNombre("");
      toast.success("Amenidad creada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al crear");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item: AmenidadItem) => {
    setEditingId(item.idPublic);
    setEditNombre(item.nombreAmenidad);
  };

  const handleUpdate = async () => {
    if (!editingId || !editNombre.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/amenidades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPublic: editingId, nombreAmenidad: editNombre.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error al actualizar");
      setAmenidades((prev) =>
        prev.map((a) =>
          a.idPublic === editingId ? { ...a, nombreAmenidad: editNombre.trim() } : a
        )
      );
      setEditingId(null);
      setEditNombre("");
      toast.success("Amenidad actualizada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (idPublic: string) => {
    if (!confirm("¿Eliminar esta amenidad?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/amenidades?idPublic=${encodeURIComponent(idPublic)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error al eliminar");
      setAmenidades((prev) => prev.filter((a) => a.idPublic !== idPublic));
      onSelectedChange(selectedIds.filter((id) => id !== idPublic));
      setEditingId((prev) => (prev === idPublic ? null : prev));
      toast.success("Amenidad eliminada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="tp-dashboard-new-property mb-50">
        <h5 className="tp-dashboard-new-title">Amenidades</h5>
        <p className="text-muted">Cargando amenidades…</p>
      </div>
    );
  }

  return (
    <div className="tp-dashboard-new-property mb-50">
      <h5 className="tp-dashboard-new-title">Amenidades</h5>
      <p className="text-muted" style={{ fontSize: "14px", marginBottom: "12px" }}>
        Selecciona las amenidades que tiene esta propiedad. Puedes crear o editar amenidades desde
        &quot;Gestionar amenidades&quot;.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        {amenidades
          .filter((a) => a.activo)
          .map((a) => (
            <label
              key={a.idPublic}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--tp-border-1, #e5e7eb)",
                background: selectedIds.includes(a.idPublic)
                  ? "var(--tp-theme-secondary, #F0F4FD)"
                  : "#fff",
              }}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(a.idPublic)}
                onChange={() => toggleSelect(a.idPublic)}
              />
              <span>{a.nombreAmenidad}</span>
            </label>
          ))}
      </div>

      <button
        type="button"
        className="tp-btn tp-btn-border"
        onClick={() => setModalOpen(true)}
      >
        <i className="fa-light fa-list" style={{ marginRight: "6px" }} />
        Gestionar amenidades
      </button>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => !saving && setModalOpen(false)}
        >
          <div
            className="tp-dashboard-new-property-box"
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "480px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h5 className="mb-0">Gestionar amenidades</h5>
              <button
                type="button"
                onClick={() => !saving && setModalOpen(false)}
                style={{ border: "none", background: "none", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="d-block" style={{ marginBottom: "6px", fontWeight: 600 }}>
                Nueva amenidad
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Piscina, Gimnasio"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreate())}
                />
                <button
                  type="button"
                  className="tp-btn add"
                  disabled={saving || !newNombre.trim()}
                  onClick={handleCreate}
                >
                  {saving ? "…" : "Agregar"}
                </button>
              </div>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {amenidades.map((a) => (
                <li
                  key={a.idPublic}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {editingId === a.idPublic ? (
                    <>
                      <input
                        type="text"
                        className="form-control"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="tp-btn add"
                        disabled={saving}
                        onClick={handleUpdate}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="tp-btn tp-btn-border"
                        disabled={saving}
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1 }}>{a.nombreAmenidad}</span>
                      <button
                        type="button"
                        className="tp-btn tp-btn-border"
                        style={{ padding: "4px 10px", fontSize: "13px" }}
                        disabled={saving}
                        onClick={() => startEdit(a)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="tp-btn tp-btn-border"
                        style={{ padding: "4px 10px", fontSize: "13px", color: "#dc3545" }}
                        disabled={saving}
                        onClick={() => handleDelete(a.idPublic)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {amenidades.length === 0 && (
              <p className="text-muted mb-0" style={{ marginTop: "12px" }}>
                No hay amenidades. Agrega una arriba.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
