import priceShape from '../../../public/assets/img/testimonial/price-shape.png';
import PricingItem from './subComponents/PricingItem';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HomeTwoPricing() {
    return (
        <section className="tp-price-area pt-280">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-price-heading mb-50">
                            <span className="tp-section-title-pre">our pricing plan</span>
                            <h3 className="tp-section-title">Choose the right plan</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-7 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                        {/* Display pricing options with title, price, and discount */}
                        <PricingItem title="Primary" price="$99.00" discount="SAVE 20%" />
                        <PricingItem title="Popular" price="$199.00" discount="SAVE 30%" isActive />
                        <PricingItem title="Premium" price="$299.00" discount="SAVE 35%" />
                    </div>
                    <div className="col-lg-5">
                        <div className="tp-price-content p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                            <div className="tp-price-content-shape">
                                <Image src={priceShape} alt="price shape" />
                            </div>
                            <div className="tp-price-content-box">
                                <h3 className="tp-price-content-box-title">The most popular plan</h3>
                                <div className="tp-price-content-box-list">
                                    <ul>
                                        <li><span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                            <path d="M12.6364 1L4.63636 9L1 5.36364" stroke="#5758D6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg></span> Built-in chat, email, & phone</li>
                                        <li><span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                            <path d="M12.6364 1L4.63636 9L1 5.36364" stroke="#5758D6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg></span> AI-powered contact scoring</li>
                                        <li><span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                            <path d="M12.6364 1L4.63636 9L1 5.36364" stroke="#5758D6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg></span> Advanced reporting tools</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="tp-price-content-two" style={{ backgroundColor: "#F0F4FD" }}>
                                <Link href="/contact">Get Started</Link>
                                <span>Over sve 30%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}