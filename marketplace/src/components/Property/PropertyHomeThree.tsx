"use client"
import { propertyData } from "@/data/propertyData";
import PropertySingleCardTwo from "../Common/PropertySingleCardTwo";
import {useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Import Swiper components and Pagination module
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function PropertyHomeThree() {
    //handle wishlist
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlistProducts);

    return (
        <section className="tp-listing-2-ptb pt-130 pb-110">
            <div className="container container-1600">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-listing-2-heading text-center mb-50">
                            <span className="tp-section-title-pre">Propiedades Destacadas</span>
                            <h3 className="tp-section-title">Propiedades en venta</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-rent-slider wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-rent-slider-active">
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
                                    {propertyData.slice(16,21).map((item) => {
                                        const isWishlisted = wishlist?.some((wishlistItem) => wishlistItem.id === item.id);
                                        return (
                                            <SwiperSlide key={item.id}>
                                                <PropertySingleCardTwo item={item} isWishlisted={isWishlisted}/>
                                            </SwiperSlide>
                                        );
                                    })
                                    }
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}