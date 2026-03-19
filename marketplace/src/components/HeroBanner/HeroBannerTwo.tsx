
import heroSignature from "../../../public/assets/img/hero/home-2/hero-signature.png";
import heroTwoThumb from "../../../public/assets/img/hero/home-2/hero-2-thumb.jpg";
import homeTwoBg from "../../../public/assets/img/hero/home-2/hero-2-bg.jpg";
import HomeTwoHeroSearchBox from "./subComponents/HomeTwoHeroSearchBox";
import RactangleArrowSvg from "../SVG/BannerSvg/RactangleArrowSvg";
import Image from "next/image";
import Link from "next/link";

export default function HeroBannerTwo() {
    return (
        <section className="tp-hero-2-ptb tp-hero-2-hight pt-285 p-relative" style={{ backgroundImage: `url(${homeTwoBg.src})` }}>
            <div className="container container-custom">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="tp-hero-2-content p-relative z-index-1">
                            <div className="tp-hero-2-heading mb-50 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                                <h3 className="tp-hero-2-title">Modern
                                    Apartment</h3>
                                <p>At the heart of each of our investments is a strategy to build or buy a <br />
                                    portfolio of real estate company building</p>
                            </div>
                            <div className="tp-hero-2-tab p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                                <div className="row">
                                    <nav>
                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                            <button className="nav-link" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Buy</button>
                                            <button className="nav-link active" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Rent</button>
                                            <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Sale</button>
                                        </div>
                                    </nav>
                                     {/* Render HomeTwoHeroSearchBox in different tab panes */}
                                    <div className="tab-content" id="nav-tabContent">
                                        <div className="tab-pane fade" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                            <HomeTwoHeroSearchBox />
                                        </div>
                                        <div className="tab-pane fade show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                            <HomeTwoHeroSearchBox />
                                        </div>
                                        <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                                            <HomeTwoHeroSearchBox />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="tp-hero-2-thumb">
                            <Image src={heroTwoThumb} alt="hero thumb" />
                        </div>
                        <div className="tp-hero-2-wrap wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            <span className="tp-hero-2-wrap-btn">
                                <Link href="#"><RactangleArrowSvg/></Link>
                            </span>
                            <div className="tp-hero-2-wrap-sign">
                                <Image src={heroSignature} alt="hero signature" />
                            </div>
                            <h4 className="tp-hero-2-wrap-title">We are world <br />
                                class real estate <br />
                                company</h4>
                        </div>
                        <div className="tp-hero-2-text-rotate">
                            <h5 className="tp-hero-2-text-rotate-title">BHUMI REAL ESTATE AGENCY</h5>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}