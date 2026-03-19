"use client"
import { ActiveWishListSvg, BathroomsSvg, BedroomsSvg, LivingSvg, WishListSvg } from "../SVG";
import { IFeatureListProps } from "@/types/custom-interface";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { formatPrice } from "../Utils/formatPrice";
import { useFavoritos } from "@/hooks/useFavoritos";
import UserAvatarPlaceholder from "@/components/UI/UserAvatarPlaceholder";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PropertySingleCardProps = IFeatureListProps & { compact?: boolean };

export default function PropertySingleCard({ item, compact }: PropertySingleCardProps) {
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
    const isExternalUserImage = typeof item.userImage === "string" && /^https?:\/\//i.test(item.userImage);

    // Favoritos (sincronizado con backend)
    // Solo funciona si la propiedad tiene idPublic (viene de la API)
    const idPropiedadPublic = item.idPublic || "";
    const isWishlisted = idPropiedadPublic ? esFavorito(idPropiedadPublic) : false;
    const isLoadingFavorito = idPropiedadPublic ? loading(idPropiedadPublic) : false;

    const handleToggleFavorito = () => {
        if (!idPropiedadPublic) {
            // Si no tiene idPublic, es una propiedad estática y no se puede agregar a favoritos
            console.warn("PropertySingleCard: Propiedad sin idPublic, no se puede agregar a favoritos", item);
            return;
        }
        console.log("PropertySingleCard: Toggle favorito para propiedad:", idPropiedadPublic);
        if (!isLoadingFavorito) {
            toggleFavorito(item);
        }
    };

    return (
        <div
            className={`tp-rent-item p-relative ${item.spacing && "mb-30"} ${item.wowAnimation && "wow fadeInUp"}`}
            data-wow-duration={item.wowDelay ? "1s" : undefined}
            data-wow-delay={item.wowDelay ? item.wowDelay : undefined}
        >
            <div className="tp-rent-thumb p-relative">
                <Link href={linkBase} onClick={handleVerDetalles}>
                    <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={300}
                        style={{ width: "100%", height: "auto", objectFit: "cover" }}
                        unoptimized={isExternalImage}
                    />
                </Link>
                <div className="tp-rent-user-wrap d-flex align-items-center justify-content-between">
                    <div className="tp-rent-user d-flex align-items-center">
                        <div className="tp-rent-user-thumb">
                            {item.userImage ? (
                                <Image
                                    src={item.userImage}
                                    alt="User"
                                    width={60}
                                    height={60}
                                    style={{ width: "auto", height: "auto" }}
                                    unoptimized={isExternalUserImage}
                                />
                            ) : (
                                <UserAvatarPlaceholder size={60} />
                            )}
                        </div>
                        <div className="tp-rent-user-content">
                            <h5 className="tp-rent-user-content-title">{item.userName}</h5>
                            <span>{item.userRole}</span>
                        </div>
                    </div>
                    <div className="tp-rent-option d-flex">
                        <button 
                            onClick={handleToggleFavorito}
                            disabled={isLoadingFavorito}
                            style={{ opacity: isLoadingFavorito ? 0.6 : 1, cursor: isLoadingFavorito ? "wait" : "pointer" }}
                        >
                            <span>{isWishlisted ? <ActiveWishListSvg /> : <WishListSvg />}</span>
                        </button>
                    </div>
                </div>
                {item.showTags && (
                    <div className="tp-rent-tags">
                        {item.isForRent === true ? <Link href="#">FOR RENT</Link> : ""} {" "}
                        {item.isFeatured === true ? <Link className="two" href="#">FEATURED</Link> : ""}
                    </div>
                )}
            </div>
            <div className="tp-rent-content">
                <h4 className="tp-rent-title">
                    <Link className="textline" href={linkBase} onClick={handleVerDetalles}>{item.title}</Link>
                </h4>
                <p>{item.address}</p>
                <div className={`tp-rent-meta-list d-flex ${compact ? "tp-rent-meta-list--compact flex-column" : "justify-content-between align-items-center"}`}>
                    {compact ? (
                        <>
                            <div className="tp-rent-meta-item tp-rent-meta-item--row d-flex align-items-center">
                                <span className="tp-rent-meta-icon"><BedroomsSvg /></span>
                                <span className="tp-rent-meta-label">Habitaciones</span>
                                <span className="tp-rent-meta-value">{item.bedrooms}</span>
                            </div>
                            <div className="tp-rent-meta-item tp-rent-meta-item--row d-flex align-items-center">
                                <span className="tp-rent-meta-icon"><BathroomsSvg /></span>
                                <span className="tp-rent-meta-label">Baños</span>
                                <span className="tp-rent-meta-value">{item.bathrooms}</span>
                            </div>
                            <div className="tp-rent-meta-item tp-rent-meta-item--row d-flex align-items-center">
                                <span className="tp-rent-meta-icon"><LivingSvg /></span>
                                <span className="tp-rent-meta-label">Metros cuadrados</span>
                                <span className="tp-rent-meta-value">{item.livingArea}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="tp-rent-meta-item">
                                <div className="tp-rent-meta-content d-flex">
                                    <span><BedroomsSvg /></span>
                                    <p>{item.bedrooms}</p>
                                </div>
                                <p>Habitaciones</p>
                            </div>
                            <div className="tp-rent-meta-item">
                                <div className="tp-rent-meta-content d-flex">
                                    <span><BathroomsSvg /></span>
                                    <p>{item.bathrooms}</p>
                                </div>
                                <p>Baños</p>
                            </div>
                            <div className="tp-rent-meta-item">
                                <div className="tp-rent-meta-content d-flex">
                                    <span><LivingSvg /></span>
                                    <p>{item.livingArea}</p>
                                </div>
                                <p>Living Area</p>
                            </div>
                        </>
                    )}
                </div>
                <div className="tp-rent-btn-box d-flex justify-content-between align-items-center">
                    <div className="tp-rent-btn">
                        <Link className="tp-btn" href={linkBase} onClick={handleVerDetalles}>
                            Ver detalles
                        </Link>
                    </div>
                    <div className="tp-rent-price">
                        <span>{formatPrice(item.price, true)}</span>
                    </div>
                </div>
            </div>
        </div >
    )
}