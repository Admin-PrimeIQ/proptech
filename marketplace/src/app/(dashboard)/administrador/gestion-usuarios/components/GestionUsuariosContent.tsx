"use client";

import { useState, useEffect, useCallback } from "react";
import AdminPageHeader from "@/components/Admin/Layout/AdminPageHeader";
import NiceSelect from "@/components/UI/NiceSelect";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type UsuarioItem = {
  idPublic: string;
  correo: string;
  nombreCompleto: string | null;
  activo: boolean;
  fechaCreacion: string;
  roles: string[];
};

const ROL_OPTIONS = [
  { value: "", label: "Todos los roles" },
  { value: "VENDEDOR", label: "Vendedor" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export default function GestionUsuariosContent() {
  const { data: session } = useSession();
  const isSuperAdmin = (session?.user?.roles ?? []).includes("SUPER_ADMIN");

  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("");
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formCorreo, setFormCorreo] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formNombreCompleto, setFormNombreCompleto] = useState("");
  const [formRol, setFormRol] = useState<"ADMIN" | "SUPER_ADMIN">("SUPER_ADMIN");
  const [submitting, setSubmitting] = useState(false);

  const ROL_CREAR_OPTIONS = [
    { value: "ADMIN", label: "Admin" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
  ];

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUsuario, setEditUsuario] = useState<UsuarioItem | null>(null);
  const [editNombreCompleto, setEditNombreCompleto] = useState("");
  const [editCorreo, setEditCorreo] = useState("");
  const [editActivo, setEditActivo] = useState(true);
  const [editAccesoHome, setEditAccesoHome] = useState(false);
  const [editAccesoGeneral, setEditAccesoGeneral] = useState(false);
  const [editAccesoPropiedades, setEditAccesoPropiedades] = useState(false);
  const [editAccesoConfiguracionPerfil, setEditAccesoConfiguracionPerfil] = useState(false);
  const [editPermisosLoading, setEditPermisosLoading] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState<string | null>(null);

  const fetchUsuarios = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (nombre.trim()) params.set("nombre", nombre.trim());
    if (rol) params.set("rol", rol);
    fetch(`/api/usuarios?${params}`)
      .then((r) => r.json())
      .then((res: { data?: UsuarioItem[] } | UsuarioItem[]) => {
        const data = Array.isArray(res) ? res : (res as { data?: UsuarioItem[] })?.data;
        setUsuarios(Array.isArray(data) ? data : []);
      })
      .catch(() => setUsuarios([]))
      .finally(() => setLoading(false));
  }, [nombre, rol]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  const handleRolChange = (value: string) => {
    setRol(value);
  };

  const openModal = () => {
    setFormCorreo("");
    setFormPassword("");
    setFormNombreCompleto("");
    setFormRol("SUPER_ADMIN");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleCrearAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = formCorreo.trim().toLowerCase();
    if (!email) {
      toast.error("El correo es obligatorio.");
      return;
    }
    if (formPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: email,
          password: formPassword,
          nombreCompleto: formNombreCompleto.trim() || undefined,
          rol: formRol,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Error al crear el usuario.");
        return;
      }
      toast.success(formRol === "SUPER_ADMIN" ? "Usuario Super Admin creado correctamente." : "Usuario Admin creado correctamente.");
      closeModal();
      fetchUsuarios();
    } catch {
      toast.error("Error al crear el usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (u: UsuarioItem) => {
    setEditUsuario(u);
    setEditNombreCompleto(u.nombreCompleto ?? "");
    setEditCorreo(u.correo);
    setEditActivo(u.activo);
    setEditAccesoHome(false);
    setEditAccesoGeneral(false);
    setEditAccesoPropiedades(false);
    setEditAccesoConfiguracionPerfil(false);
    setEditModalOpen(true);
    if (isSuperAdmin) {
      setEditPermisosLoading(true);
      fetch(`/api/usuarios/${u.idPublic}`)
        .then((r) => r.json())
        .then((res: { permisos?: { accesoHome?: boolean; accesoGeneral?: boolean; accesoPropiedades?: boolean; accesoConfiguracionPerfil?: boolean } }) => {
          const perm = res?.permisos;
          if (perm && typeof perm === "object") {
            setEditAccesoHome(!!perm.accesoHome);
            setEditAccesoGeneral(!!perm.accesoGeneral);
            setEditAccesoPropiedades(!!perm.accesoPropiedades);
            setEditAccesoConfiguracionPerfil(!!perm.accesoConfiguracionPerfil);
          }
        })
        .catch(() => {})
        .finally(() => setEditPermisosLoading(false));
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditUsuario(null);
  };

  const handleEditarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUsuario) return;
    const email = editCorreo.trim().toLowerCase();
    if (!email) {
      toast.error("El correo es obligatorio.");
      return;
    }
    setEditSubmitting(true);
    try {
      const body: {
        nombreCompleto: string | null;
        correo: string;
        activo: boolean;
        permisos?: { accesoHome: boolean; accesoGeneral: boolean; accesoPropiedades: boolean; accesoConfiguracionPerfil: boolean };
      } = {
        nombreCompleto: editNombreCompleto.trim() || null,
        correo: email,
        activo: editActivo,
      };
      if (isSuperAdmin) {
        body.permisos = {
          accesoHome: editAccesoHome,
          accesoGeneral: editAccesoGeneral,
          accesoPropiedades: editAccesoPropiedades,
          accesoConfiguracionPerfil: editAccesoConfiguracionPerfil,
        };
      }
      const res = await fetch(`/api/usuarios/${editUsuario.idPublic}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Error al actualizar el usuario.");
        return;
      }
      toast.success("Usuario actualizado correctamente.");
      closeEditModal();
      fetchUsuarios();
    } catch {
      toast.error("Error al actualizar el usuario.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleEliminarUsuario = async (u: UsuarioItem) => {
    const mensaje =
      "Si elimina este usuario ya no podrá recuperarse. ¿Está seguro de que desea continuar?";
    if (!window.confirm(mensaje)) return;
    setDeleteSubmitting(u.idPublic);
    try {
      const res = await fetch(`/api/usuarios/${u.idPublic}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Error al eliminar el usuario.");
        return;
      }
      toast.success("Usuario eliminado correctamente.");
      fetchUsuarios();
    } catch {
      toast.error("Error al eliminar el usuario.");
    } finally {
      setDeleteSubmitting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-GT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="tp-dashboard-profile-wrapper">
      <AdminPageHeader
        title="Gestión de usuarios"
        subtitle="Consulta usuarios y roles del sistema. Filtra por nombre o rol."
      />

      <div className="tp-dashboard-new-property mb-50">
        <div className="tp-dashboard-property-top d-flex flex-wrap align-items-center gap-3 mb-30">
          <div className="tp-dashboard-property-search" style={{ minWidth: 200, maxWidth: 320 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o correo"
              value={nombre}
              onChange={handleNombreChange}
              aria-label="Buscar por nombre o correo"
            />
          </div>
          <div className="tp-property-tabs-select tp-select" style={{ minWidth: 180 }}>
            <NiceSelect
              key={`rol-${rol}`}
              options={ROL_OPTIONS}
              defaultCurrent={Math.max(0, ROL_OPTIONS.findIndex((o) => o.value === rol))}
              onChange={(item) => handleRolChange(item.value)}
              name="Rol"
            />
          </div>
          {isSuperAdmin && (
            <button
              type="button"
              className="tp-btn tp-btn-border"
              onClick={openModal}
            >
              Crear admin/super-admin
            </button>
          )}
        </div>

        <div className="tp-dashboard-property-wrapper">
          {loading ? (
            <p className="text-muted">Cargando usuarios...</p>
          ) : usuarios.length === 0 ? (
            <p className="text-muted">No hay usuarios que coincidan con los filtros.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Roles</th>
                    <th scope="col">Activo</th>
                    <th scope="col">Fecha de creación</th>
                    {isSuperAdmin && <th scope="col">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.idPublic}>
                      <td>{u.nombreCompleto ?? "—"}</td>
                      <td>{u.correo}</td>
                      <td>
                        <span className="d-flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span
                              key={r}
                              className="badge bg-secondary"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {r}
                            </span>
                          ))}
                        </span>
                      </td>
                      <td>
                        {u.activo ? (
                          <span className="badge bg-success">Sí</span>
                        ) : (
                          <span className="badge bg-danger">No</span>
                        )}
                      </td>
                      <td>{formatDate(u.fechaCreacion)}</td>
                      {isSuperAdmin && (
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              type="button"
                              className="tp-btn tp-btn-border btn-sm"
                              onClick={() => openEditModal(u)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="tp-btn btn-sm"
                              style={{ backgroundColor: "#dc3545", borderColor: "#dc3545", color: "#fff" }}
                              onClick={() => handleEliminarUsuario(u)}
                              disabled={deleteSubmitting === u.idPublic}
                            >
                              {deleteSubmitting === u.idPublic ? "Eliminando…" : "Eliminar"}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            className="modal fade show"
            style={{ display: "block" }}
            id="modalCrearAdmin"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear admin/super-admin</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Cerrar"
                  />
                </div>
                <form onSubmit={handleCrearAdmin}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Rol a asignar</label>
                      <div className="tp-property-tabs-select tp-select" style={{ minWidth: "100%" }}>
                        <NiceSelect
                          key={`crear-rol-${formRol}-${modalOpen}`}
                          options={ROL_CREAR_OPTIONS}
                          defaultCurrent={formRol === "SUPER_ADMIN" ? 1 : 0}
                          onChange={(item) => setFormRol((item.value as "ADMIN" | "SUPER_ADMIN") || "ADMIN")}
                          name="Rol crear"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="crear-admin-correo" className="form-label">
                        Correo electrónico <span className="text-danger">*</span>
                      </label>
                      <input
                        id="crear-admin-correo"
                        type="email"
                        className="form-control"
                        value={formCorreo}
                        onChange={(e) => setFormCorreo(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="crear-admin-password" className="form-label">
                        Contraseña <span className="text-danger">*</span>
                      </label>
                      <input
                        id="crear-admin-password"
                        type="password"
                        className="form-control"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="crear-admin-nombre" className="form-label">
                        Nombre completo
                      </label>
                      <input
                        id="crear-admin-nombre"
                        type="text"
                        className="form-control"
                        value={formNombreCompleto}
                        onChange={(e) => setFormNombreCompleto(e.target.value)}
                        placeholder="Nombre completo"
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="tp-btn tp-btn-border"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="tp-btn"
                      disabled={submitting}
                    >
                      {submitting ? "Creando…" : formRol === "SUPER_ADMIN" ? "Crear super admin" : "Crear admin"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {editModalOpen && editUsuario && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={closeEditModal}
            aria-hidden="true"
          />
          <div
            className="modal fade show"
            style={{ display: "block" }}
            id="modalEditarUsuario"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar usuario</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeEditModal}
                    aria-label="Cerrar"
                  />
                </div>
                <form onSubmit={handleEditarUsuario}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="edit-usuario-nombre" className="form-label">
                        Nombre completo
                      </label>
                      <input
                        id="edit-usuario-nombre"
                        type="text"
                        className="form-control"
                        value={editNombreCompleto}
                        onChange={(e) => setEditNombreCompleto(e.target.value)}
                        placeholder="Nombre completo"
                        autoComplete="name"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-usuario-correo" className="form-label">
                        Correo electrónico <span className="text-danger">*</span>
                      </label>
                      <input
                        id="edit-usuario-correo"
                        type="email"
                        className="form-control"
                        value={editCorreo}
                        onChange={(e) => setEditCorreo(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          id="edit-usuario-activo"
                          type="checkbox"
                          className="form-check-input"
                          checked={editActivo}
                          onChange={(e) => setEditActivo(e.target.checked)}
                        />
                        <label htmlFor="edit-usuario-activo" className="form-check-label">
                          Usuario activo
                        </label>
                      </div>
                    </div>
                    {isSuperAdmin && (
                      <div className="mb-3 pt-3 border-top">
                        <h6 className="mb-2">Permisos de acceso al panel</h6>
                        {editPermisosLoading ? (
                          <p className="text-muted small">Cargando permisos...</p>
                        ) : (
                          <>
                            <div className="form-check mb-2">
                              <input
                                id="edit-permiso-home"
                                type="checkbox"
                                className="form-check-input"
                                checked={editAccesoHome}
                                onChange={(e) => setEditAccesoHome(e.target.checked)}
                              />
                              <label htmlFor="edit-permiso-home" className="form-check-label">
                                Acceso a Inicio (Dashboard)
                              </label>
                            </div>
                            <div className="form-check mb-2">
                              <input
                                id="edit-permiso-general"
                                type="checkbox"
                                className="form-check-input"
                                checked={editAccesoGeneral}
                                onChange={(e) => setEditAccesoGeneral(e.target.checked)}
                              />
                              <label htmlFor="edit-permiso-general" className="form-check-label">
                                Acceso a Configuración de página
                              </label>
                            </div>
                            <div className="form-check mb-2">
                              <input
                                id="edit-permiso-propiedades"
                                type="checkbox"
                                className="form-check-input"
                                checked={editAccesoPropiedades}
                                onChange={(e) => setEditAccesoPropiedades(e.target.checked)}
                              />
                              <label htmlFor="edit-permiso-propiedades" className="form-check-label">
                                Acceso a Configuración de propiedades
                              </label>
                            </div>
                            <div className="form-check mb-2">
                              <input
                                id="edit-permiso-gestion"
                                type="checkbox"
                                className="form-check-input"
                                checked={editAccesoConfiguracionPerfil}
                                onChange={(e) => setEditAccesoConfiguracionPerfil(e.target.checked)}
                              />
                              <label htmlFor="edit-permiso-gestion" className="form-check-label">
                                Acceso a Gestión de usuarios
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="tp-btn tp-btn-border"
                      onClick={closeEditModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="tp-btn"
                      disabled={editSubmitting}
                    >
                      {editSubmitting ? "Guardando…" : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
