"use client"
import brandThumb1 from "../../../public/assets/img/brand/home-4/brand-thumb-1.png";
import brandThumb2 from "../../../public/assets/img/brand/home-4/brand-thumb-2.png";
import brandThumb3 from "../../../public/assets/img/brand/home-4/brand-thumb-4.png";
import brandThumb4 from "../../../public/assets/img/brand/home-4/brand-thumb-5.png";
import Image from "next/image";

// Import Swiper components and Autoplay module
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Brand logo images used in the Swiper slider
const brandSliderImg = [
    { id: 1, image: brandThumb1 },
    { id: 2, image: brandThumb2 },
    { id: 3, image: brandThumb3 },
    { id: 4, image: brandThumb4 },
    { id: 5, image: brandThumb3 },
    { id: 6, image: brandThumb2 },
]

export default function BrandAreaThree() {
    return (
        <div className="tp-brand-4-ptb pt-130 pb-130">
            <div className="container">
                <div className="row">
                    <div className="tp-brand-slider">
                        <div className="tp-brand-active swiper">
                            <div className="swiper-wrapper slider-transtion d-flex align-items-center">
                                {/* Smooth auto-looping slider for brand logos */}
                                <Swiper
                                    modules={[Autoplay]}
                                    loop={true}
                                    freeMode={true}
                                    slidesPerView='auto'
                                    spaceBetween={90}
                                    centeredSlides={false}
                                    allowTouchMove={false}
                                    speed={2000}
                                    autoplay={{
                                        delay: 1,
                                        disableOnInteraction: true,
                                    }}
                                >
                                    {
                                        brandSliderImg.map((item) => (
                                            <SwiperSlide key={item.id}>
                                                <div className="tp-brand-4-item">
                                                    <Image src={item.image} alt="brand image" />
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
    )
}