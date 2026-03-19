"use client"
import CountrySliderCard from "./subComponents/CountrySliderCard";

export default function CountriesArea() {
    return (
        <section className="tp-countries-ptb fix pt-130 pb-130">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-countries-heading mb-50">
                            <span className="tp-section-title-pre">FIND YOUR DREAM HOUSE</span>
                            <h3 className="tp-section-title">We are available in many countries</h3>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div
                            className="tp-countries-slider-wrapper wow fadeInUp"
                            data-wow-duration="1s"
                            data-wow-delay=".3s"
                        >
                            <div className="tp-countries-active">
                                {/* Reusable Slider Country Card */}
                                <CountrySliderCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}