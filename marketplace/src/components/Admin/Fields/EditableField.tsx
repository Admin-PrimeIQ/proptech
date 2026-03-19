"use client";
import React from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import IconButton from "../UI/IconButton";
import styles from "../admin-styles.module.scss";

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel?: () => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  disabled?: boolean;
  originalValue?: string; // Valor original para comparar cambios
  showEditButton?: boolean; // Mostrar botón de editar individual
  showSaveButton?: boolean; // Mostrar botón de guardar individual
}

export default function EditableField({
  label,
  value,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  placeholder,
  type = "text",
  disabled = false,
  originalValue,
  showEditButton = true,
  showSaveButton = true,
}: EditableFieldProps) {
  const hasChanges = originalValue !== undefined ? value !== originalValue : false;

  if (isEditing) {
    return (
      <div className="d-flex align-items-center gap-3">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-grow-1"
          disabled={disabled}
        />
        {showSaveButton && (
          <>
            <Button onClick={onSave} disabled={disabled || !hasChanges}>
              Guardar
            </Button>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} disabled={disabled}>
                Cancelar
              </Button>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.fieldContainer}>
      <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "8px" }}>
        <label className={styles.fieldLabel}>
          {label}
        </label>
        {showEditButton && (
          <IconButton icon={<i className="fa-light fa-edit"></i>} onClick={onEdit}>
            Editar
          </IconButton>
        )}
      </div>
      <div className={styles.fieldValue}>
        {value || <span style={{ color: "var(--tp-text-body)" }}>Sin definir</span>}
      </div>
    </div>
  );
}
