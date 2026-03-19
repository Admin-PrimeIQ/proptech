"use client"
import { BathroomsSvg, BedroomsSvg, DeleteIconSvg, DuplicateIconSvg, LivingSvg, MenuDotsSvg,
    PropertyEditSvg, ReviewsSvg, WishListSvg } from "@/components/SVG";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { formatPrice } from "@/components/Utils/formatPrice";
import UserAvatarPlaceholder from "@/components/UI/UserAvatarPlaceholder";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function isExternalUrl(src: unknown): boolean {
    return typeof src === "string" && /^https?:\/\//i.test(src);
}

interface IProps {
    property: IFeaturedPropertyDT;
    onDuplicateRequest?: (property: IFeaturedPropertyDT) => void;
    onDeleteRequest?: (property: IFeaturedPropertyDT) => void;
}

export default function DashboardPropertyItem({ property, onDuplicateRequest, onDeleteRequest }: IProps) {
    const [activePropertyId, setActivePropertyId] = useState<number | null>(null);
    const isExternalImage = isExternalUrl(property?.image);
    const isExternalUserImage = isExternalUrl(property?.userImage);

    const handleActionToggle = (id: number) => {
        setActivePropertyId(prev => (prev === id ? null : id));
    };

    return (
        <div className="col-xxl-3 col-xl-4 col-md-6" key={property.id}>
            <div className="tp-rent-item p-relative mb-30">
                <div className="tp-rent-thumb p-relative">
                    <Link href="#">
                        <Image
                            src={property?.image}
                            alt="property image"
                            width={400}
                            height={300}
                            style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            unoptimized={isExternalImage}
                        />
                    </Link>
                    <div className="tp-rent-user-wrap d-flex align-items-center justify-content-between">
                        <div className="tp-rent-user d-flex align-items-center">
                            <div className="tp-rent-user-thumb">
                                {property.userImage ? (
                                    <Image
                                        src={property.userImage}
                                        alt="user image"
                                        width={40}
                                        height={40}
                                        style={{ objectFit: "cover" }}
                                        unoptimized={isExternalUserImage}
                                    />
                                ) : (
                                    <UserAvatarPlaceholder size={40} />
                                )}
                            </div>
                            <div className="tp-rent-user-content">
                                <h5 className="tp-rent-user-content-title">{property.userName}</h5>
                                <span>{property.userRole}</span>
                            </div>
                        </div>
                        <div className="tp-rent-option d-flex">
                            <button>
                                <span><WishListSvg /></span>
                            </button>
                        </div>
                    </div>
                    {property.showTags && (
                        <div className="tp-rent-tags">
                            {property.isForRent === true ? <Link href="#">EN RENTA</Link> : ""} {" "}
                            {property.isFeatured === true ? <Link className="two" href="#">DESTACADA</Link> : ""}
                        </div>
                    )}
                </div>
                <div className="tp-rent-content">
                    <h4 className="tp-rent-title"><Link className="textline" href="#">{property.title}</Link></h4>
                    <p>{property?.address}</p>
                    <div
                        className="tp-rent-meta-list d-flex flex-column"
                        style={{ gap: "12px" }}
                    >
                        <div className="tp-rent-meta-item">
                            <div className="tp-rent-meta-content d-flex">
                                <span><BedroomsSvg /></span>
                                <p>{property.bedrooms}</p>
                            </div>
                            <p>Habitaciones</p>
                        </div>
                        <div className="tp-rent-meta-item">
                            <div className="tp-rent-meta-content d-flex">
                                <span><BathroomsSvg /></span>
                                <p>{property.bathrooms}</p>
                            </div>
                            <p>Baños</p>
                        </div>
                        <div className="tp-rent-meta-item">
                            <div className="tp-rent-meta-content d-flex">
                                <span><LivingSvg /></span>
                                <p>{property.livingArea}</p>
                            </div>
                            <p>Área construida</p>
                        </div>
                    </div>
                    <div className="tp-rent-btn-box d-flex justify-content-between align-items-center">
                        <div className="tp-rent-price">
                            <span>{formatPrice(property.price, true, property.moneda)}</span>
                        </div>
                        <div className="tp-rent-action-btn d-flex">
                            <div className="tp-action-btn">
                                <Link href={property.idPublic ? `/administrador/propiedades/editar/${property.idPublic}` : "#"}>
                                    <PropertyEditSvg />
                                </Link>
                            </div>
                            <div className={`tp-action-btn ${activePropertyId === property.id ? "active" : ""}`}>
                                <button className="click" onClick={() => handleActionToggle(property.id)}><MenuDotsSvg /></button>
                                <div className="tp-action-click-tooltip">
                                    {property.idPublic && (
                                        <Link
                                            href={`/administrador/propiedades/${property.idPublic}/resenas`}
                                            onClick={() => setActivePropertyId(null)}
                                        >
                                            <span><ReviewsSvg /></span>
                                            Ver reseña
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActivePropertyId(null);
                                            onDuplicateRequest?.(property);
                                        }}
                                    >
                                        <span><DuplicateIconSvg /></span>
                                        Duplicar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActivePropertyId(null);
                                            onDeleteRequest?.(property);
                                        }}
                                    >
                                        <span><DeleteIconSvg /></span>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
