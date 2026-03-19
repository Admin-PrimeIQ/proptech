"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import AdminSectionCard from "@/components/Admin/Layout/AdminSectionCard";
import SectionHeader from "@/components/Admin/Layout/SectionHeader";

export default function VendedorForm() {
  const [nombre, setNombre] = useState("");
  const [vendedorFotoIdRecurso, setVendedorFotoIdRecurso] = useState<string | null>(null);
  const [vendedorFotoUrl, setVendedorFotoUrl] = useState<string | null>(null);
  const [vendedorFotoUploading, setVendedorFotoUploading] = useState(false);
  const [vendedorFotoRemoving, setVendedorFotoRemoving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const vendedorFotoInputRef = useRef<HTMLInputElement>(null);

  const handleVendedorFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona una imagen válida (PNG, JPEG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }
    setVendedorFotoUploading(true);
    try {
      let creadoPor = "system";
      const userRes = await fetch("/api/users");
      if (userRes.ok) {
        const u = await userRes.json();
        creadoPor = u.idPublic ?? u.data?.idPublic ?? "system";
      }
      const fd = new FormData();
      fd.append("file", file);
      fd.append("tipoRecurso", "IMAGEN");
      fd.append("folder", "vendedores");
      fd.append("textoAlternativo", "Foto de vendedor");
      fd.append("creadoPor", creadoPor);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error al subir la imagen");
      setVendedorFotoIdRecurso(data.idRecurso ?? null);
      setVendedorFotoUrl(data.url ?? null);
      toast.success("Foto del vendedor subida correctamente.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir la foto.");
    } finally {
      setVendedorFotoUploading(false);
      if (vendedorFotoInputRef.current) vendedorFotoInputRef.current.value = "";
    }
  };

  const handleVendedorFotoRemove = async () => {
    if (!vendedorFotoIdRecurso) {
      setVendedorFotoUrl(null);
      if (vendedorFotoInputRef.current) vendedorFotoInputRef.current.value = "";
      return;
    }
    setVendedorFotoRemoving(true);
    try {
      const res = await fetch(`/api/recursos/${vendedorFotoIdRecurso}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error al eliminar la foto");
      setVendedorFotoIdRecurso(null);
      setVendedorFotoUrl(null);
      if (vendedorFotoInputRef.current) vendedorFotoInputRef.current.value = "";
      toast.success("Foto del vendedor eliminada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar la foto.");
    } finally {
      setVendedorFotoRemoving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre?.trim()) {
      toast.error("El nombre del vendedor es requerido.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/vendedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          idFotoRecurso: vendedorFotoIdRecurso ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Error al guardar el vendedor.");
        return;
      }
      toast.success("Vendedor agregado exitosamente.");
      // Limpiar formulario
      setNombre("");
      setVendedorFotoIdRecurso(null);
      setVendedorFotoUrl(null);
      if (vendedorFotoInputRef.current) vendedorFotoInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar. Revisa la consola.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AdminSectionCard>
        <SectionHeader title="Información del Vendedor" showEditButton={false} />
        <div className="tp-dashboard-profile-info">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-dashboard-new-property-box">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Nombre del Vendedor:* </label>
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-dashboard-new-input">
                      <label>Foto del Vendedor: </label>
                      <input
                        ref={vendedorFotoInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleVendedorFotoChange}
                        disabled={vendedorFotoUploading}
                        style={{ display: "block", marginBottom: "8px" }}
                      />
                      {vendedorFotoUploading && (
                        <p style={{ fontSize: "13px", color: "var(--tp-text-body)", marginTop: "4px" }}>
                          Subiendo…
                        </p>
                      )}
                      {vendedorFotoUrl && !vendedorFotoUploading && (
                        <div style={{ marginTop: "10px", position: "relative", display: "inline-block" }}>
                          <img
                            src={vendedorFotoUrl}
                            alt="Foto vendedor"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid #e0e0e0",
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleVendedorFotoRemove}
                            title="Quitar foto"
                            disabled={vendedorFotoRemoving}
                            style={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              border: "none",
                              background: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              cursor: vendedorFotoRemoving ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                            }}
                          >
                            {vendedorFotoRemoving ? (
                              <i className="fa-light fa-spinner fa-spin" />
                            ) : (
                              <i className="fal fa-times" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <div className="tp-dashboard-new-btn d-flex flex-wrap align-items-center" style={{ gap: "12px" }}>
        <button type="submit" className="add" disabled={submitting}>
          {submitting ? "Guardando…" : "Agregar Vendedor"}
        </button>
      </div>
    </form>
  );
}
