"use client";
import Image from "next/image";
import { useConfiguracionGeneral } from "@/hooks/useConfiguracionGeneral";

interface DynamicLogoProps {
  variant?: "black" | "white" | "auto";
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 150;
const DEFAULT_HEIGHT = 60;

/**
 * Placeholder que mantiene el espacio del logo sin mostrar imagen de plantilla.
 * Se usa mientras carga la config o cuando no hay logo configurado.
 */
function LogoPlaceholder({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label="Logo"
      className={className}
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height,
        backgroundColor: "transparent",
      }}
    />
  );
}

export default function DynamicLogo({
  variant = "auto",
  className = "",
  alt = "Logo",
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: DynamicLogoProps) {
  const { configuracion, loading } = useConfiguracionGeneral();
  const logoUrl = configuracion.logoPreview;
  const w = width || DEFAULT_WIDTH;
  const h = height || DEFAULT_HEIGHT;

  // Mientras carga: no mostrar logo de plantilla, solo placeholder
  if (loading) {
    return <LogoPlaceholder width={w} height={h} className={className} />;
  }

  // Cuando hay logo dinámico configurado, mostrarlo
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={alt}
        width={w}
        height={h}
        className={className}
        style={{ objectFit: "contain" }}
        unoptimized
        priority={false}
      />
    );
  }

  // Sin logo configurado: placeholder (nunca mostrar logo de la plantilla)
  return <LogoPlaceholder width={w} height={h} className={className} />;
}
