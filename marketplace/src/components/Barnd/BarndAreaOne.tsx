"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LogoAsociado = {
  idPublic: string;
  nombreAsociado: string;
  imagen: { idPublic: string; url: string } | null;
  orden: number;
  activo: boolean;
};

// Tamaños de imagen según el orden: 120*45, 96*35, 69*45, 54*45, 124*29
const imageSizes = [
  { width: 120, height: 45 },
  { width: 96, height: 35 },
  { width: 69, height: 45 },
  { width: 54, height: 45 },
  { width: 124, height: 29 },
];

function LogoItem({
  logo,
  sizeIndex,
}: {
  logo: LogoAsociado;
  sizeIndex: number;
}) {
  const imageUrl = logo.imagen?.url || "";
  const isExternalImage = imageUrl.startsWith("http");
  const size = imageSizes[sizeIndex % imageSizes.length];

  if (!imageUrl) return null;

  return (
    <div className="tp-brand-slide">
      <div className="tp-brand-item">
        <Image
          src={imageUrl}
          alt={logo.nombreAsociado}
          width={size.width}
          height={size.height}
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            objectFit: "contain",
          }}
          unoptimized={isExternalImage}
        />
      </div>
    </div>
  );
}

const TITLE = "Logos asociados";

export default function BrandAreaOne() {
    const [logos, setLogos] = useState<LogoAsociado[]>([]);
    const [loadingLogos, setLoadingLogos] = useState(true);

    useEffect(() => {
        fetch("/api/logos-asociados")
            .then((r) => r.json())
            .then((res) => {
                if (res?.error) {
                    console.error("Error al cargar logos asociados:", res.error);
                    setLogos([]);
                    return;
                }
                const data = res?.data ?? res ?? [];
                const activos = Array.isArray(data)
                    ? data
                        .filter((item: LogoAsociado) => item.activo)
                        .sort((a: LogoAsociado, b: LogoAsociado) => a.orden - b.orden)
                    : [];
                setLogos(activos);
            })
            .catch((err) => {
                console.error("Error al cargar logos asociados:", err);
                setLogos([]);
            })
            .finally(() => {
                setLoadingLogos(false);
            });
    }, []);

    // Si no hay logos, no mostrar la sección de logos
    if (!loadingLogos && logos.length === 0) {
        return (
            <section className="tp-brand-area pt-110 pb-140">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tp-brand-heading text-center">
                                <h4 className="tp-brand-title">{TITLE}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="tp-brand-area pt-110 pb-140">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-brand-heading text-center">
                            <h4 className="tp-brand-title">{TITLE}</h4>
                        </div>
                    </div>
                </div>
                {loadingLogos ? (
                    <div className="row">
                        <div className="col-lg-12 text-center py-5">
                            <p>Cargando logos...</p>
                        </div>
                    </div>
                ) : logos.length > 0 ? (
                    <div className="row">
                        <div className="tp-brand-slider">
                            <div className="tp-brand-marquee">
                                <div className="tp-brand-marquee-track" aria-hidden="true">
                                    {[...logos, ...logos].map((logo, index) => (
                                        <LogoItem
                                            key={`${logo.idPublic}-${index}`}
                                            logo={logo}
                                            sizeIndex={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
