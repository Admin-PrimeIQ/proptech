"use client";
import React from "react";
import Textarea from "../UI/Textarea";
import Button from "../UI/Button";
import IconButton from "../UI/IconButton";

interface EditableTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel?: () => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  showEditButton?: boolean;
  showSaveButton?: boolean;
  originalValue?: string;
}

export default function EditableTextarea({
  label,
  value,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  placeholder,
  rows = 4,
  disabled = false,
  showEditButton = true,
  showSaveButton = true,
  originalValue,
}: EditableTextareaProps) {
  const hasChanges = originalValue !== undefined ? value !== originalValue : false;
  if (isEditing) {
    return (
      <div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="flex-grow-1"
          disabled={disabled}
        />
        {showSaveButton && (
          <div className="d-flex align-items-center gap-3 mt-3">
            <Button onClick={onSave} disabled={disabled || (originalValue !== undefined && !hasChanges)}>
              Guardar
            </Button>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} disabled={disabled}>
                Cancelar
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {showEditButton && (
        <div className="d-flex align-items-center justify-content-between mb-2">
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            {label}
          </label>
          <IconButton icon={<i className="fa-light fa-edit"></i>} onClick={onEdit}>
            Editar
          </IconButton>
        </div>
      )}
      {!showEditButton && (
        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "var(--tp-heading-primary)" }}>
          {label}
        </label>
      )}
      <div style={{ padding: "12px", minHeight: "60px", border: "1px solid var(--tp-border-secondary)", borderRadius: "6px", background: "var(--tp-common-white)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {value || <span style={{ color: "var(--tp-text-body)" }}>Sin definir</span>}
      </div>
    </div>
  );
}
