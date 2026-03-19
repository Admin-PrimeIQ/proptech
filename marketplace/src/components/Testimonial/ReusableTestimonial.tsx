"use client"
import Link from "next/link";
import { testimonial_three_data } from "@/data/testimonialData";
import TestimonialItem from "./subComponents/TestimonialItem";

// Import Swiper components module
import { Swiper, SwiperSlide } from "swiper/react";

export default function ReusableTestimonial() {
    return (
        <section className="tp-testimonial-3-ptb pt-130" style={{ backgroundColor: "#262B35" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-testimonial-3-heading text-center mb-50">
                            <h3 className="tp-section-title">25,000+ Happy customers</h3>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="tp-testimonial-3-slide-warpper mb-60 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-testimonial-3-active swiper">
                                <div className="swiper-wrapper">
                                    <Swiper
                                        slidesPerView={2}
                                        spaceBetween={30}
                                        loop={true}
                                        breakpoints={{
                                            '1400': { slidesPerView: 2 },
                                            '1200': { slidesPerView: 2 },
                                            '992': { slidesPerView: 2 },
                                            '768': { slidesPerView: 1 },
                                            '0': { slidesPerView: 1 },
                                        }}
                                    >
                                        {testimonial_three_data.map((testimonial, index) => (
                                            <SwiperSlide key={testimonial.id}>
                                                <TestimonialItem key={index} {...testimonial} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="tp-testimonial-3-btn text-center">
                            <span>Let’s make something great work together. <Link href="#">Got a project in mind?</Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}
