"use client"
import Image from "next/image";
import slideImg1 from "../../../public/assets/img/hero/slider/slider-1-thumb.jpg";
import slideImg2 from "../../../public/assets/img/hero/slider/slider-2-thumb.jpg";
import slideImg3 from "../../../public/assets/img/hero/slider/slider-3-thumb.jpg";
// Import Swiper components and Autoplay module
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

const slideImages = [
    { id: 1, image: slideImg1 },
    { id: 2, image: slideImg2 },
    { id: 3, image: slideImg3 },
    { id: 4, image: slideImg2 },
]

export default function ImageSlideArea() {
    return (
        <div className="tp-slider-image-ptb fix pb-140">
            <div className="container-fulid gx-0">
                <div className="row gx-0">
                    <div className="col-lg-12">
                        <div className="tp-slider-image-wrapper">
                            <div className="tp-slider-image-active swiper">
                                <div className="swiper-wrapper">
                                    {/* Swiper carousel with autoplay and responsive slides */}
                                    <Swiper
                                        modules={[Autoplay]}
                                        loop={true}
                                        slidesPerView={3}
                                        spaceBetween={30}
                                        grabCursor={true}
                                        autoplay={{
                                            delay: 3500,
                                        }}
                                        breakpoints={{
                                            '1200': { slidesPerView: 3 },
                                            '992': { slidesPerView: 2 },
                                            '768': { slidesPerView: 2 },
                                            '576': { slidesPerView: 1 },
                                            '0': { slidesPerView: 1 },
                                        }}
                                    >
                                        {
                                            slideImages.map((item) => (
                                                <SwiperSlide key={item.id}>
                                                    <div className="tp-slider-image-thumb">
                                                        <Image src={item.image} alt="thumb image" />
                                                    </div>
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}