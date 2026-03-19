"use client"
import Image from "next/image";
import authorImg from "../../../public/assets/img/testimonial/author-image.png";
import startIcon from "../../../public/assets/img/testimonial/star_icon-2.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

interface ArrowButtonProps {
    direction: 'prev' | 'next';
}

const TestimonialArrowButton: React.FC<ArrowButtonProps> = ({ direction }) => (
    <button type="button" className={`tp-testimonial-button-${direction}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d={direction === 'prev' ? 'M5.48075 11L1.36458 6.88384C0.878472 6.39773 0.878472 5.60227 1.36458 5.11616L5.48075 1' : 'M1.51925 11L5.63542 6.88384C6.12153 6.39773 6.12153 5.60227 5.63542 5.11616L1.51925 1'}
                stroke="white" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </button>
);

const testimonials = [
    {
        text: `Vulputate sapien nec sagittis aliquam malesuada 
               bibendum arcu vitae elementum. Turpis egesta 
               pretium aenean pharetra magna ac. Blandit 
               massa enim nec dui nunc. Magnis`,
        author: 'Lana Reymond',
    },
    {
        text: `Vulputate sapien nec sagittis aliquam malesuada 
               bibendum arcu vitae elementum. Turpis egesta 
               pretium aenean pharetra magna ac. Blandit 
               massa enim nec dui nunc. Magnis`,
        author: 'Lana Reymond',
    }
];

export default function HomeTwoTestimonial() {
    return (
        <div className="tp-testimonial-area pt-130 pb-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div
                            className="tp-testimonial-2-heading wow fadeInLeft"
                            data-wow-duration="1s"
                            data-wow-delay=".3s"
                        >
                            <div className="tp-testimonial-review-box d-flex align-items-center">
                                <span>4.82</span>
                                <div className="tp-testimonial-review-star">
                                    <Image src={startIcon} alt="Star Icon" />
                                    <p>Client reviews</p>
                                </div>
                            </div>
                            <Image src={authorImg} alt="Author Image" />
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div
                            className="tp-testimonial-2-slider p-relative wow fadeInRight"
                            data-wow-duration="1s"
                            data-wow-delay=".3s"
                        >
                            <div className="tp-tesmimonial-2-active swiper">
                                <div className="swiper-wrapper">
                                    <Swiper
                                        modules={[Navigation]}
                                        slidesPerView={1}
                                        spaceBetween={30}
                                        loop={true}
                                        navigation={{
                                            nextEl: ".tp-testimonial-button-next",
                                            prevEl: ".tp-testimonial-button-prev",
                                        }}
                                    >
                                        {testimonials.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="tp-testimonial-2-item">
                                                    <p>{item.text}</p>
                                                    <span>{item.author}</span>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                            <div className="tp-testimonial-2-arrow-box">
                                <TestimonialArrowButton direction="prev" />
                                <TestimonialArrowButton direction="next" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
