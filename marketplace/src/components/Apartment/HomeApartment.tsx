import apartmentBg from '../../../public/assets/img/apartment/apartment-bg.jpg'
import Link from 'next/link'

type HomeApartmentAreaProps = {
    /** URL de imagen (S3) para usar como fondo. Si no viene, usa la imagen default. */
    backgroundImageUrl?: string | null;
};

export default function HomeApartmentArea({ backgroundImageUrl }: HomeApartmentAreaProps) {
    const bg = backgroundImageUrl || apartmentBg.src;
    return (
        <section
            className="tp-appartment-area pt-180 pb-180 include-bg"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
            }}>
            {/* Overlay oscuro para mejorar legibilidad del texto */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))",
                    pointerEvents: "none",
                }}
                aria-hidden="true"
            />
            <div className="container" style={{ position: "relative", zIndex: 2 }}>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-apartment-wrapper text-center">
                            <h3 
                                className="tp-section-title"
                                style={{
                                    color: "white",
                                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 16px rgba(0, 0, 0, 0.7)",
                                    fontWeight: 700,
                                    lineHeight: "1.3",
                                }}
                            >
                                Únete y <br /> experimenta hoy
                            </h3>
                            <Link 
                                className="tp-btn" 
                                href="/propiedades"
                                style={{
                                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
                                }}
                            >
                                <span className="btn-wrap">
                                    <b className="text-1">Descubrir Apartamentos</b>
                                    <b className="text-2">Descubrir Apartamentos</b>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}