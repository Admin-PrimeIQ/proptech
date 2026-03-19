"use client"
import FeatureListingItemHomeTwo from "./subComponents/FeatureListingItemHomeTwo";
import ArrowPrevTwo from "../SVG/PropertySvg/ArrowPrevTwo";
import ArrowNextTwo from "../SVG/PropertySvg/ArrowNextTwo";
import { propertyData } from "@/data/propertyData";

// Import Swiper components and Navigation module
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";


export default function FeaturedPropertyListHomeTwo() {
    return (
        <section className="tp-listing-area fix pb-140">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <div className="tp-listing-heading mb-50">
                            <span className="tp-section-title-pre">Propiedades Destacadas</span>
                            <h3 className="tp-section-title">Propiedades en venta y alquiler</h3>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="tp-listing-arrow-box text-start text-lg-end">
                            <button type="button" className="tp-listing-button-prev"><ArrowPrevTwo/></button>
                            <button type="button" className="tp-listing-button-next"><ArrowNextTwo/> </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-listing-slider-wrapper wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-listing-active swiper">
                                    <Swiper
                                        modules={[Navigation]}
                                        spaceBetween={30}
                                        loop={true}
                                        breakpoints={{
                                            '1400': { slidesPerView: 4 },
                                            '1200': { slidesPerView: 4 },
                                            '992': { slidesPerView: 3 },
                                            '768': { slidesPerView: 2 },
                                            '0': { slidesPerView: 1 },
                                        }}
                                        navigation={{
                                            nextEl: ".tp-listing-button-next",
                                            prevEl: ".tp-listing-button-prev",
                                        }}>
                                        {
                                            propertyData.slice(8,13).map((item) => (
                                                <SwiperSlide key={item.id}>
                                                    <FeatureListingItemHomeTwo item={item}/>
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}