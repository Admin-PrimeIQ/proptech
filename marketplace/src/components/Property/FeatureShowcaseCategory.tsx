"use client";
import featureShape from "../../../public/assets/img/feature/feature-shape.png";
import featureBg from "../../../public/assets/img/feature/feature-bg.png";
import featureIcon1 from "../../../public/assets/img/feature/icon-1.png";
import featureIcon2 from "../../../public/assets/img/feature/icon-2.png";
import featureIcon3 from "../../../public/assets/img/feature/icon-3.png";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const baseFeatures = [
    { id: 1, title: "Comprar una propiedad", icon: featureIcon1, delay: "0.3s" },
    { id: 2, title: "Vender una propiedad", icon: featureIcon2, delay: "0.7s" },
    { id: 3, title: "Rentar una propiedad", icon: featureIcon3, delay: "0.3s" },
];

export default function FeatureShowcaseCategory() {
    const [activeIndex, setActiveIndex] = useState<number | null>(1);
    const [compraIdPublic, setCompraIdPublic] = useState<string | null>(null);
    const [rentaIdPublic, setRentaIdPublic] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    // Cargar tipos de operación para reutilizar mismos IDs que el filtro de propiedades
    useEffect(() => {
        let cancelled = false;
        fetch("/api/tipo-operacion-inmobiliaria")
            .then((r) => r.json())
            .then((d) => {
                if (cancelled) return;
                const list = Array.isArray(d) ? d : d?.data ?? d;
                if (!Array.isArray(list)) return;

                list.forEach((op: { idPublic: string; nombre: string }) => {
                    const n = op.nombre.toLowerCase();
                    if (
                        n.includes("venta") ||
                        n.includes("compra") ||
                        n.includes("buy")
                    ) {
                        setCompraIdPublic(op.idPublic);
                    } else if (
                        n.includes("renta") ||
                        n.includes("alquiler") ||
                        n.includes("rent")
                    ) {
                        setRentaIdPublic(op.idPublic);
                    }
                });
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, []);

    const handleClick = (id: number) => {
        if (id === 1) {
            // Comprar: ir a /propiedades filtrado por operación "compra"
            const params = new URLSearchParams();
            if (compraIdPublic) {
                params.set("tipoOperacionIdPublic", compraIdPublic);
            }
            const qs = params.toString();
            router.push(`/propiedades${qs ? `?${qs}` : ""}`);
        } else if (id === 2) {
            // Vender: si está logueado → agregar propiedad; si no → login
            if (session?.user) {
                router.push("/administrador/agregar-nueva-propiedad");
            } else {
                router.push("/sign-in");
            }
        } else if (id === 3) {
            // Rentar: ir a /propiedades filtrado por operación "renta"
            const params = new URLSearchParams();
            if (rentaIdPublic) {
                params.set("tipoOperacionIdPublic", rentaIdPublic);
            }
            const qs = params.toString();
            router.push(`/propiedades${qs ? `?${qs}` : ""}`);
        }
    };

    return (
        <section className="tp-feature-area p-relative pt-140 pb-110" style={{ backgroundImage: `url(${featureBg.src})` }}>
            <div className="container">
                <div className="row">
                    {/* Display individual feature item */}
                    {baseFeatures.map((feature, index) => (
                        <div className="col-lg-4 col-sm-6" key={feature.id}>
                            <div
                                className={`tp-feature-item p-relative mb-30 wow fadeIn${index === 0 ? "Left" : index === 1 ? "Up" : "Right"} ${activeIndex === index ? "active" : ""}`}
                                data-wow-duration="1s"
                                data-wow-delay={feature.delay}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => handleClick(feature.id)}
                            >
                                <div className="tp-feature-item-shape">
                                    <Image style={{ width: "100%", height: "auto" }} src={featureShape} alt="feature shape" />
                                </div>
                                <div className="tp-feature-item-content">
                                    <div className="tp-feature-item-icon">
                                        <Image src={feature.icon} alt={feature.title} />
                                    </div>
                                    <h4>
                                        <button
                                            type="button"
                                            className="tp-feature-link-btn"
                                            onClick={() => handleClick(feature.id)}
                                        >
                                            {feature.title}
                                        </button>
                                    </h4>
                                </div>
                                <div className="tp-feature-item-btn">
                                    <button
                                        type="button"
                                        aria-label={feature.title}
                                        onClick={() => handleClick(feature.id)}
                                    >
                                        <span>
                                            <i className="fa-sharp fa-regular fa-arrow-right"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
