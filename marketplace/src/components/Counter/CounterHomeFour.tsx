import Image from "next/image";
import featureThumb1 from "../../../public/assets/img/feature/home-2/feature-thumb-1.jpg";
import featureThumb2 from "../../../public/assets/img/feature/home-2/feature-thumb-2.jpg";

const columnasInfo = [
    {
        title: "Mapa interactivo",
        description:
            "Conoce la ubicacion de tus propiedades en un mapa interactivo y accede a informacion detallada de cada propiedad.",
        image: featureThumb1,
        imageAlt: "Visibilidad de propiedades",
    },
    {
        title: "Mapa de absorcion",
        description:
            "Conoce la absorcion de tus propiedades en un mapa interactivo y accede a informacion detallada de cada propiedad.",
        image: featureThumb2,
        imageAlt: "Gestion de propiedades",
    },
];

export default function CounterHomeFour() {
    return (
        <section className="tp-counter-4-ptb p-relative z-index-1 pt-40 pb-250">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-counter-4-heading text-center mb-50">
                            <h4 className="tp-section-title">Conoce nuestras mejores soluciones Enterprise al suscribirte a nuestro plan empresarial</h4>
                            <p>
                                Nuestras soluciones Enterprise estan disenadas para ayudarte a impulsar tus resultados en el mercado inmobiliario.
                                <br />
                                Impulsando tus resultados en el mercado inmobiliario.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div
                            className="tp-counter-4-item-box d-flex justify-content-center wow fadeInUp"
                            data-wow-duration="1s"
                            data-wow-delay=".3s"
                        >
                            {columnasInfo.map((item) => (
                                <div className="tp-counter-4-item text-center" key={item.title}>
                                    <h4 className="tp-counter-4-item-title">{item.title}</h4>
                                    <p>{item.description}</p>
                                    <div className="tp-counter-4-item-image">
                                        <Image
                                            src={item.image}
                                            alt={item.imageAlt}
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
