"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ImageUploader from "@/components/Admin/Fields/ImageUploader";
import UserAvatarPlaceholder from "@/components/UI/UserAvatarPlaceholder";
import { toast } from "sonner";

export type MyProfileHeaderProps = {
  userName: string;
  /** Número de solicitudes (solo para no admin). Null si es admin o no aplica. */
  solicitudesCount: number | null;
  isAdmin: boolean;
  /** idPublic del vendedor para actualizar foto de perfil (todos los roles). */
  vendedorIdPublic: string | null;
  /** URL de la foto actual del vendedor. */
  fotoUrl: string | null;
  /** ID público del usuario (para creadoPor en upload). */
  idUsuarioPublic: string | null;
};

export default function MyProfileHeader({
  userName,
  solicitudesCount,
  isAdmin,
  vendedorIdPublic,
  fotoUrl,
  idUsuarioPublic,
}: MyProfileHeaderProps) {
  const router = useRouter();

  const handlePhotoUploadComplete = async (idRecurso: string, _url: string) => {
    if (!vendedorIdPublic) return;
    try {
      const res = await fetch(`/api/vendedores/${vendedorIdPublic}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idFotoRecurso: idRecurso }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Error al actualizar la foto");
      }
      toast.success("Foto actualizada correctamente");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar la foto");
    }
  };

  return (
    <>
      <h5 className="tp-dashboard-new-title">Configuraciones de cuenta</h5>
      <div className="tp-dashboard-profile-top pb-60">
        <div className="tp-dashboard-profile-left d-flex align-items-center">
          {vendedorIdPublic && idUsuarioPublic ? (
            <div
              className="tp-dashboard-profile-photo-wrap"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <ImageUploader
                label=""
                currentImageUrl={fotoUrl}
                onUploadComplete={handlePhotoUploadComplete}
                folder="perfil"
                creadoPorIdPublic={idUsuarioPublic}
                width={120}
                height={120}
                placeholderIconOnly
                placeholderUserIcon
                className="mb-0"
              />
            </div>
          ) : (
            <div className="tp-dashboard-profile-thumb">
              <UserAvatarPlaceholder size={120} />
            </div>
          )}
          <div className="tp-dashboard-profile-inner">
            <h4>Bienvenido, {userName}</h4>
            {!isAdmin && solicitudesCount !== null && (
              <p>
                Tienes <span>{solicitudesCount}</span> solicitudes
              </p>
            )}
          </div>
        </div>
        <div className="tp-dashboard-profile-right">
          <div className="tp-dashboard-profile-btn">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="tp-dashboard-profile-btn-link"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
