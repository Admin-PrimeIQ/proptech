import newsLetterThumb from "../../../public/assets/img/newsletter/newsletter-thumb.png";
import newsLetterBg from "../../../public/assets/img/newsletter/newsletter-bg.jpg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HomeNewsletter() {
    return (
        <section
            className="tp-newsletter-area fix include-bg pt-140 pb-110"
            style={{ backgroundImage: `url(${newsLetterBg.src})` }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="tp-newsletter-wrap wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-newsletter-heading mb-40">
                                <h3 className="tp-section-title mb-30">Subscribe to our newsletter</h3>
                                <p>
                                    At the heart of each of our investments is a strategy to build or buy a
                                    portfolio of real estate property buying
                                </p>
                            </div>
                            <div className="tp-newsletter-input p-relative">
                                <input type="text" placeholder="Enter your email" />
                                <button className="tp-btn">Get Started</button>
                            </div>
                            <span>
                                By clicking Sign Up {`you're`} confirming that you agree with our <br />
                                <Link href="#"> Terms and Conditions.</Link>
                            </span>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="tp-newsletter-content p-relative wow fadeInRight" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-apartment-item d-flex align-items-center mb-30">
                                <div className="tp-apartment-item-icon">
                                    <Image src={newsLetterThumb} alt="Newsletter Thumbnail" />
                                </div>
                                <div className="tp-apartment-item-content">
                                    <h5 className="tp-apartment-item-title">
                                        <Link href="#">Apartments</Link>
                                    </h5>
                                    <p>From $56,000</p>
                                </div>
                            </div>
                            <div className="tp-newsletter-item">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                        <circle cx="10.8906" cy="10" r="10" fill="#5758D6" />
                                        <path
                                            d="M14.8906 7L9.39062 12.5L6.89062 10"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>{" "}
                                    Local Area Knowledge
                                </span>
                            </div>
                            <div className="tp-newsletter-item two">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                        <circle cx="10.8906" cy="10" r="10" fill="#5758D6" />
                                        <path
                                            d="M14.8906 7L9.39062 12.5L6.89062 10"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>{" "}
                                    Proven Expertise
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
