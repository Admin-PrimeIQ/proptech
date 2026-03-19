import propertyImg1 from "../../../../../public/assets/img/rent/property/recent-1.jpg";
import propertyImg2 from "../../../../../public/assets/img/rent/property/recent-2.jpg";
import propertyImg3 from "../../../../../public/assets/img/rent/property/recent-3.jpg";
import { IRecentlyViewedItem } from "@/types/custom-interface";
import Image from "next/image";
import Link from "next/link";

const properties: IRecentlyViewedItem[] = [
    {
        image: propertyImg1,
        link: "/property-details-2",
        title: "You know the way out of it and talking over",
        price: "$2200/mo",
    },
    {
        image: propertyImg2,
        link: "/property-details-2",
        title: "You know the way out of it and talking over",
        price: "$2200/mo",
    },
    {
        image: propertyImg3,
        link: "/property-details-2",
        title: "You know the way out of it and talking over",
        price: "$2200/mo",
    },
];

export default function RecentlyViewedProperties() {
    return (
        <div className="tp-property-filter-wrap mb-40">
            <h4 className="tp-team-details-item-title">Recently viewed</h4>
            {properties.map((property, index) => (
                <div className="tp-property-recent-post d-flex align-items-center mb-30" key={index}>
                    <div className="tp-property-recent-post-thumb mr-15">
                        <Link href={property.link}>
                            <Image src={property.image} alt="property image" />
                        </Link>
                    </div>
                    <div className="tp-property-recent-post-content">
                        <h3 className="tp-property-recent-post-title">
                            <Link href={property.link}>{property.title}</Link>
                        </h3>
                        <div className="tp-property-recent-post-meta">
                            <span>{property.price}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

