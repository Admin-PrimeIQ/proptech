import realStateImg from "../../../public/assets/img/rent/about/real-state.jpg";
import BathroomsSvg from "../SVG/PropertySvg/BathroomsSvg";
import { RentMetaItemProps } from "@/types/property-d-t";
import BedroomsSvg from "../SVG/PropertySvg/BedroomsSvg";
import LivingSvg from "../SVG/PropertySvg/LivingSvg";
import { formatPrice } from "../Utils/formatPrice";
import Image from "next/image";
import Link from "next/link";

const RentMetaItem: React.FC<RentMetaItemProps> = ({ icon, value, label }) => (
    <div className="tp-rent-meta-item">
        <div className="tp-rent-meta-content d-flex">
            <span>{icon}</span>
            <p>{value}</p>
        </div>
        <p>{label}</p>
    </div>
);

const metaItems: RentMetaItemProps[] = [
    { icon: <BedroomsSvg />, value: "05", label: "Bedrooms" },
    { icon: <BathroomsSvg />, value: "03", label: "Bathrooms" },
    { icon: <LivingSvg />, value: "360m2", label: "Living Area" },
];

export default function RealestateAboutArea() {
    return (
        <section className="tp-realstate-ptb pt-120 pb-140">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-realstate-heading text-center mb-40">
                            <h3 className="tp-section-title">
                                Cómo hacemos esto fácil para ti
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="tp-realstate-thumb p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                        <Image src={realStateImg} alt="image" />
                        <div className="tp-realstate-box wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                            <div className="tp-rent-item p-relative">
                                <div className="tp-rent-content">
                                    <h4 className="tp-rent-title">
                                        <Link className="textline" href="/property-details-2">Comfortable villa green</Link>
                                    </h4>
                                    <p>984 Monore abh, melbourn</p>
                                    <div className="tp-rent-meta-list d-flex justify-content-between align-items-center">
                                        {metaItems.map((item, index) => (
                                            <RentMetaItem key={index} {...item} />
                                        ))}
                                    </div>
                                    <div className="tp-rent-btn-box d-flex justify-content-between align-items-center">
                                        <div className="tp-rent-btn">
                                            <Link className="tp-btn" href="/property-details-2">View Details</Link>
                                        </div>
                                        <div className="tp-rent-price">
                                            <span>{formatPrice(8500, true)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
