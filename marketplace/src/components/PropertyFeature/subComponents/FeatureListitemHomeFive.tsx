import BathroomsSvg from "@/components/SVG/PropertySvg/BathroomsSvg";
import BedroomsSvg from "@/components/SVG/PropertySvg/BedroomsSvg";
import LivingSvg from "@/components/SVG/PropertySvg/LivingSvg";
import MapMarkerSvg from "@/components/SVG/PropertySvg/MapMarkerIcon";
import { formatPrice } from "@/components/Utils/formatPrice";
import { featuresProps } from "@/types/custom-interface";
import UserAvatarPlaceholder from "@/components/UI/UserAvatarPlaceholder";
import Image from "next/image";
import Link from "next/link";

export default function FeatureListitemHomeFive({item}:featuresProps) {
    return (
        <div className="tp-property-5-item d-flex">
            <div className="tp-property-5-thumb p-relative">
                <Link href={`/property-details-2/${item.id}`}><Image src={item.image} alt="property image" /></Link>
                <div className="tp-rent-tags">
                    <Link className="two" href="#">FEATURED</Link>
                </div>
            </div>
            <div className="tp-property-5-content w-100">
                <div className="tp-property-5-top d-flex justify-content-between align-items-center">
                    <div className="mb-20">
                        <h4 className="tp-property-5-price">{formatPrice(item.price, true)}<span>/month</span></h4>
                    </div>
                    <div className="tp-property-5-author d-flex mb-20">
                        <div className="tp-property-5-author-icon">
                            {item.userImage ? (
                                <Image src={item.userImage} alt="user image" />
                            ) : (
                                <UserAvatarPlaceholder size={48} />
                            )}
                        </div>
                        <div className="tp-property-5-author-content">
                            <h4 className="tp-property-5-author-title">{item.userName}</h4>
                            <span>{item.userRole}</span>
                        </div>
                    </div>
                </div>
                <div className="tp-property-5-heading">
                    <h3 className="tp-property-5-title"><Link href={`/property-details-2/${item.id}`}>{item.title}</Link></h3>
                    <p><MapMarkerSvg />
                        {item.address}</p>
                </div>
                <p>{item.description}</p>

                <div className="tp-property-5-meta-list d-flex justify-content-between align-items-center">
                    <div className="tp-property-5-meta-item">
                        <span>Bedrooms</span>
                        <div className="tp-property-5-meta-content d-flex">
                            <span><BedroomsSvg /></span>
                            <p>{item.bedrooms}</p>
                        </div>
                    </div>
                    <div className="tp-property-5-meta-item">
                        <span>Bathrooms</span>
                        <div className="tp-property-5-meta-content d-flex">
                            <span><BathroomsSvg /></span>
                            <p>{item.bathrooms}</p>
                        </div>
                    </div>
                    <div className="tp-property-5-meta-item">
                        <span>Square area</span>
                        <div className="tp-property-5-meta-content d-flex">
                            <span><LivingSvg /></span>
                            <p>{item.livingArea}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}