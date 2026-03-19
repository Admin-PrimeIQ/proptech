"use client";
import React from "react";
import IconButton from "../UI/IconButton";
import styles from "../admin-styles.module.scss";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  isEditing?: boolean;
  onEditToggle?: () => void;
  /** Si es false, no se muestra el botón Editar. Por defecto true. */
  showEditButton?: boolean;
  /** Al hacer clic en Guardar (solo se muestra si isEditing y está definido). */
  onSave?: () => void;
  /** Al hacer clic en Cancelar (solo se muestra si isEditing y está definido). */
  onCancel?: () => void;
  /** Muestra spinner en el botón Guardar. */
  saving?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  isEditing = false,
  onEditToggle,
  showEditButton = true,
  onSave,
  onCancel,
  saving = false,
}: SectionHeaderProps) {
  const showEdit = showEditButton && !isEditing && typeof onEditToggle === "function";
  const showSaveCancel = isEditing && (typeof onSave === "function" || typeof onCancel === "function");

  return (
    <div className={styles.sectionHeader}>
      <div>
        <h5 className={styles.sectionTitle}>{title}</h5>
        {subtitle && <p className="text-muted mb-0" style={{ fontSize: "14px", marginTop: "4px" }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {showEdit && (
          <IconButton icon={<i className="fa-light fa-edit"></i>} onClick={onEditToggle!}>
            Editar
          </IconButton>
        )}
        {showSaveCancel && (
          <>
            {typeof onCancel === "function" && (
              <IconButton
                icon={<i className="fa-light fa-times"></i>}
                onClick={onCancel}
                disabled={saving}
              >
                Cancelar
              </IconButton>
            )}
            {typeof onSave === "function" && (
              <IconButton
                icon={saving ? <i className="fa-light fa-spinner fa-spin"></i> : <i className="fa-light fa-check"></i>}
                onClick={onSave}
                disabled={saving}
              >
                {saving ? "Guardando…" : "Guardar"}
              </IconButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}
