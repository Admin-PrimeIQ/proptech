"use client";
import Link from "next/link";
import offerBgImg from "../../../public/assets/img/offer/offer-bg.png";
import offerThumb1 from "../../../public/assets/img/offer/offer-thumb-1.jpg";
import offerThumb2 from "../../../public/assets/img/offer/offer-thumb-2.jpg";
import offerThumbIcon from "../../../public/assets/img/offer/offer-thumb-icon.svg";
import Image, { StaticImageData } from "next/image";
import Slider from "react-slick";

interface ISlidesData {
    imgSrc: StaticImageData;
    title: string;
    description: React.ReactNode;
}
// Slides data for displaying offer steps with image, title, and rich description
const slides: ISlidesData[] = [
    {
        imgSrc: offerThumb1,
        title: "Offer and negotiations",
        description: <>At the heart of each of our investments is a strategy to build or buy a
            portfolio of real estate <span>12+ years of experience</span> a specific user
            group. We believe that by doing this well we create better
            outcomes, not only for our investors, but for society as a
            whole. Matter invests in companies.</>
    },
    {
        imgSrc: offerThumb2,
        title: "Contract finalization",
        description: <>At the heart of each of our investments is a strategy to build or buy a
            portfolio of real estate <span>12+ years of experience</span> a specific user
            group. We believe that by doing this well we create better
            outcomes, not only for our investors, but for society as a
            whole. Matter invests in companies.</>
    },
    {
        imgSrc: offerThumb1,
        title: "Property search and selection",
        description: <>At the heart of each of our investments is a strategy to build or buy a
            portfolio of real estate <span>12+ years of experience</span> a specific user
            group. We believe that by doing this well we create better
            outcomes, not only for our investors, but for society as a
            whole. Matter invests in companies.</>
    }
];

export default function OfferArea() {
    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        fade: true,
    };

    return (
        <section className="tp-offer-ptb p-relative include-bg pt-130 pb-110"
            style={{ backgroundImage: `url(${offerBgImg.src})` }}>
            {/* Render offer slider section with dynamic slide content */}
            <Slider {...settings} className="tp-offer-active slider">
                {slides.map((item, index) => (
                    <div key={index} className="slide-item">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="tp-offer-thumb image-anime wow fadeInLeft">
                                        <Image src={item.imgSrc} alt="Offer" />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="tp-offer-content pt-60 wow fadeInRight">
                                        <Image className="mb-30" src={offerThumbIcon} alt="Icon" />
                                        <h3 className="tp-section-title">{item.title}</h3>
                                        <p>{item.description}</p>
                                        <div className="tp-offer-btn">
                                            <Link className="textline" href="/about">Learn More <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                    <path d="M1.00098 7H13.001" stroke="#262B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M7.00098 1L13.001 7L7.00098 13" stroke="#262B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}
