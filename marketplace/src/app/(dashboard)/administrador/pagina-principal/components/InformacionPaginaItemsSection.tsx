"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AdminSectionCard from "@/components/Admin/Layout/AdminSectionCard";
import SectionHeader from "@/components/Admin/Layout/SectionHeader";
import ImageUploader from "@/components/Admin/Fields/ImageUploader";

type Item = {
  idPublic: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
  imagen: { idPublic: string; url: string } | null;
};

export default function InformacionPaginaItemsSection() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [orden, setOrden] = useState(0);
  const [activo, setActivo] = useState(true);
  const [imagenIdRecurso, setImagenIdRecurso] = useState<string | null>(null);
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/informacion-pagina-items");
    const data = await res.json();
    if (!res.ok || data?.error) {
      throw new Error(data?.error || "No se pudieron cargar los items");
    }
    setItems(Array.isArray(data) ? data : data?.data ?? []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchItems()
      .catch(() => {
        if (!cancelled) toast.error("Error al cargar cards de información página");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchItems]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setTitulo("");
    setDescripcion("");
    setOrden(0);
    setActivo(true);
    setImagenIdRecurso(null);
    setImagenUrl(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    if (!titulo.trim()) {
      toast.error("El título es requerido");
      return;
    }
    if (!imagenIdRecurso) {
      toast.error("Debes subir una imagen");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        idPublic: editingId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        orden,
        activo,
        imagenIdRecurso,
      };

      const response = await fetch("/api/informacion-pagina-items", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || "No se pudo guardar");
      }

      toast.success(editingId ? "Card actualizada" : "Card creada");
      await fetchItems();
      resetForm();
      setIsEditing(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (idPublic: string) => {
    if (!confirm("Eliminar esta card?")) return;
    try {
      const response = await fetch(`/api/informacion-pagina-items?idPublic=${encodeURIComponent(idPublic)}`, {
        method: "DELETE",
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || "No se pudo eliminar");
      }
      toast.success("Card eliminada");
      await fetchItems();
      if (editingId === idPublic) {
        resetForm();
        setIsEditing(false);
      }
    } catch {
      toast.error("Error al eliminar card");
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.idPublic);
    setTitulo(item.titulo);
    setDescripcion(item.descripcion ?? "");
    setOrden(item.orden);
    setActivo(item.activo);
    setImagenIdRecurso(item.imagen?.idPublic ?? null);
    setImagenUrl(item.imagen?.url ?? null);
    setIsEditing(true);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
      <AdminSectionCard>
        <SectionHeader
          title="Cards Carrusel Información Página"
          subtitle="Crea múltiples cards para mostrar en rotación cada 2 segundos"
          showEditButton={!loading}
          isEditing={isEditing}
          onEditToggle={() => {
            if (isEditing) {
              setIsEditing(false);
              resetForm();
              return;
            }
            setIsEditing(true);
          }}
        />

        {loading ? (
          <div className="py-5 text-center">Cargando cards…</div>
        ) : (
          <div className="tp-dashboard-profile-info">
            <div className="row">
              <div className="col-lg-12">
                {items.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-3">Cards existentes:</h6>
                    {items.map((item) => (
                      <div
                        key={item.idPublic}
                        className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded"
                      >
                        <div>
                          <strong>{item.titulo}</strong> - orden: {item.orden} - {item.activo ? "Activo" : "Inactivo"}
                        </div>
                        <div>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEdit(item)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item.idPublic)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isEditing && (
                  <div className="tp-dashboard-new-property-box">
                    <div className="tp-dashboard-new-input">
                      <label>Título</label>
                      <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ej: Invertir en bienes raíces con estrategia"
                        required
                      />
                    </div>
                    <div className="tp-dashboard-new-input">
                      <label>Descripción</label>
                      <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={5}
                        placeholder="Describe el contenido de la card..."
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid #E6E6E6",
                          borderRadius: "4px",
                          fontSize: "14px",
                          fontFamily: "inherit",
                          resize: "vertical",
                        }}
                      />
                    </div>
                    <div className="tp-dashboard-new-input">
                      <label>Orden</label>
                      <input
                        type="number"
                        min={0}
                        value={orden}
                        onChange={(e) => setOrden(parseInt(e.target.value, 10) || 0)}
                      />
                    </div>
                    <div className="tp-dashboard-new-input">
                      <label>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={activo}
                          onChange={(e) => setActivo(e.target.checked)}
                        />
                        Activo
                      </label>
                    </div>
                    <div className="tp-dashboard-new-input">
                      <ImageUploader
                        label="Imagen"
                        currentImageUrl={imagenUrl}
                        onUploadComplete={(idRecurso, url) => {
                          setImagenIdRecurso(idRecurso);
                          setImagenUrl(url);
                        }}
                        folder="informacion-pagina-items"
                        textoAlternativo="Imagen card información página"
                        width={280}
                        height={160}
                        previewFit="cover"
                        placeholderIconOnly
                        disabled={false}
                      />
                    </div>
                    <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px", marginTop: "20px" }}>
                      <button type="submit" className="add" disabled={saving}>
                        {saving ? "Guardando…" : editingId ? "Actualizar" : "Crear"}
                      </button>
                      <button
                        type="button"
                        className="add"
                        onClick={() => {
                          setIsEditing(false);
                          resetForm();
                        }}
                        disabled={saving}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminSectionCard>
    </form>
  );
}
