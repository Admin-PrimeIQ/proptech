import { AboutSvgFour, AboutSvgOne, AboutSvgThree, AboutSvgTwo } from "../SVG";
import { JSX } from "react";

interface AboutPoint {
  icon: JSX.Element;
  title: string;
  description: string;
}

const DEFAULT_DESCRIPTION = "Lorem ipsum dolor sit amet, consectetuer adipiscing modo ligula eget dolor. Aenean massa.";

const AboutPointItem = ({ icon, title, description }: AboutPoint) => (
  <div className="tp-about-point-item d-flex">
    <div className="tp-about-point-item-icon">
      <span>{icon}</span>
    </div>
    <div className="tp-about-point-item-content">
      <h4 className="tp-about-point-item-title">{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

type AboutPointAreaProps = {
  informacionExcelencia?: string | null;
  informacionLogros?: string | null;
  informacionCalidad?: string | null;
  informacionTransparencia?: string | null;
};

export default function AboutPointArea({
  informacionExcelencia,
  informacionLogros,
  informacionCalidad,
  informacionTransparencia,
}: AboutPointAreaProps = {}) {
  const aboutPoints: AboutPoint[] = [
    { icon: <AboutSvgOne />, title: "Excelencia", description: informacionExcelencia?.trim() || DEFAULT_DESCRIPTION },
    { icon: <AboutSvgTwo />, title: "Logros", description: informacionLogros?.trim() || DEFAULT_DESCRIPTION },
    { icon: <AboutSvgThree />, title: "Calidad", description: informacionCalidad?.trim() || DEFAULT_DESCRIPTION },
    { icon: <AboutSvgFour />, title: "Transparencia", description: informacionTransparencia?.trim() || DEFAULT_DESCRIPTION },
  ];

  return (
    <section className="tp-about-point-ptb pt-130 pb-110" style={{ backgroundColor: "#262B35" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tp-about-point-heading text-center mb-50">
              <h3 className="tp-section-title">
                Cómo hacemos esto fácil para ti
              </h3>
            </div>
          </div>
          <div className="col-lg-12 gx-0">
            <div className="tp-about-point-box d-flex flex-wrap">
              {aboutPoints.map((point, index) => (
                <AboutPointItem key={index} {...point} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
