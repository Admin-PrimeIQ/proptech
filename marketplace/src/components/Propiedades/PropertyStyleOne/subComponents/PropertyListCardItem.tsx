"use client"
import { ActiveWishListSvg, BathsroomTwoSvg, BedroomsTwoSvg, LivingTwoSvg, WishListSvg } from "@/components/SVG";
import { formatPrice } from "@/components/Utils/formatPrice";
import { IFeatureListProps } from "@/types/custom-interface";
import { useFavoritos } from "@/hooks/useFavoritos";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PropertyListCardItem({ item }: IFeatureListProps) {
    const router = useRouter();
    const { toggleFavorito, esFavorito, loading } = useFavoritos();
    const detailId = item.idPublic ?? String(item.id);
    const linkBase = `/property-details-2/${detailId}`;

    const handleVerDetalles = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        if (!detailId || detailId === "undefined") return;
        e.preventDefault();
        router.push(linkBase);
    };
    const isExternalImage = typeof item.image === "string" && /^https?:\/\//i.test(item.image);

    // Favoritos (sincronizado con backend)
    const idPropiedadPublic = item.idPublic || "";
    const isWishlisted = idPropiedadPublic ? esFavorito(idPropiedadPublic) : false;
    const isLoadingFavorito = idPropiedadPublic ? loading(idPropiedadPublic) : false;

    const handleToggleFavorito = () => {
        if (!idPropiedadPublic) {
            console.warn("PropertyListCardItem: Propiedad sin idPublic, no se puede agregar a favoritos", item);
            return;
        }
        console.log("PropertyListCardItem: Toggle favorito para propiedad:", idPropiedadPublic);
        if (!isLoadingFavorito) {
            toggleFavorito(item);
        }
    };

    return (
        <div className="tp-team-details-warp mb-30">
            <div className="tp-property-item d-flex justify-content-between align-items-center">
                <div className="tp-property-content">
                    <h4 className="tp-property-title"><Link href={linkBase}>{item.title}</Link></h4>
                    <p>{item.address}</p>
                    <span className="tp-property-usd">
                        {formatPrice(item.price, true, item.moneda)}{item.isForRent ? " /mo" : ""}
                    </span>
                    <div className="tp-property-meta-box">
                        <div className="tp-property-meta d-flex align-items-center">
                            <span><BedroomsTwoSvg /></span>
                            <p>{item.bedrooms} Habitaciones</p>
                        </div>
                        <div className="tp-property-meta d-flex align-items-center">
                            <span><BathsroomTwoSvg /></span>
                            <p>{item.bathrooms} Baños</p>
                        </div>
                        <div className="tp-property-meta d-flex align-items-center">
                            <span><LivingTwoSvg /></span>
                            <p>{item.livingArea}</p>
                        </div>
                    </div>
                </div>
                <div className="tp-property-thumb list p-relative">
                    <Link href={linkBase} onClick={handleVerDetalles}>
                        <Image
                            src={item.image}
                            alt="property thumb"
                            width={400}
                            height={300}
                            style={{ objectFit: "cover", width: "100%", height: "auto" }}
                            unoptimized={isExternalImage}
                        />
                    </Link>
                    {item.showTags && (
                    <div className="tp-rent-tags">
                        {item.isForRent === true ? <Link href="#">FOR RENT</Link> : ""} {" "}
                        {item.isFeatured === true ? <Link className="two" href="#">FEATURED</Link> : ""}
                    </div>
                )}
                    <div className="tp-rent-option">
                        <button 
                            onClick={handleToggleFavorito}
                            disabled={isLoadingFavorito}
                            style={{ opacity: isLoadingFavorito ? 0.6 : 1, cursor: isLoadingFavorito ? "wait" : "pointer" }}
                        >
                            <span> {isWishlisted ? <ActiveWishListSvg /> : <WishListSvg />}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}