"use client"
import FeatureListitemHomeFive from "./subComponents/FeatureListitemHomeFive";
import ArrowPrevTwo from "../SVG/PropertySvg/ArrowPrevTwo";
import ArrowNextTwo from "../SVG/PropertySvg/ArrowNextTwo";
import { propertyData } from "@/data/propertyData";
import Link from "next/link";

// Import Swiper components and Scrollbar module
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export default function PropertyFeatureListHomeFive() {

    return (
        <section className="tp-property-5-ptb pb-140 p-relative fix">
            <div className="container">
                <div className="row align-items-end">
                    <div className="col-lg-6">
                        <div className="tp-property-5-wrap mb-30">
                            <span className="tp-section-title-pre">Propiedades Destacadas</span>
                            <h3 className="tp-section-title">Propiedades en venta</h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-property-5-arrow-box text-lg-end mb-30">
                            <button type="button" className="tp-property-button-prev"><ArrowPrevTwo /></button>
                            <button type="button" className="tp-property-button-next"><ArrowNextTwo /></button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-property-5-slider pb-70">
                            <Swiper
                                modules={[Navigation]}
                                loop={true}
                                spaceBetween={20}
                                grabCursor={true}
                                breakpoints={{
                                    '1200': { slidesPerView: 2 },
                                    '992': { slidesPerView: 1 },
                                    '768': { slidesPerView: 1 },
                                    '576': { slidesPerView: 1 },
                                    '0': { slidesPerView: 1 },
                                }}
                                className="tp-property-5-active"
                                navigation={{
                                    nextEl: ".tp-property-button-next",
                                    prevEl: ".tp-property-button-prev",
                                }}
                            >
                                {
                                    propertyData.slice(38, 41).map((item) => (
                                        <SwiperSlide key={item.id}>
                                            <FeatureListitemHomeFive item={item} />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                        <div className="tp-property-5-bottom text-center">
                            <Link className="tp-btn" href="/propiedades">
                                <span className="btn-wrap">
                                    <b className="text-1">Ver todas las Propiedades</b>
                                    <b className="text-2">Ver todas las Propiedades</b>
                                </span></Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}