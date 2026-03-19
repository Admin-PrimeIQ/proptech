"use client";
import React from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import IconButton from "../UI/IconButton";
import styles from "../admin-styles.module.scss";

interface SocialLink {
  facebook: string;
  instagram: string;
  whatsapp: string;
  twitter: string;
}

interface EditableSocialLinksProps {
  socialLinks: SocialLink;
  onChange: (links: SocialLink) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel?: () => void;
  originalValue?: SocialLink;
}

const DEFAULT_SOCIAL_LINKS: SocialLink = {
  facebook: "",
  instagram: "",
  whatsapp: "",
  twitter: "",
};

export default function EditableSocialLinks({
  socialLinks,
  onChange,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  originalValue,
}: EditableSocialLinksProps) {
  // Asegurar que socialLinks siempre tenga un valor
  const safeSocialLinks = socialLinks || DEFAULT_SOCIAL_LINKS;
  const safeOriginalValue = originalValue || DEFAULT_SOCIAL_LINKS;

  // Comparar correctamente los cambios
  const getNormalizedLinks = (links: SocialLink | undefined) => ({
    facebook: links?.facebook || "",
    instagram: links?.instagram || "",
    whatsapp: links?.whatsapp || "",
    twitter: links?.twitter || "",
  });

  const normalizedCurrent = getNormalizedLinks(safeSocialLinks);
  const normalizedOriginal = getNormalizedLinks(safeOriginalValue);
  
  const hasChanges = 
    normalizedCurrent.facebook !== normalizedOriginal.facebook ||
    normalizedCurrent.instagram !== normalizedOriginal.instagram ||
    normalizedCurrent.whatsapp !== normalizedOriginal.whatsapp ||
    normalizedCurrent.twitter !== normalizedOriginal.twitter;

  if (isEditing) {
    return (
      <div>
        <div style={{ marginBottom: "12px" }}>
          <Input
            label="Facebook"
            type="text"
            value={safeSocialLinks.facebook || ""}
            onChange={(e) => onChange({ ...safeSocialLinks, facebook: e.target.value })}
            placeholder="https://www.facebook.com/..."
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <Input
            label="Instagram"
            type="text"
            value={safeSocialLinks.instagram || ""}
            onChange={(e) => onChange({ ...safeSocialLinks, instagram: e.target.value })}
            placeholder="https://www.instagram.com/..."
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <Input
            label="WhatsApp"
            type="tel"
            value={safeSocialLinks.whatsapp || ""}
            onChange={(e) => onChange({ ...safeSocialLinks, whatsapp: e.target.value })}
            placeholder="Ej: +1234567890"
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <Input
            label="Twitter"
            type="text"
            value={safeSocialLinks.twitter || ""}
            onChange={(e) => onChange({ ...safeSocialLinks, twitter: e.target.value })}
            placeholder="https://twitter.com/..."
          />
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
    <div className={styles.socialLinksContainer}>
      <div className={styles.socialLinkItem}>
        <strong>Facebook:</strong>{" "}
        {safeSocialLinks.facebook || <span style={{ color: "var(--tp-text-body)" }}>Sin definir</span>}
      </div>
      <div className={styles.socialLinkItem}>
        <strong>Instagram:</strong>{" "}
        {safeSocialLinks.instagram || <span style={{ color: "var(--tp-text-body)" }}>Sin definir</span>}
      </div>
      <div className={styles.socialLinkItem}>
        <strong>WhatsApp:</strong>{" "}
        {safeSocialLinks.whatsapp || <span style={{ color: "var(--tp-text-body)" }}>Sin definir</span>}
      </div>
      <div>
        <strong>Twitter:</strong>{" "}
        {safeSocialLinks.twitter || <span style={{ color: "var(--tp-text-body)" }}>Sin definir</span>}
      </div>
    </div>
  );
}
