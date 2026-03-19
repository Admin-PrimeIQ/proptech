import image from "../../../public/assets/img/awards/get-in-touch.jpg";
import SendMessageIcon from "../SVG/ContactSvg/SendMessageIcon";
import EmailTwoSvg from "../SVG/ContactSvg/EmailTwoSvg";
import { CallTwoSvg } from "../SVG/ContactSvg/CallTwoSvg";
import Link from "next/link";
import React from "react";

const ContactHomeFour = () => {
    return (
        <section className="tp-touch-ptb include-bg pt-120" style={{ backgroundImage: `url(${image.src})` }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-touch-heading">
                            <span className="tp-section-title-pre">Get in touch with us</span>
                            <h3 className="tp-section-title">Looking for partnership <br /> contact us.</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-7"></div>
                    <div className="col-lg-5">
                        <div className="tp-touch-box wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-touch-box-heading d-flex justify-content-between">
                                <span>Send Message</span>
                                <span><SendMessageIcon /></span>
                            </div>
                            <div className="tp-touch-box-content">
                                <div className="tp-touch-box-content-item">
                                    <span><EmailTwoSvg /></span>
                                    <Link href="mailto:infobhumi@gmail.com">infobhumi@gmail.com</Link>
                                </div>
                                <div className="tp-touch-box-content-item">
                                    <span><CallTwoSvg /></span>
                                    <Link href="tel:25663">(999) 3456 3456 3456</Link>
                                </div>
                                <div className="tp-touch-box-content-item">
                                    <p>View on maps</p>
                                    <Link href="#">21 Valentin Paterson, Road 24, London, UK</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactHomeFour;
