import faqContactImg from "../../../public/assets/img/apartment/faq-contact-2.jpg";
import StarSvg from "../SVG/StarSvg";
import Image from "next/image";
import Link from "next/link";

export default function FaqPropertyArea() {
    return (
        <section className="tp-faq-inner-property pt-100 pb-120">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5">
                        <div className="tp-faq-inner-property-thumb p-relative wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".3s">
                            <Image src={faqContactImg} style={{width:"100%", height:"auto"}} alt="image" />
                            <div className="tp-about-4-thumb-box faq">
                                <h4 className="tp-about-4-thumb-title">4.9</h4>
                                <span><StarSvg /><StarSvg /><StarSvg /><StarSvg /><StarSvg /></span>
                                <p>Trust score</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7">
                        <div className="tp-faq-inner-property-heading wow fadeInRight" data-wow-duration="1s" data-wow-delay=".3s">
                            <h3 className="tp-section-title">Ready to find your <br />
                                dream home</h3>
                            <p>Online property marketplace to buy, sell, and rent residential and <br />
                                rcial properties. Used by millions of renters to find property.
                            </p>
                            <Link className="tp-btn" href="/contact">
                                <span className="btn-wrap">
                                    <b className="text-1">Get Started</b>
                                    <b className="text-2">Get Started</b>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}