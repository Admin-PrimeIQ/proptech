"use client"
import propertyImg1 from "../../../../../public/assets/img/property/property-details-1/property-thumb-1.jpg"
import propertyImg2 from "../../../../../public/assets/img/property/property-details-1/property-thumb-2.jpg"
import propertyImg3 from "../../../../../public/assets/img/property/property-details-1/property-thumb-3.jpg"

import Image from "next/image";
// Import Swiper components and Scrollbar module
import { Swiper, SwiperSlide } from "swiper/react";
import useGlobalContext from "@/hooks/useContext";

const sliderImage = [
    { id: 1, image: propertyImg1 },
    { id: 2, image: propertyImg2 },
    { id: 3, image: propertyImg3 },
    { id: 4, image: propertyImg1 },
    { id: 5, image: propertyImg2 },
]

export default function PropertyDetailsSlider() {
    const {handleMouseEnter,handleMouseLeave} = useGlobalContext();

    return (
        <>
            <div className="tp-property-details-slider tp-cursor-point-area" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="tp-property-details-one swiper">
                    <div className="swiper-wrapper">
                        <Swiper
                            spaceBetween={30}
                            loop={true}
                            breakpoints={{
                                '1400': { slidesPerView: 3 },
                                '1200': { slidesPerView: 3 },
                                '768': { slidesPerView: 2 },
                                '576': { slidesPerView: 1 },
                                '0': { slidesPerView: 1 },
                            }}
                        >
                            {
                                sliderImage.map((item) => (
                                    <SwiperSlide key={item.id}>
                                        <div className="tp-property-details-slider-thumb">
                                            <Image src={item.image} alt="property image" />
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}