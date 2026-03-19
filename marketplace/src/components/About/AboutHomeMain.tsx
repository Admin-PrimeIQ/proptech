import aboutThumb from "../../../public/assets/img/about/about-thumb-1.jpg";
import Link from "next/link";
import type { PaginaInfoConfigResponse } from "@/lib/pagina-info-config";
import AboutInfoCarousel, { type AboutCarouselItem } from "./AboutInfoCarousel";

type AboutHomeMainProps = {
  paginaInfo?: PaginaInfoConfigResponse | null;
  items?: AboutCarouselItem[];
};

export default function AboutHomeMain({ paginaInfo, items = [] }: AboutHomeMainProps) {
    // Valores por defecto si no hay información configurada
    const titulo = paginaInfo?.tituloPagina || "Participa en un estilo de vida urbano vibrante con propiedades excepcionales.";
    const descripcion = paginaInfo?.descripcionPagina || "En el corazón de cada una de nuestras inversiones está una estrategia para construir o comprar un portafolio de bienes raíces con más de 12 años de experiencia para un grupo de usuarios específico. Creemos que al hacer esto bien creamos mejores resultados, no solo para nuestros inversionistas, sino para la sociedad en general. Invertimos en empresas.";
    const imagenUrl = paginaInfo?.imagen?.url || aboutThumb.src;

    return (
        <AboutInfoCarousel
            items={items}
            intervalMs={5000}
            fallback={{ titulo, descripcion, imagenUrl }}
            renderActions={
                <>
                    <Link className="tp-btn" href="/about">
                        <span className="btn-wrap">
                            <b className="text-1">Sobre la Empresa</b>
                            <b className="text-2">Sobre la Empresa</b>
                        </span>
                    </Link>
                    <Link className="tp-btn btn-2" href="/propiedades">
                        <span className="btn-wrap">
                            <b className="text-1">Buscar Propiedad</b>
                            <b className="text-2">Buscar Propiedad</b>
                        </span>
                    </Link>
                </>
            }
        />
    );
}
