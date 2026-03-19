"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";

export type PlanPisoItem = {
  idPublic?: string;
  nombreDelPlano: string;
  idRecurso: string;
  url: string;
  orden: number;
};

interface PropertyPlanesPisoSectionProps {
  planes: PlanPisoItem[];
  onPlanesChange: (planes: PlanPisoItem[]) => void;
  maxPlanes?: number;
}

const ACCEPT = "image/png, image/jpeg, image/jpg";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

async function uploadOne(
  file: File,
  folder: string,
  creadoPor: string
): Promise<{ idRecurso: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipoRecurso", "IMAGEN");
  formData.append("folder", folder);
  formData.append("textoAlternativo", "Plano de piso");
  formData.append("creadoPor", creadoPor);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Error al subir la imagen");
  }
  const data = await res.json();
  return { idRecurso: data.idRecurso, url: data.url };
}

export default function PropertyPlanesPisoSection({
  planes,
  onPlanesChange,
  maxPlanes = 10,
}: PropertyPlanesPisoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [creadoPor, setCreadoPor] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editOrden, setEditOrden] = useState(0);

  const ensureCreadoPor = useCallback(async (): Promise<string> => {
    if (creadoPor) return creadoPor;
    const r = await fetch("/api/users");
    if (!r.ok) throw new Error("No se pudo obtener el usuario");
    const u = await r.json();
    const id = u.idPublic ?? u.data?.idPublic ?? "system";
    setCreadoPor(id);
    return id;
  }, [creadoPor]);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name}: no es una imagen válida`);
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`${file.name}: máximo 5MB`);
        return;
      }
      setUploading(true);
      try {
        const cp = await ensureCreadoPor();
        const { idRecurso, url } = await uploadOne(file, "planes-piso", cp);
        const nextOrden = planes.length;
        const nuevo: PlanPisoItem = {
          nombreDelPlano: `Plano ${nextOrden + 1}`,
          idRecurso,
          url,
          orden: nextOrden,
        };
        onPlanesChange([...planes, nuevo]);
        toast.success("Imagen del plano subida. Puedes editar el nombre.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error al subir");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [planes, onPlanesChange, ensureCreadoPor]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && planes.length < maxPlanes) processFile(file);
  };

  const handleRemove = (index: number) => {
    const next = planes.filter((_, i) => i !== index).map((p, i) => ({ ...p, orden: i }));
    onPlanesChange(next);
    if (editingIndex === index) setEditingIndex(null);
    else if (editingIndex != null && editingIndex > index) setEditingIndex(editingIndex - 1);
    toast.success("Plano eliminado de la lista");
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditNombre(planes[index].nombreDelPlano);
    setEditOrden(planes[index].orden);
  };

  const saveEdit = () => {
    if (editingIndex == null) return;
    const next = [...planes];
    next[editingIndex] = {
      ...next[editingIndex],
      nombreDelPlano: editNombre.trim() || next[editingIndex].nombreDelPlano,
      orden: editOrden,
    };
    onPlanesChange(next);
    setEditingIndex(null);
    toast.success("Plano actualizado");
  };

  const canAdd = planes.length < maxPlanes && !uploading;

  return (
    <div className="tp-dashboard-new-property mb-50">
      <h5 className="tp-dashboard-new-title">Planes de piso</h5>
      <p className="text-muted" style={{ fontSize: "14px", marginBottom: "12px" }}>
        Sube imágenes de los planos de piso de la propiedad. Puedes editar el nombre y el orden.
      </p>

      <div className="tp-dashboard-new-um">
        <div
          className="tp-dashboard-new-um-content"
          style={{
            opacity: canAdd ? 1 : 0.6,
            pointerEvents: canAdd ? "auto" : "none",
          }}
        >
          <span className="upload-btn">
            <label
              htmlFor="tp-planes-piso-file"
              style={{ cursor: canAdd ? "pointer" : "not-allowed" }}
            >
              {uploading ? (
                <>
                  <i className="fa-light fa-spinner fa-spin" style={{ marginRight: "6px" }} />
                  Subiendo…
                </>
              ) : (
                "Agregar plano (imagen)"
              )}
            </label>
          </span>
          <input
            ref={fileInputRef}
            id="tp-planes-piso-file"
            type="file"
            accept={ACCEPT}
            onChange={handleInputChange}
            disabled={!canAdd}
            style={{ display: "none" }}
          />
          <p style={{ marginTop: "8px" }}>Hasta {maxPlanes} planos</p>
        </div>

        {planes.length > 0 && (
          <div
            className="tp-dashboard-new-um-img-box d-flex"
            style={{ marginTop: "20px", flexWrap: "wrap", gap: "15px" }}
          >
            {planes.map((plan, index) => (
              <div
                key={plan.idRecurso}
                style={{
                  position: "relative",
                  border: "1px solid var(--tp-border-1, #e5e7eb)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <Image
                  src={plan.url}
                  alt={plan.nombreDelPlano}
                  width={194}
                  height={109}
                  style={{ objectFit: "cover", display: "block" }}
                  unoptimized
                />
                {editingIndex === index ? (
                  <div style={{ padding: "10px", background: "#f9fafb" }}>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      placeholder="Nombre del plano"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control form-control-sm mb-2"
                      placeholder="Orden"
                      value={editOrden}
                      onChange={(e) => setEditOrden(parseInt(e.target.value, 10) || 0)}
                      min={0}
                    />
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="tp-btn add"
                        style={{ padding: "4px 10px", fontSize: "13px" }}
                        onClick={saveEdit}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="tp-btn tp-btn-border"
                        style={{ padding: "4px 10px", fontSize: "13px" }}
                        onClick={() => setEditingIndex(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        padding: "6px 10px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                    >
                      {plan.nombreDelPlano} (orden: {plan.orden})
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        display: "flex",
                        gap: "4px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => startEdit(index)}
                        title="Editar"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="fa-light fa-edit" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        title="Eliminar"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          border: "none",
                          background: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="fal fa-trash-alt" style={{ color: "#ff6b6b" }} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
