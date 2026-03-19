"use client"
import heroBgImg from "../../../public/assets/img/hero/home-4/hero-4-thumb.png";
import HeroFourBannerTab from "./subComponents/HeroFourBannerTab";
import { propertyTypeOptions } from "@/data/dropdownData";
import StarSvg from "../SVG/StarSvg";

export default function HeroBannerFour() {
    const handleSelectChange = () => { };

    return (
        <section className="tp-hero-4-ptb tp-hero-4-hight p-relative" style={{ backgroundImage: `url(${heroBgImg.src})` }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="tp-hero-4-content">
                            <div className="tp-hero-4-heading text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                                <p>Get Started in Few Clicks</p>
                                <h3 className="tp-hero-4-heading-title">Real Estate Booking</h3>
                            </div>
                            <div className="tp-hero-4-tab p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                                <div className="row">
                                    <nav>
                                        <div className="tp-hero-4-tab-box d-flex justify-content-between align-items-center">
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <button className="nav-link" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Buy</button>
                                                <button className="nav-link active" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Rent</button>
                                                <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Sell</button>
                                            </div>
                                            <div className="tp-hero-4-tab-rating">
                                                <p><StarSvg /><StarSvg /><StarSvg /><StarSvg /><StarSvg />
                                                    4.8 Top rated by People
                                                </p>
                                            </div>
                                        </div>
                                    </nav>
                                     {/* Render HeroFourBannerTab in different tab panes */}
                                    <div className="tab-content" id="nav-tabContent">
                                        <div className="tab-pane fade" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                            <HeroFourBannerTab options={propertyTypeOptions} handleSelectChange={handleSelectChange} />
                                        </div>
                                        <div className="tab-pane fade show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                            <HeroFourBannerTab options={propertyTypeOptions} handleSelectChange={handleSelectChange} />
                                        </div>
                                        <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                                            <HeroFourBannerTab options={propertyTypeOptions} handleSelectChange={handleSelectChange} />
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
};
