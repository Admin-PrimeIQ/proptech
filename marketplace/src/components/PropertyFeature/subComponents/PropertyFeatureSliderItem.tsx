import BathsroomTwoSvg from "@/components/SVG/PropertySvg/BathsroomTwoSvg";
import BedroomsTwoSvg from "@/components/SVG/PropertySvg/BedroomsTwoSvg";
import LivingTwoSvg from "@/components/SVG/PropertySvg/LivingTwoSvg";
import { formatPrice } from "@/components/Utils/formatPrice";
import { featuresProps } from "@/types/custom-interface";
import Image from "next/image";
import Link from "next/link";

export default function PropertyFeatureSliderItem({item}:featuresProps) {
    return (
        <div className="tp-property-item d-flex justify-content-between align-items-center">
            <div className="tp-property-content">
                <h4 className="tp-property-title"><Link href={`/property-details-2/${item.id}`}>{item.title}</Link></h4>
                <p>{item.address}</p> 
                <span className="tp-property-usd">{`${formatPrice(item.price, true)}USD/mo`}</span>
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
            <div className="tp-property-thumb p-relative">
                <Link href={`/property-details-2/${item.id}`}><Image src={item.image} alt="property thumb" /></Link>
                <span className="tp-property-tag">FOR RENT</span>
            </div>
        </div>
    )
}