"use client"
import { usePropertyData } from "@/hooks/usePropertyData";
import propertyBgImg from "../../../public/assets/img/listing/listing-bg.png";
import PropertySingleCard from "../Common/PropertySingleCard";

// Import Swiper components and Navigation module
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function PropertyHomeFive() {
    const propertyData = usePropertyData();
    
    return (
        <section className="tp-listing-5-ptb pt-140 pb-110" style={{ backgroundImage: `url(${propertyBgImg.src})` }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-listing-heading text-center mb-50">
                            <span className="tp-section-title-pre">Propiedades Destacadas</span>
                            <h3 className="tp-section-title">Propiedades destacadas</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-listing-5-slider p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-rent-5-active swiper">
                                <Swiper
                                    modules={[Pagination]}
                                    slidesPerView={3}
                                    spaceBetween={30}
                                    loop={true}
                                    freeMode={true}
                                    breakpoints={{
                                        '1400': { slidesPerView: 3 },
                                        '1200': { slidesPerView: 3 },
                                        '768': { slidesPerView: 2 },
                                        '576': { slidesPerView: 1 },
                                        '0': { slidesPerView: 1 },
                                    }}
                                    pagination={{
                                        el: ".tp-rent-5-dot",
                                        clickable: true,
                                    }}
                                >
                                    {
                                        propertyData.slice(33,38).map((item) => (
                                            <SwiperSlide className="mb-30" key={item.id} >
                                                <PropertySingleCard item={item} />
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            </div>
                            <div className="tp-rent-5-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
