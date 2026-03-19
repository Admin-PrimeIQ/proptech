import Image from "next/image";
import serviceIcon1 from "../../../public/assets/img/service/service-icon-1.svg";
import serviceIcon2 from "../../../public/assets/img/service/service-icon-2.svg";
import serviceIcon3 from "../../../public/assets/img/service/service-icon-3.svg";
import serviceIcon4 from "../../../public/assets/img/service/service-icon-4.svg";
import serviceIcon5 from "../../../public/assets/img/service/service-icon-5.svg";
import { IServiceDT } from "@/types/custom-interface";

const services: IServiceDT[] = [
    { icon: serviceIcon1, title: "Villa", count: "20k" },
    { icon: serviceIcon2, title: "Offices", count: "12k" },
    { icon: serviceIcon3, title: "Home", count: "25k" },
    { icon: serviceIcon4, title: "Shop", count: "13k" },
    { icon: serviceIcon5, title: "Factory", count: "16k" }
];

export default function ServiceArea({sectionClass="tp-service-area", borderClass="tp-service-border"}) {
    return (
        <section className={`${sectionClass} fix ${borderClass}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="tp-service-heading pt-65">
                            <h4 className="tp-service-title">
                                What are you <br /> looking for?
                            </h4>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="tp-service-item-box d-flex">
                            {services.map((service, index) => (
                                <div key={index} className="tp-service-item text-center p-relative">
                                    <span>{service.count}</span>
                                    <Image src={service.icon} alt={`service icon ${service.title}`} />
                                    <h4 className="tp-service-item-title">{service.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


