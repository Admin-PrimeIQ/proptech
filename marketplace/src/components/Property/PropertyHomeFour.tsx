"use client"
import PropertyItemHomeFour from "./subComponents/PropertyItemHomeFour";
import { propertyData } from "@/data/propertyData";
// Import Swiper components and Navigation module
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function PropertyHomeFour() {
    return (
        <section className="tp-rent-4-ptb p-relative pt-130 pb-140" style={{ backgroundColor: "#F0F4FD" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-rent-heading text-center mb-50">
                            <span className="tp-section-title-pre">Propiedades Destacadas</span>
                            <h3 className="tp-section-title">Propiedades en venta y alquiler</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container container-1600">
                <div className="row">
                    <div className="tp-rent-slider wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                        <div className="tp-rent-slider-active swiper">
                            <Swiper
                                modules={[Pagination]}
                                spaceBetween={30}
                                loop={true}
                                freeMode={true}
                                breakpoints={{
                                    '1400': { slidesPerView: 4 },
                                    '1200': { slidesPerView: 3 },
                                    '768': { slidesPerView: 2 },
                                    '576': { slidesPerView: 1 },
                                    '0': { slidesPerView: 1 },
                                }}
                                pagination={{
                                    el: ".tp-rent-slider-dot",
                                    clickable: true,
                                }}
                            >
                                {
                                    propertyData.slice(25, 30).map((item) => (
                                        <SwiperSlide key={item.id}>
                                            <PropertyItemHomeFour item={item}/>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}