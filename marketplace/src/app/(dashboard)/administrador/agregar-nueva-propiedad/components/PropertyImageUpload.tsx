"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

export type ImagenPropiedadItem = {
  idRecurso: string;
  url: string;
  esPortada?: boolean;
};

interface PropertyImageUploadProps {
  images: ImagenPropiedadItem[];
  onImagesChange: (images: ImagenPropiedadItem[]) => void;
  maxImages?: number;
}

const ACCEPT = "image/png, image/jpeg, image/jpg";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const MIN_PORTADA_WIDTH = 1300;
const MIN_PORTADA_HEIGHT = 500;

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo cargar la imagen"));
    };
    img.src = url;
  });
}

function getImageDimensionsFromUrl(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
    img.src = url;
  });
}

async function uploadOne(
  file: File,
  folder: string,
  creadoPor: string
): Promise<{ idRecurso: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipoRecurso", "IMAGEN");
  formData.append("folder", folder);
  formData.append("textoAlternativo", "Imagen de propiedad");
  formData.append("creadoPor", creadoPor);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Error al subir la imagen");
  }
  const data = await res.json();
  return { idRecurso: data.idRecurso, url: data.url };
}

export default function PropertyImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
}: PropertyImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [creadoPor, setCreadoPor] = useState<string | null>(null);

  const ensureCreadoPor = useCallback(async (): Promise<string> => {
    if (creadoPor) return creadoPor;
    const r = await fetch("/api/users");
    if (!r.ok) throw new Error("No se pudo obtener el usuario");
    const u = await r.json();
    const id = u.idPublic ?? u.data?.idPublic ?? "system";
    setCreadoPor(id);
    return id;
  }, [creadoPor]);

  const processFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length || images.length >= maxImages) return;
      const remaining = maxImages - images.length;
      const files = Array.from(fileList).slice(0, remaining);
      const isFirst = images.length === 0;

      setUploading(true);
      try {
        const cp = await ensureCreadoPor();
        const added: ImagenPropiedadItem[] = [];
        let portadaSetInBatch = false;
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (!f.type.startsWith("image/")) {
            toast.error(`${f.name}: no es una imagen válida`);
            continue;
          }
          if (f.size > MAX_SIZE_BYTES) {
            toast.error(`${f.name}: máximo 5MB`);
            continue;
          }
          const willBePortada = isFirst && !portadaSetInBatch;
          if (willBePortada) {
            try {
              const { width, height } = await getImageDimensions(f);
              if (width < MIN_PORTADA_WIDTH || height < MIN_PORTADA_HEIGHT) {
                toast.error(
                  `La imagen principal debe ser mayor a ${MIN_PORTADA_WIDTH}×${MIN_PORTADA_HEIGHT} px. Esta imagen tiene ${width}×${height} px.`
                );
                continue;
              }
            } catch {
              toast.error(`${f.name}: no se pudo verificar el tamaño de la imagen`);
              continue;
            }
          }
          const { idRecurso, url } = await uploadOne(f, "propiedades", cp);
          added.push({
            idRecurso,
            url,
            esPortada: willBePortada,
          });
          if (willBePortada) portadaSetInBatch = true;
        }
        if (added.length) {
          const next = [...images, ...added];
          onImagesChange(next);
          toast.success(added.length === 1 ? "Imagen subida" : `${added.length} imágenes subidas`);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error al subir");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [images, maxImages, onImagesChange, ensureCreadoPor]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploading || images.length >= maxImages) return;
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemoveImage = async (index: number) => {
    const removed = images[index];
    if (!removed?.idRecurso) {
      let next = images.filter((_, i) => i !== index);
      if (removed?.esPortada && next.length > 0) {
        next = next.map((im, i) => ({ ...im, esPortada: i === 0 }));
      }
      onImagesChange(next);
      return;
    }
    setRemovingId(removed.idRecurso);
    try {
      const res = await fetch(`/api/recursos/${removed.idRecurso}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Error al eliminar la imagen");
      }
      let next = images.filter((_, i) => i !== index);
      if (removed?.esPortada && next.length > 0) {
        next = next.map((im, i) => ({ ...im, esPortada: i === 0 }));
      }
      onImagesChange(next);
      toast.success("Imagen eliminada.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar la imagen");
    } finally {
      setRemovingId(null);
    }
  };

  const handleSetPrincipal = async (index: number) => {
    const candidate = images[index];
    if (!candidate?.url) return;
    try {
      const { width, height } = await getImageDimensionsFromUrl(candidate.url);
      if (width < MIN_PORTADA_WIDTH || height < MIN_PORTADA_HEIGHT) {
        toast.error(
          `La imagen principal debe ser mayor a ${MIN_PORTADA_WIDTH}×${MIN_PORTADA_HEIGHT} px. Esta imagen tiene ${width}×${height} px.`
        );
        return;
      }
    } catch {
      toast.error("No se pudo verificar el tamaño de la imagen.");
      return;
    }
    const next = images.map((im, i) => ({
      ...im,
      esPortada: i === index,
    }));
    onImagesChange(next);
    toast.success("Imagen principal actualizada");
  };

  const canAdd = images.length < maxImages && !uploading;

  return (
    <div className="tp-dashboard-new-property mb-50">
      <h5 className="tp-dashboard-new-title">Imágenes del Edificio</h5>

      <div className="tp-dashboard-new-um">
        <div
          className="tp-dashboard-new-um-content"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            opacity: canAdd ? 1 : 0.6,
            pointerEvents: canAdd ? "auto" : "none",
          }}
        >
          <input
            ref={fileInputRef}
            id="tp-dashboard-new-um-file-input"
            type="file"
            accept={ACCEPT}
            multiple
            onChange={handleInputChange}
            disabled={!canAdd}
            style={{ display: "none" }}
          />
          <span className="upload-btn">
            <label htmlFor="tp-dashboard-new-um-file-input">
              {uploading ? (
                <>
                  <i className="fa-light fa-spinner fa-spin" style={{ marginRight: "6px" }}></i>
                  Subiendo…
                </>
              ) : (
                "Agregar imagen"
              )}
            </label>
          </span>
          <p>
            o arrastra fotos aquí <br />
            (Hasta {maxImages} fotos)
          </p>
          <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--tp-text-3)" }}>
            La imagen principal debe ser mayor a {MIN_PORTADA_WIDTH}×{MIN_PORTADA_HEIGHT} px.
          </p>
        </div>

        {images.length > 0 && (
          <div
            className="tp-dashboard-new-um-img-box d-flex"
            style={{ marginTop: "20px", flexWrap: "wrap", gap: "15px" }}
          >
            {images.map((img, index) => (
              <div
                key={img.idRecurso}
                className="tp-dashboard-new-um-img"
                style={{ position: "relative" }}
              >
                <Image
                  src={img.url}
                  alt={img.esPortada ? "Imagen principal" : `imagen ${index + 1}`}
                  width={194}
                  height={109}
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                  unoptimized
                />
                {img.esPortada && (
                  <span
                    style={{
                      position: "absolute",
                      top: "6px",
                      left: "6px",
                      background: "var(--tp-theme-primary)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    Principal
                  </span>
                )}
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  {!img.esPortada && (
                    <button
                      type="button"
                      onClick={() => handleSetPrincipal(index)}
                      title="Establecer como imagen principal"
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
                      <i className="fa-regular fa-star" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    title="Eliminar imagen"
                    disabled={removingId === img.idRecurso}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "none",
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      cursor: removingId === img.idRecurso ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {removingId === img.idRecurso ? (
                      <i className="fa-light fa-spinner fa-spin" style={{ color: "#ff6b6b" }} />
                    ) : (
                      <i className="fal fa-trash-alt" style={{ color: "#ff6b6b" }} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
