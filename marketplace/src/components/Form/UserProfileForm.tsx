"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClosedEyeSvg, OpenEyeSvg } from "../SVG";
import { toast } from "sonner";

export type ProfileData = {
  nombreCompleto: string;
  correo: string;
  telefono: string;
};

type UserProfileFormProps = {
  initialProfile?: ProfileData | null;
};

export default function UserProfileForm({ initialProfile }: UserProfileFormProps) {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [editingInfo, setEditingInfo] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (initialProfile) {
      setNombreCompleto(initialProfile.nombreCompleto);
      setCorreo(initialProfile.correo);
      setTelefono(initialProfile.telefono);
    }
  }, [initialProfile]);

  const handleSaveInfo = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCompleto: nombreCompleto.trim() || null,
          correo: correo.trim(),
          telefono: telefono.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Error al guardar");
      }
      toast.success("Información actualizada correctamente");
      setEditingInfo(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleSavePassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (newPasswordVal !== confirmPassword) {
      toast.error("La nueva contraseña y la confirmación no coinciden");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          newPassword: newPasswordVal.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Error al cambiar contraseña");
      }
      toast.success("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPasswordVal("");
      setConfirmPassword("");
      setEditingPassword(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cambiar contraseña");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <form>
        <div className="tp-dashboard-profile-information pb-50">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h5 className="tp-dashboard-new-title mb-0">Información</h5>
            {!editingInfo ? (
              <button
                type="button"
                className="tp-dashboard-new-btn"
                onClick={() => setEditingInfo(true)}
                style={{ padding: "8px 20px", fontSize: "14px" }}
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                className="tp-dashboard-new-btn"
                onClick={handleSaveInfo}
                disabled={savingInfo}
                style={{ padding: "8px 20px", fontSize: "14px" }}
              >
                {savingInfo ? "Guardando..." : "Guardar"}
              </button>
            )}
          </div>
          <div className="tp-dashboard-profile-info">
            <div className="row">
              <div className="col-lg-12">
                <div className="tp-dashboard-new-input">
                  <label>Nombre completo:* </label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    disabled={!editingInfo}
                    readOnly={!editingInfo}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="tp-dashboard-new-input">
                  <label>Correo:* </label>
                  <input
                    type="text"
                    placeholder="Ingrese su correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={!editingInfo}
                    readOnly={!editingInfo}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="tp-dashboard-new-input">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    placeholder="Ingrese su número"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    disabled={!editingInfo}
                    readOnly={!editingInfo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tp-dashboard-profile-information mb-40">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h5 className="tp-dashboard-new-title mb-0">Cambiar contraseña</h5>
            {!editingPassword ? (
              <button
                type="button"
                className="tp-dashboard-new-btn"
                onClick={() => setEditingPassword(true)}
                style={{ padding: "8px 20px", fontSize: "14px" }}
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                className="tp-dashboard-new-btn"
                onClick={handleSavePassword}
                disabled={savingPassword}
                style={{ padding: "8px 20px", fontSize: "14px" }}
              >
                {savingPassword ? "Guardando..." : "Guardar"}
              </button>
            )}
          </div>

          <div className="tp-dashboard-profile-info">
            {!editingPassword ? (
              <div className="tp-dashboard-new-input">
                <label>Contraseña actual: </label>
                <div
                  className="tp-sign-in-input p-relative"
                  style={{
                    padding: "10px 14px",
                    background: "var(--tp-common-white)",
                    border: "1px solid var(--tp-border-secondary, #dee2e6)",
                    borderRadius: "4px",
                    color: "var(--tp-heading-primary, #2d373c)",
                    fontSize: "14px",
                  }}
                >
                  ••••••••
                </div>
                <p style={{ fontSize: "13px", color: "#666", marginTop: "6px" }}>
                  Haz clic en Editar para cambiar tu contraseña.
                </p>
              </div>
            ) : (
            <div className="row">
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <label>Contraseña actual:* </label>
                  <div className="tp-sign-in-input p-relative">
                    <div className="password-input p-relative">
                      <input
                        type={oldPassword ? "text" : "password"}
                        placeholder="Contraseña actual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        disabled={!editingPassword}
                      />
                      <div
                        className="tp-sign-in-input-eye password-show-toggle"
                        onClick={() => setOldPassword((prev) => !prev)}
                      >
                        <span
                          className="open-eye open-eye-icon"
                          style={{ display: oldPassword ? "block" : "none" }}
                        >
                          <OpenEyeSvg />
                        </span>
                        <span
                          className="open-close close-eye-icon"
                          style={{ display: oldPassword ? "none" : "block" }}
                        >
                          <ClosedEyeSvg />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <label>Nueva contraseña:* </label>
                  <div className="tp-sign-in-input p-relative">
                    <div className="password-input p-relative">
                      <input
                        type={newPassword ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        value={newPasswordVal}
                        onChange={(e) => setNewPasswordVal(e.target.value)}
                        disabled={!editingPassword}
                      />
                      <div
                        className="tp-sign-in-input-eye password-show-toggle"
                        onClick={() => setNewPassword((prev) => !prev)}
                      >
                        <span
                          className="open-eye open-eye-icon"
                          style={{ display: newPassword ? "block" : "none" }}
                        >
                          <OpenEyeSvg />
                        </span>
                        <span
                          className="open-close close-eye-icon"
                          style={{ display: newPassword ? "none" : "block" }}
                        >
                          <ClosedEyeSvg />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="tp-dashboard-new-input">
                  <label>Confirmar nueva contraseña:* </label>
                  <div className="tp-sign-in-input p-relative">
                    <div className="password-input p-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar nueva contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={!editingPassword}
                      />
                      <div
                        className="tp-sign-in-input-eye password-show-toggle"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        <span
                          className="open-eye open-eye-icon"
                          style={{ display: showConfirmPassword ? "block" : "none" }}
                        >
                          <OpenEyeSvg />
                        </span>
                        <span
                          className="open-close close-eye-icon"
                          style={{ display: showConfirmPassword ? "none" : "block" }}
                        >
                          <ClosedEyeSvg />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
