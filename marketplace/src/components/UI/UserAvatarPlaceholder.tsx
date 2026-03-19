"use client";

/**
 * Placeholder con icono de usuario cuando no hay imagen de perfil.
 * Evita mostrar la imagen por defecto de la plantilla.
 */
interface UserAvatarPlaceholderProps {
  /** Tamaño en px (ancho y alto). Por defecto 48. */
  size?: number;
  /** Clase CSS adicional para el contenedor. */
  className?: string;
}

export default function UserAvatarPlaceholder({ size = 48, className = "" }: UserAvatarPlaceholderProps) {
  const iconSize = Math.round(size * 0.5);
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: "50%",
        background: "var(--tp-border-secondary, #e9ecef)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--tp-heading-primary, #2d373c)",
      }}
      aria-hidden
    >
      <i className="fa-light fa-user" style={{ fontSize: iconSize }} />
    </div>
  );
}
