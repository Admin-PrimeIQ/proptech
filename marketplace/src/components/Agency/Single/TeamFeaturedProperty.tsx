import { BathroomsSvg, BedroomsSvg, LivingSvg, } from "@/components/SVG";
import rentThumb from "../../../../public/assets/img/rent/rent-thumb-1.jpg";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedProperty() {
    return (
        <div className="tp-team-details-widget mb-40">
            <div className="tp-team-details-item">
                <h4 className="tp-team-details-item-title">Featured properties</h4>
                <div className="tp-rent-thumb p-relative">
                    <Link href="#">
                        <Image style={{width:"100%", height:"auto"}} src={rentThumb} alt="image" />
                    </Link>
                    <div className="tp-rent-tags">
                        <Link href="#">FOR RENT</Link>
                    </div>
                    <div className="tp-rent-user-wrap d-flex align-items-center justify-content-between">
                        <div className="tp-rent-user d-flex align-items-center">
                            <div className="tp-rent-user-content">
                                <h5 className="tp-rent-user-content-title">Luxury villa texas</h5>
                                <span>$8,50,000</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tp-rent-meta-list team-details d-flex justify-content-between align-items-center">
                    {[{ icon: BedroomsSvg, text: "05 Bed" },
                    { icon: BathroomsSvg, text: "04 Baths" },
                    { icon: LivingSvg, text: "1500 sq" }].map((item, idx) => (
                        <div className="tp-rent-meta-item" key={idx}>
                            <div className="tp-rent-meta-content d-flex">
                                <span><item.icon /></span>
                            </div>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
