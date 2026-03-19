"use client"
import heroImg1 from "../../../public/assets/img/hero/home-3/hero-3-1.jpg";
import heroImg2 from "../../../public/assets/img/hero/home-3/hero-3-2.jpg";
import heroImg3 from "../../../public/assets/img/hero/home-3/hero-3-3.jpg";
import heroImg4 from "../../../public/assets/img/hero/home-3/hero-3-4.jpg";
import HeroThreeItem from "./subComponents/HeroThreeItem";
import { IBannerDT } from "@/types/custom-interface";
import ArrowPrevSvg from "../SVG/BannerSvg/ArrowPrevSvg";
import ArrowNextSvg from "../SVG/BannerSvg/ArrowNextSvg";

// Import Swiper components and effectFade, autoplay & navigation module
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";


const slides: IBannerDT[] = [
    {
        title: "Discover place",
        subtitle: "where want to live",
        bgImage: heroImg1,
    },
    {
        title: "Search and Find",
        subtitle: "Luxury House",
        bgImage: heroImg2,
    },
    {
        title: "Find Your Dream",
        subtitle: "House By Us",
        bgImage: heroImg3,
    },
    {
        title: "Discover place",
        subtitle: "where want to live",
        bgImage: heroImg4,
    },
];

export default function HeroBannerThree() {
    return (
        <div className="tp-hero-3-ptb">
            <div className="swiper tp-slider-active">
                <div className="swiper-wrapper">
                    <Swiper
                    modules={[Navigation, EffectFade, Autoplay]}
                        slidesPerView={1}
                        effect='fade'
                        loop={true}
                        autoplay={{
                            delay: 3500,
                        }}
                        // Navigation arrows
                        navigation={{
                            nextEl: '.hero-3-next',
                            prevEl: '.hero-3-prev',
                        }}
                    >
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                 <HeroThreeItem {...slide} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className="tp-hero-3-arrow-box">
                    <button type="button" className="hero-3-prev">
                       <ArrowPrevSvg/>
                    </button>
                    <button type="button" className="hero-3-next">
                       <ArrowNextSvg/>
                    </button>
                </div>
            </div>
        </div>
    );
}
