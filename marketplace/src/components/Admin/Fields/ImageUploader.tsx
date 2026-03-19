"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploaderProps {
  label: string;
  currentImageUrl?: string | null;
  onUploadComplete: (idRecurso: string, url: string) => void;
  folder?: string;
  tipoRecurso?: string;
  textoAlternativo?: string;
  width?: number;
  height?: number;
  accept?: string;
  disabled?: boolean;
  className?: string;
  recursoId?: string; // ID del recurso a actualizar (si se proporciona, actualiza en lugar de crear)
  /** Si true, sin imagen previa se muestra solo el ícono de cámara (no el logo). */
  placeholderIconOnly?: boolean;
  /** Si true junto con placeholderIconOnly, sin imagen se muestra ícono de usuario en lugar de cámara. */
  placeholderUserIcon?: boolean;
  /** Mínimo ancho (ej. hero: 1920). Si se define con minHeight, se valida y se advierte si la imagen es menor. */
  minWidth?: number;
  /** Mínimo alto (ej. hero: 940). Si se define con minWidth, se valida y se advierte si la imagen es menor. */
  minHeight?: number;
  /** Si se pasa, se usa como creadoPor en POST /api/upload en lugar de /api/users. */
  creadoPorIdPublic?: string;
  /** Si se pasa, se muestra un botón visible con este texto que abre el selector de archivo (ej. "Subir imagen"). */
  uploadButtonLabel?: string;
  previewFit?: "contain" | "cover";
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    img.src = url;
  });
}

export default function ImageUploader({
  label,
  currentImageUrl,
  onUploadComplete,
  folder = "uploads",
  tipoRecurso = "IMAGEN",
  textoAlternativo,
  width = 150,
  height = 60,
  accept = "image/png, image/jpeg, image/jpg",
  disabled = false,
  className = "",
  recursoId,
  placeholderIconOnly = false,
  placeholderUserIcon = false,
  minWidth,
  minHeight,
  creadoPorIdPublic,
  uploadButtonLabel,
  previewFit = "contain",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Actualizar preview cuando cambia currentImageUrl
  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande. Máximo 5MB");
      return;
    }

    // Validar dimensiones mínimas (ej. hero) si se especifican: bloquear subida si es menor
    if (typeof minWidth === "number" && typeof minHeight === "number") {
      try {
        const { width: w, height: h } = await getImageDimensions(file);
        if (w < minWidth || h < minHeight) {
          toast.error(
            `La imagen debe tener al menos ${minWidth}×${minHeight} px. La seleccionada es ${w}×${h} px y no se subirá.`
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
      } catch {
        toast.error("No se pudo verificar las dimensiones de la imagen.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
    }

    // Mostrar preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir a S3
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipoRecurso", tipoRecurso);
      formData.append("folder", folder);
      if (textoAlternativo) {
        formData.append("textoAlternativo", textoAlternativo);
      }

      let creadoPor: string;
      if (creadoPorIdPublic) {
        creadoPor = creadoPorIdPublic;
      } else {
        const userResponse = await fetch("/api/users");
        creadoPor = "system";
        if (userResponse.ok) {
          const userData = await userResponse.json();
          creadoPor = userData.idPublic || "system";
        }
      }
      formData.append("creadoPor", creadoPor);

      // Si hay recursoId, actualizar el recurso existente; si no, crear uno nuevo
      const endpoint = recursoId ? `/api/recursos/${recursoId}` : "/api/upload";
      const method = recursoId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al subir la imagen");
      }

      const data = await response.json();
      
      // Llamar al callback con el ID del recurso y la URL
      const finalId = recursoId || data.idRecurso;
      onUploadComplete(finalId, data.url);
      
      toast.success(recursoId ? "Imagen actualizada correctamente" : "Imagen subida correctamente");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Error al subir la imagen");
      setPreview(currentImageUrl || null); // Revertir preview
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className} style={{ marginBottom: "20px" }}>
      {label ? (
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "var(--tp-heading-primary)",
          }}
        >
          {label}
        </label>
      ) : null}
      <div className="tp-dashboard-profile-top" style={{ paddingBottom: "12px" }}>
        <div className="tp-dashboard-profile-left d-flex align-items-center">
          <div className="tp-dashboard-profile-thumb" style={{ position: "relative" }}>
            {preview ? (
              <img
                src={preview}
                alt={textoAlternativo || label}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  objectFit: previewFit,
                }}
              />
            ) : placeholderIconOnly ? (
              <div
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed var(--tp-border-secondary, #dee2e6)",
                  borderRadius: "50%",
                  background: "var(--tp-border-secondary, #e9ecef)",
                  color: "var(--tp-heading-primary, #2d373c)",
                }}
              >
                <i
                  className={placeholderUserIcon ? "fa-light fa-user" : "fa-light fa-camera"}
                  style={{ fontSize: placeholderUserIcon ? Math.min(width, height) * 0.45 : "32px" }}
                />
              </div>
            ) : (
              <Image
                src="/assets/img/logo/logo-black.png"
                alt="placeholder"
                width={width}
                height={height}
                style={{ objectFit: previewFit }}
              />
            )}
            {!disabled && (
              <div className="tp-dashboard-profile-thumb-edit">
                <input
                  ref={fileInputRef}
                  id={`image-upload-${label.replace(/\s/g, "-").toLowerCase()}`}
                  className="profile-img-popup"
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <label
                  htmlFor={`image-upload-${label.replace(/\s/g, "-").toLowerCase()}`}
                >
                  {uploading ? (
                    <i className="fa-light fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa-light fa-camera"></i>
                  )}
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
      {uploading && (
        <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          Subiendo imagen...
        </p>
      )}
      {uploadButtonLabel && !disabled && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            marginTop: "8px",
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
            color: "var(--tp-common-white)",
            background: "var(--tp-theme-primary, #5758D6)",
            border: "none",
            borderRadius: "6px",
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.7 : 1,
          }}
        >
          {uploading ? "Subiendo..." : uploadButtonLabel}
        </button>
      )}
    </div>
  );
}
