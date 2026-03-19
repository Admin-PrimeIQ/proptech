import ActiveWishListSvg from "@/components/SVG/PropertySvg/ActiveWishListSvg";
import BathsroomTwoSvg from "@/components/SVG/PropertySvg/BathsroomTwoSvg";
import BedroomsTwoSvg from "@/components/SVG/PropertySvg/BedroomsTwoSvg";
import LivingTwoSvg from "@/components/SVG/PropertySvg/LivingTwoSvg";
import MapMarkerSvg from "@/components/SVG/PropertySvg/MapMarkerIcon";
import WishListSvg from "@/components/SVG/PropertySvg/WishListSvg";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { formatPrice } from "../Utils/formatPrice";
import { useFavoritos } from "@/hooks/useFavoritos";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface propertyProps {
    item: IFeaturedPropertyDT;
    isWishlisted: boolean
}

export default function PropertySingleCardTwo({ item, isWishlisted: isWishlistedProp }: propertyProps) {
    const router = useRouter();
    const { toggleFavorito, esFavorito, loading } = useFavoritos();
    const detailId = item.idPublic ?? String(item.id);
    const linkBase = item.linkUrl ? `/${item.linkUrl}/${detailId}` : `/property-details-2/${detailId}`;

    const handleVerDetalles = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        if (!detailId || detailId === "undefined") return;
        e.preventDefault();
        router.push(linkBase);
    };
    const isExternalImage = typeof item.image === "string" && /^https?:\/\//i.test(item.image);

    // Usar el estado de favoritos del hook en lugar del prop
    const idPropiedadPublic = item.idPublic || "";
    const isWishlisted = idPropiedadPublic ? esFavorito(idPropiedadPublic) : isWishlistedProp;
    const isLoadingFavorito = idPropiedadPublic ? loading(idPropiedadPublic) : false;

    const handleToggleFavorito = () => {
        if (!idPropiedadPublic) {
            console.warn("PropertySingleCardTwo: Propiedad sin idPublic, no se puede agregar a favoritos", item);
            return;
        }
        console.log("PropertySingleCardTwo: Toggle favorito para propiedad:", idPropiedadPublic);
        if (!isLoadingFavorito) {
            toggleFavorito(item);
        }
    };

    return (
        <div className={`tp-listing-2-item ${item.spacing && "mb-30"} ${item.wowAnimation && "wow fadeInUp"}`}
            data-wow-duration={item.wowDelay ? "1s" : undefined}
            data-wow-delay={item.wowDelay ? item.wowDelay : undefined}>
            <div className="tp-rent-item p-relative">
                <div className="tp-rent-thumb p-relative">
                    <Link href={linkBase} onClick={handleVerDetalles}>
                        <Image
                            src={item.image}
                            alt="property image"
                            width={400}
                            height={300}
                            style={{ objectFit: "cover", width: "100%", height: "auto" }}
                            unoptimized={isExternalImage}
                        />
                    </Link>

                    {item.showTags && (
                        <div className="tp-rent-tags">
                            {item.isForRent && <Link href="#">FOR RENT</Link>}
                            {item.isFeatured && <Link className="two" href="#">FEATURED</Link>}
                        </div>
                    )}

                    <div className="tp-rent-option d-flex">
                        <button 
                            onClick={handleToggleFavorito}
                            disabled={isLoadingFavorito}
                            style={{ opacity: isLoadingFavorito ? 0.6 : 1, cursor: isLoadingFavorito ? "wait" : "pointer" }}
                        >
                            <span> {isWishlisted ? <ActiveWishListSvg /> : <WishListSvg />}</span>
                        </button>
                    </div>
                </div>
                <div className="tp-rent-content">
                    <h4 className="tp-rent-title">
                        <Link className="textline" href={linkBase} onClick={handleVerDetalles}>{item.title}</Link>
                    </h4>
                    <p><MapMarkerSvg /> {item.address}</p>
                    <div className="tp-rent-meta-list d-flex justify-content-between align-items-center">
                        <div className="tp-rent-meta-item">
                            <div className="tp-rent-meta-content d-flex">
                                <span><BedroomsTwoSvg /></span>
                                <p>{item.bedrooms} Habitaciones</p>
                            </div>
                        </div>
                        <div className="tp-rent-meta-item">
                            <div className="tp-rent-meta-content d-flex">
                                <span><BathsroomTwoSvg /></span>
                                <p>{item.bathrooms} Baños</p>
                            </div>
                        </div>
                        <div className="tp-rent-meta-item">
                            <div className="tp-rent-meta-content d-flex">
                                <span><LivingTwoSvg /></span>
                                <p>{item.livingArea}</p>
                            </div>
                        </div>
                    </div>
                    <div className="tp-rent-btn-box d-flex justify-content-between align-items-center">
                        <div className="tp-rent-btn">
                            <Link className="tp-btn" href={linkBase} onClick={handleVerDetalles}>Ver detalles</Link>
                        </div>
                        <div className="tp-rent-price">
                            <span>{formatPrice(item.price, true, item.moneda)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}