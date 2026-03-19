"use client";

import PropertySingleCard from "@/components/Common/PropertySingleCard";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";
import Image from "next/image";

type AboutTopFavoritosSectionProps = {
  /** Texto introductorio bajo el título (ej. desde admin Acerca de nosotros) */
  introText?: string | null;
  /** URL de imagen opcional para la sección (ej. desde admin) */
  introImageUrl?: string | null;
};

const INTRO_DEFAULT = "Descubre las propiedades más valoradas por nuestros usuarios.";

export default function AboutTopFavoritosSection({
  introText,
  introImageUrl,
}: AboutTopFavoritosSectionProps) {
  const { properties, loading, error, refetch } = useFeaturedProperties(3);
  const text = introText?.trim() || INTRO_DEFAULT;
  const imageUrl = introImageUrl?.trim();

  return (
    <section className="tp-realstate-ptb pt-120 pb-140">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tp-realstate-heading text-center mb-40">
              <h3 className="tp-section-title">Cómo hacemos esto fácil para ti</h3>
              {text && <p className="text-muted mt-3 mb-0" style={{ maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>{text}</p>}
            </div>
          </div>
        </div>
        {imageUrl && (
          <div className="row mb-40">
            <div className="col-lg-12">
              <div className="tp-realstate-thumb p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 6", maxHeight: "320px" }}>
                  <Image src={imageUrl} alt="Cómo hacemos esto fácil para ti" fill sizes="100vw" style={{ objectFit: "cover" }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          {loading ? (
            <div className="col-12 text-center py-5">
              <p className="text-muted">Cargando propiedades…</p>
            </div>
          ) : error ? (
            <div className="col-12 text-center py-5">
              <p className="text-danger mb-3">{error}</p>
              <button type="button" className="tp-btn" onClick={refetch}>Reintentar</button>
            </div>
          ) : properties.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p className="text-muted">Aún no hay propiedades para mostrar.</p>
            </div>
          ) : (
            properties.slice(0, 3).map((item) => (
              <div className="col-lg-4 col-md-6" key={item.idPublic ?? item.id}>
                <PropertySingleCard item={item} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
