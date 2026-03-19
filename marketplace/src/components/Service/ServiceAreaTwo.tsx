import { HeadPhoneBigSvg, ServiceSvgFour, ServiceSvgOne, ServiceSvgThree, ServiceSvgTwo } from "../SVG";
import progressThumb from "../../../public/assets/img/listing/home-3/progress-thumb-2.png";
import serviceThumb from "../../../public/assets/img/service/service-5-thumb.jpg";
import authorImg from "../../../public/assets/img/rent/home-5/author.png";
import StarSvg from "../SVG/StarSvg";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

interface ServiceItemProps {
    icon: JSX.Element;
    text: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon, text }) => (
    <div className="tp-service-5-item d-flex align-items-center mb-30">
        <div className="tp-service-5-item-icon">
            <span>{icon}</span>
        </div>
        <span>{text}</span>
    </div>
);

export default function ServiceAreaTwo() {
    const serviceItems: ServiceItemProps[] = [
        { icon: <ServiceSvgOne />, text: "Turning dreams<br />into address" },
        { icon: <ServiceSvgTwo />, text: "Every home<br />tells story" },
        { icon: <ServiceSvgThree />, text: "Real estates<br />success" },
        { icon: <ServiceSvgFour />, text: "Parkside<br />residential" },
    ];

    return (
        <section className="tp-service-5-ptb pt-130 pb-130">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="tp-service-5-thumb image-anime wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".3s">
                            <Image src={serviceThumb} alt="service thumb" />
                            <div className="tp-service-5-shape">
                                <Image src={progressThumb} alt="progress thumb" />
                            </div>
                            <div className="tp-about-4-thumb-box service">
                                <h4 className="tp-about-4-thumb-title">4.9</h4>
                                <span><StarSvg /><StarSvg /><StarSvg /><StarSvg /><StarSvg /></span>
                                <p>Trust score</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-service-5-wrap wow fadeInRight" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-service-5-icon mb-40">
                                <span><HeadPhoneBigSvg /></span>
                            </div>
                            <div className="tp-service-5-heading mb-40">
                                <h3 className="tp-section-title">With us help you <br />find your dream home</h3>
                            </div>
                            <div className="tp-service-5-item-box d-flex flex-wrap mb-35">
                                {serviceItems.map((item, index) => (
                                    <ServiceItem key={index} icon={item.icon} text={item.text.replace(/<br \/>/g, "\n")} />
                                ))}
                            </div>
                            <div className="tp-service-5-btn-box d-flex">
                                <div className="tp-service-5-btn mr-20">
                                    <Link className="tp-btn" href="/propiedades">
                                        <span className="btn-wrap">
                                            <b className="text-1">Build Your Own Property</b>
                                            <b className="text-2">Build Your Own Property</b>
                                        </span>
                                    </Link>
                                </div>
                                <div className="tp-property-5-author d-flex align-items-center">
                                    <div className="tp-property-5-author-icon">
                                        <Image src={authorImg} alt="author image" />
                                    </div>
                                    <div className="tp-property-5-author-content">
                                        <h4 className="tp-property-5-author-title">Call us directly</h4>
                                        <span><Link href="tel:5566972">1 800 222 00000</Link></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}