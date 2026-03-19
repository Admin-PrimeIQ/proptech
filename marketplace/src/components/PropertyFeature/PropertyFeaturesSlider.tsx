"use client"
import PropertyFeatureSliderItem from "./subComponents/PropertyFeatureSliderItem";
import { propertyProps } from "@/types/property-d-t";
import { propertyData } from "@/data/propertyData";
import Link from "next/link";

// Import Swiper components and Scrollbar module
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";

export default function PropertyFeaturesSlider({ textAlign, columnClass, showBtn, textStart }: propertyProps) {
    return (
        <section className="tp-property-ptb fix p-relative pt-140 pb-110">
            <div className="container">
                <div className={`row ${textAlign}`}>
                    <div className={columnClass === true ? "col-lg-6 " : "col-lg-12"}>
                        <div className={`tp-property-heading ${textStart ? textStart : "text-center"} mb-30`}>
                            <span className="tp-section-title-pre">Propiedades Destacadas</span>
                            <h3 className="tp-section-title">Propiedades en alquiler</h3>
                        </div>
                    </div>
                    {
                        showBtn === true ?
                            <>
                                <div className="col-lg-6">
                                    <div className="tp-property-btn p-relative z-index-3 text-lg-end mb-30">
                                        <Link className="tp-btn" href="/propiedades">
                                            <span className="btn-wrap">
                                                <b className="text-1">Buscar Propiedad</b>
                                                <b className="text-2">Buscar Propiedad</b>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </>
                            :
                            ""
                    }
                    <div className="col-lg-12">
                        <div className="tp-property-slider-wrapper">
                            <Swiper
                                modules={[Scrollbar]}
                                loop={true}
                                slidesPerView={2}
                                spaceBetween={30}
                                grabCursor={true}
                                className=" tp-property-active"
                                breakpoints={{
                                    '1200': { slidesPerView: 2 },
                                    '992': { slidesPerView: 2 },
                                    '768': { slidesPerView: 2 },
                                    '576': { slidesPerView: 1 },
                                    '0': { slidesPerView: 1 },
                                }}
                                // scrollbar
                                scrollbar={{
                                    el: ".tp-scrollbar",
                                    draggable: true,
                                }}
                            >
                                {
                                    propertyData.slice(20,25).map((item) => (
                                        <SwiperSlide key={item.id}>
                                            <PropertyFeatureSliderItem item={item} />
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                            <div className="tp-scrollbar">
                                <div className="swiper-scrollbar-drag"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}