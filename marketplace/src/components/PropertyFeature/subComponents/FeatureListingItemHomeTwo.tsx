import { BathroomsSvg, BedroomsSvg } from "@/components/SVG";
import { formatPrice } from "@/components/Utils/formatPrice";
import { featuresProps } from "@/types/custom-interface";
import Image from "next/image";
import Link from "next/link";

export default function FeatureListingItemHomeTwo({ item }: featuresProps) {
    return (
        <div className="tp-listing-item">
            <div className="tp-listing-item-content">
                <h4 className="tp-listing-item-title"><Link className="textline" href={`/property-details-2/${item.id}`}>{item.title}</Link></h4>
                <div className="tp-listing-item-meta d-flex align-items-center">
                    <span>
                        <BedroomsSvg color="currentColor" />
                        {item.bathrooms} Bed</span>
                    <span>
                        <BathroomsSvg color="currentColor" />
                        {item.bathrooms} Baths</span>
                </div>
                <div className="tp-listing-item-btn-box d-flex justify-content-between">
                    <div className="tp-listing-item-price">
                        <span>{formatPrice(item.price, true)}</span>
                    </div>
                    <div className="tp-listing-item-btn">
                        <Link href="#">FOR SALE</Link>
                    </div>
                </div>
            </div>
            <div className="tp-listing-item-thumb p-relative">
                <Link href={`/property-details-2/${item.id}`}><Image src={item.image} alt="listing thumb" /></Link>
                <Link href={`/property-details-2/${item.id}`}><span>View</span></Link>
            </div>
        </div>
    )
}