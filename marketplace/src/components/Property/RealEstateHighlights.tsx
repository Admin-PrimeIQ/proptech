"use client";
import { featureProps } from "@/types/custom-interface";
import featureThumb1 from "../../../public/assets/img/feature/home-2/feature-thumb-1.jpg";
import featureThumb2 from "../../../public/assets/img/feature/home-2/feature-thumb-2.jpg";
import featureThumb3 from "../../../public/assets/img/feature/home-2/feature-thumb-3.jpg";
import FeatureArrowIcon from "../SVG/PropertySvg/FeatureArrowIcon";
import Image from "next/image";
import Link from "next/link";

type RealEstateHighlightsProps = featureProps & {
  imagenEncuentraTuFuturoUrl?: string | null;
  imagenCompraAlquilaUrl?: string | null;
  imagenListaTuPropiedadUrl?: string | null;
};

/* Misma relación de aspecto que las imágenes originales (feature-thumb) para conservar el estilo */
const FEATURE_IMG_ASPECT = "400 / 280";

export default function RealEstateHighlights({
  sectionClass,
  paddingClass,
  bgColor,
  imagenEncuentraTuFuturoUrl,
  imagenCompraAlquilaUrl,
  imagenListaTuPropiedadUrl,
}: RealEstateHighlightsProps) {
  const img1 = imagenEncuentraTuFuturoUrl?.trim() ? imagenEncuentraTuFuturoUrl : featureThumb1;
  const img2 = imagenCompraAlquilaUrl?.trim() ? imagenCompraAlquilaUrl : featureThumb2;
  const img3 = imagenListaTuPropiedadUrl?.trim() ? imagenListaTuPropiedadUrl : featureThumb3;

  const isRemote = (src: string | typeof featureThumb1) => typeof src === "string";

  return (
    <section className={`${sectionClass ? sectionClass : "tp-feature-2-area"} 
        ${paddingClass ? paddingClass : "pt-140"} pb-110 `} style={{ backgroundColor: bgColor }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="tp-feature-2-item mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
              <div className="tp-feature-2-item-heading d-flex justify-content-between align-items-center">
                <h3 className="tp-feature-2-item-title"><Link href="/propiedades">Encuentra tu futuro <br /> hogar</Link></h3>
                <span><Link href="/propiedades"><FeatureArrowIcon /></Link></span>
              </div>
              <div className="tp-feature-2-item-content d-flex align-items-center">
                <span className="tp-feature-2-item-date">Mar 12 <i>2024</i></span>
                {isRemote(img1) ? (
                  <div style={{ position: "relative", width: "100%", aspectRatio: FEATURE_IMG_ASPECT }}>
                    <Image src={img1} alt="Encuentra tu futuro hogar" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  </div>
                ) : (
                  <Image src={img1} alt="Encuentra tu futuro hogar" width={400} height={280} />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="tp-feature-2-item active mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
              <div className="tp-feature-2-item-heading d-flex justify-content-between align-items-center">
                <h3 className="tp-feature-2-item-title"><Link href="/propiedades">Compra o alquila <br /> una casa</Link></h3>
                <span><Link href="/propiedades"><FeatureArrowIcon /></Link></span>
              </div>
              <div className="tp-feature-2-item-content d-flex align-items-center">
                <span className="tp-feature-2-item-date">Mar 12 <i>2024</i></span>
                {isRemote(img2) ? (
                  <div style={{ position: "relative", width: "100%", aspectRatio: FEATURE_IMG_ASPECT }}>
                    <Image src={img2} alt="Compra o alquila una casa" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  </div>
                ) : (
                  <Image src={img2} alt="Compra o alquila una casa" width={400} height={280} />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="tp-feature-2-item mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".7s">
              <div className="tp-feature-2-item-heading d-flex justify-content-between align-items-center">
                <h3 className="tp-feature-2-item-title"><Link href="/propiedades">Lista tu propia <br /> propiedad</Link></h3>
                <span><Link href="/propiedades"><FeatureArrowIcon /></Link></span>
              </div>
              <div className="tp-feature-2-item-content d-flex align-items-center">
                <span className="tp-feature-2-item-date">Mar 12 <i>2024</i></span>
                {isRemote(img3) ? (
                  <div style={{ position: "relative", width: "100%", aspectRatio: FEATURE_IMG_ASPECT }}>
                    <Image src={img3} alt="Lista tu propia propiedad" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  </div>
                ) : (
                  <Image src={img3} alt="Lista tu propia propiedad" width={400} height={280} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



