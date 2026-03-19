import Link from "next/link";
import CountrySliderCard from "./subComponents/CountrySliderCard";
import ArrowPrevTwo from "../SVG/PropertySvg/ArrowPrevTwo";
import ArrowNextTwo from "../SVG/PropertySvg/ArrowNextTwo";

export default function CountriesAreaTwo() {
    return (
        <section className="tp-countries-5-ptb">
            <div className="container container-1500">
                <div className="tp-countries-5-bg pt-130 pb-130 fix">
                    <div className="row align-items-center">
                        <div className="col-lg-4">
                            <div className="tp-countries-heading mb-50">
                                <span className="tp-section-title-pre">FIND YOUR DREAM HOUSE</span>
                                <h3 className="tp-section-title">Explore cities</h3>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="tp-countries-5-content d-none d-xl-block mb-30">
                                <p>Lorem  ipsum dolor sit amet, consectetuer adipiscing <br />
                                    modo  ligula eget dolor. Aenean massa. Cum</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="tp-countries-5-box text-lg-end mb-50">
                                <button type="button" className="tp-countries-button-prev">
                                    <ArrowPrevTwo />
                                </button>
                                <button type="button" className="tp-countries-button-next">
                                    <ArrowNextTwo />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tp-countries-5-slider-wrapper mb-60 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                                <div className="tp-countries-active swiper">
                                    <div className="swiper-wrapper">
                                        {/* Reusable Slider Country Card */}
                                        <CountrySliderCard />
                                    </div>
                                </div>
                            </div>
                            <div className="tp-countries-5-btn text-center">
                                <p><span>Free</span>
                                    Let’s make something great work together. <Link href="/contact">Get Free Quote</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}