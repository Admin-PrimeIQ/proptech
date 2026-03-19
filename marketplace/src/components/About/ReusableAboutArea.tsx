import aboutImg1 from "../../../public/assets/img/about/home-5/about-5-1.jpg";
import aboutImg2 from "../../../public/assets/img/about/home-5/about-5-2.jpg";
import aboutIcon1 from "../../../public/assets/img/about/home-5/about-5-icon-1.svg";
import Image from "next/image";

type ReusableAboutAreaProps = {
  nombreEmpresa?: string | null;
  /** Título de la sección "Razones" (admin Acerca de nosotros) */
  tituloSeccionRazones?: string | null;
  /** Texto principal de la sección (admin) */
  textoSeccionRazones?: string | null;
  /** URL imagen principal razones (admin) */
  imagenPrincipalRazonesUrl?: string | null;
  /** URL imagen secundaria razones (admin) */
  imagenSecundariaRazonesUrl?: string | null;
};

export default function ReusableAboutArea({
  tituloSeccionRazones,
  textoSeccionRazones,
  imagenPrincipalRazonesUrl,
  imagenSecundariaRazonesUrl,
}: ReusableAboutAreaProps) {
  /* Texto azul al inicio: fijo */
  const preTitle = "Razones para usar nuestros servicios";
  /* Texto negro más grande: título de las razones (admin) */
  const headingTitle = tituloSeccionRazones?.trim() || "Por qué elegirnos";
  /* Texto junto al icono: información de la sección de razones (admin) */
  const bodyText = textoSeccionRazones?.trim() || "Lorem ipsum dolor sit amet, consectetuer adipiscing modo ligula eget dolor. Aenean massa. Cum";

  const urlImg1 = imagenPrincipalRazonesUrl?.trim();
  const urlImg2 = imagenSecundariaRazonesUrl?.trim();

  /* Mismas proporciones que las imágenes originales para conservar el estilo (3:2) */
  const aboutImgAspect = { width: 600, height: 400 };

  return (
    <section className="tp-about-5-ptb fix pt-130 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="tp-about-5-thumb p-relative wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".3s">
              {urlImg1 ? (
                <div style={{ position: "relative", width: "100%", aspectRatio: `${aboutImgAspect.width} / ${aboutImgAspect.height}` }}>
                  <Image
                    src={urlImg1}
                    alt="About Image"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <Image src={aboutImg1} alt="About Image" />
              )}
              <div className="tp-about-5-img image-anime">
                {urlImg2 ? (
                  <div style={{ position: "relative", width: "100%", aspectRatio: `${aboutImgAspect.width} / ${aboutImgAspect.height}` }}>
                    <Image
                      src={urlImg2}
                      alt="About Image"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <Image style={{ width: "100%", height: "auto" }} src={aboutImg2} alt="About Image" />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tp-about-5-wrapper wow fadeInRight" data-wow-duration="1s" data-wow-delay=".3s">
              <div className="tp-about-5-heading mb-50">
                <span className="tp-section-title-pre">{preTitle}</span>
                <h3 className="tp-section-title">{headingTitle}</h3>
              </div>
              <div className="tp-about-5-item-box mb-55">
                <div className="tp-about-5-item d-flex mb-30">
                  <div className="tp-about-5-item-icon mr-30">
                    <Image src={aboutIcon1} alt="Razones" />
                  </div>
                  <div className="tp-about-5-item-content">
                    <p>{bodyText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
