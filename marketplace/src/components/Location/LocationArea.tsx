import RactangleArrowSvg from "../SVG/BannerSvg/RactangleArrowSvg";
import { location_home_two_data } from "@/data/locationData";
import Image from "next/image";
import Link from "next/link";

export default function LocationArea({ ptClass = "pt-130", headingClass = "tp-location-heading", itemClass = "", bgColor="#F0F4FD" }) {
    return (
        <section className={`tp-location-area ${ptClass} pb-120`} style={{ backgroundColor: bgColor }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className={`${headingClass} text-center mb-50`}>
                            <h3 className="tp-section-title">Find the right location</h3>
                        </div>
                    </div>
                    {
                        location_home_two_data.map((item) => (
                            <div className="col-lg-6" key={item.id}>
                                <div className={`tp-location-item ${itemClass} p-relative mb-10 d-flex align-items-center wow fadeInUp`} data-wow-duration="1s" data-wow-delay=".3s">
                                    <div className="tp-location-item-thumb">
                                        <Link href="/propiedades"><Image style={{ width: "100%", height: "auto" }} src={item.image} alt="location thumb" /></Link>
                                    </div>
                                    <div className="tp-location-item-content">
                                        <h4 className="tp-location-item-title"><Link href="/propiedades">{item.title}</Link></h4>
                                        <span>{item.property} Property</span>
                                    </div>
                                    <div className="tp-location-item-btn">
                                        <Link href="/propiedades"><span><RactangleArrowSvg color="#5758D6"/></span></Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}