"use client";
import React from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import IconButton from "../UI/IconButton";
import styles from "../admin-styles.module.scss";

interface EditableInfoLinksProps {
  links: string[];
  onChange: (links: string[]) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel?: () => void;
  originalValue?: string[];
}

export default function EditableInfoLinks({
  links,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  originalValue,
}: EditableInfoLinksProps) {
  // Asegurar que links siempre sea un array
  const safeLinks = links || [];
  const safeOriginalValue = originalValue || [];

  // Comparar correctamente los cambios
  const hasChanges = (() => {
    if (safeLinks.length !== safeOriginalValue.length) return true;
    
    return safeLinks.some((link, index) => {
      const original = safeOriginalValue[index];
      return (link || "") !== (original || "");
    });
  })();

  const handleAddLink = () => {
    onChange([...safeLinks, ""]);
  };

  const handleRemoveLink = (index: number) => {
    onChange(safeLinks.filter((_, i) => i !== index));
  };

  const handleTextChange = (index: number, value: string) => {
    const newLinks = [...safeLinks];
    newLinks[index] = value;
    onChange(newLinks);
  };

  if (isEditing) {
    return (
      <div>
        {safeLinks.map((text, index) => (
          <div key={index} style={{ marginBottom: "12px", padding: "12px", border: "1px solid var(--tp-border-secondary)", borderRadius: "6px", background: "var(--tp-common-white)" }}>
            <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "12px" }}>
              <strong style={{ color: "var(--tp-heading-primary)" }}>Elemento {index + 1}</strong>
              {safeLinks.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveLink(index)}
                >
                  Eliminar
                </Button>
              )}
            </div>
            <div>
              <Input
                label="Texto"
                type="text"
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                placeholder="Ej: Sobre nosotros"
              />
            </div>
          </div>
        ))}
        <div className="d-flex align-items-center gap-3" style={{ marginTop: "16px" }}>
          <Button variant="secondary" onClick={handleAddLink}>
            Agregar Elemento
          </Button>
        </div>
        <div className="d-flex align-items-center gap-3" style={{ marginTop: "16px" }}>
          <Button onClick={onSave} disabled={!hasChanges}>
            Guardar
          </Button>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.infoLinksContainer}>
      {safeLinks.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          {safeLinks.map((text, index) => (
            <li key={index} className={styles.infoLinkItem}>
              {text || `Elemento ${index + 1}`}
            </li>
          ))}
        </ul>
      ) : (
        <span style={{ color: "var(--tp-text-body)" }}>Sin elementos definidos</span>
      )}
    </div>
  );
}
