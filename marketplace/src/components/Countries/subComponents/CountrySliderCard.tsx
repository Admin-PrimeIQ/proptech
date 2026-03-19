"use client"
import { ArrowSvgTwo, CheckTwoSvg } from "@/components/SVG";
import countriesData from "@/data/countriesData";
import Image from "next/image";
import Link from "next/link";

// Import Swiper components and Navigation module
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export default function CountrySliderCard() {
    return (
        <Swiper
            modules={[Navigation]}
            slidesPerView={3}
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
                nextEl: ".tp-countries-button-next",
                prevEl: ".tp-countries-button-prev",
            }}
        >
            {/* Mapping over countriesData to render country items in SwiperSlide */}
            {countriesData.map((country) => (
                <SwiperSlide key={country.id}>
                    <div className="tp-countries-item">
                        <div className="tp-countries-thumb p-relative">
                            <Image style={{ width: "100%", height: "auto" }} src={country.image} alt={country.name} />
                            <div className="tp-countries-tag">
                                <span>
                                    <CheckTwoSvg />
                                    {" "}
                                    {country.tag}
                                </span>
                            </div>
                            <div className="tp-countries-box">
                                <div className="tp-countries-content">
                                    <h4 className="tp-countries-title">
                                        <Link href={country.link}>{country.name}</Link>
                                    </h4>
                                    <p>{country.properties} Property</p>
                                    <div className="tp-countries-btn">
                                        <Link className="tp-btn" href={country.link}>
                                            All Properties
                                            <span><ArrowSvgTwo /></span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}