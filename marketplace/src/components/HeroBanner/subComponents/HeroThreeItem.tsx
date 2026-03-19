import { IBannerDT } from "@/types/custom-interface";
import Link from "next/link";

export default function HeroThreeItem({title, subtitle, bgImage}:IBannerDT) {
    return (
        <div className="tp-hero-3-item">
            <div className="container">
                <div className="row">
                    <div className="col-lg-10">
                        <div className="tp-hero-3-title-wrapper">
                            <div className="tp-hero-3-title-pre">
                                <div>
                                    <span>BEST REAL ESTATE COMPANY IN YOUR CITY</span>
                                </div>
                            </div>
                            <div className="tp-hero-3-title">
                                <div><span>{title}</span></div>
                                <div><span>{subtitle}</span></div> 
                            </div>
                        </div>
                        <div className="tp-hero-3-button-wrapper">
                            <Link className="tp-btn" href="/about">
                                Discover More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tp-hero-3-bg" style={{ backgroundImage: `url(${bgImage.src})` }}></div>
        </div>
    )
}
