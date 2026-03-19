import ctaShape from "../../../public/assets/img/others/cta-shape.png";
import { HeadPhoneSvg } from "../SVG";
import Image from "next/image";
import Link from "next/link";

export default function CtaArea({wrapClass}:{wrapClass?:string}) {
    return (
        <div className={`p-relative ${wrapClass ? wrapClass : "tp-cta-ptb"}`}>
            <div className="container container-1320">
                <div className="tp-cta-bg">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tp-cta-content p-relative d-flex pt-70 pb-70">
                                <div className="tp-cta-shape"><Image src={ctaShape} alt="cta-image" /></div>
                                <div className="tp-cta-icon mr-30">
                                    <span><HeadPhoneSvg/></span>
                                </div>
                                <div className="tp-cta-content-contact">
                                    <p>Call for more info</p>
                                    <Link href="tel:555-0111">+999 34598 45678</Link>
                                </div>
                                <div className="tp-cta-content-text">
                                    <span>Let’s request a schedule for <br />
                                        free consultation</span> 
                                </div>
                                <div className="tp-cta-content-btn">
                                    <Link className="tp-btn" href="/contact">
                                        <span className="btn-wrap">
                                            <b className="text-1">Get in Touch</b>
                                            <b className="text-2">Get in Touch</b>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}