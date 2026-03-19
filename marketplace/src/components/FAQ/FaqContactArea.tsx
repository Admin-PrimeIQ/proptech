import faqContactBg from "../../../public/assets/img/apartment/faq-contact.jpg";
import Link from "next/link";

export default function FaqContactArea() {
    return (
        <section className="tp-faq-contact-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-faq-inner-contact-wrap pl-80 pt-95 pb-90" style={{ backgroundImage: `url(${faqContactBg.src})` }}>
                            <div className="tp-faq-inner-contact-heading">
                                <h4 className="tp-section-title">What are you looking <br />
                                    for real estate?</h4>
                                <p>Whether you’re looking for a single-family <br />
                                    high-rise apartment</p>
                                <div className="tp-faq-inner-contact-btn">
                                    <Link className="tp-btn" href="/contact">
                                        <span className="btn-wrap">
                                            <b className="text-1">Contact Us</b>
                                            <b className="text-2">Contact Us</b>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}