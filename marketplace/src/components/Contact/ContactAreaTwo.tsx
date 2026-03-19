import { CallThreeSvg } from "../SVG/ContactSvg/CallTwoSvg";
import { ContactLocation } from "@/types/custom-interface";
import { TeamEmailSvg } from "../SVG";
import Link from "next/link";

const contactLocations: ContactLocation[] = [
    {
        title: "London",
        address: <><p>401 Broadway, 24th floor, <br /> Orchard view, London, UK</p></>,
        phone: "+999 325 654 8596",
        email: "bhumi@gmail.com",
    },
    {
        title: "Dubai",
        address: <><p>Dubai Investment Park 23 <br /> Abu Shagara, Sharjah</p></>,
        phone: "+999 325 654 8596",
        email: "bhumi@gmail.com",
    },
];

export default function ContactAreaTwo() {
    return (
        <section className="tp-contact-inner-ptb pt-130 pb-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="tp-contact-inner-heading mb-30">
                            <span className="tp-section-title-pre">FEEL FREE TO CONTACT WITH US</span>
                            <h3 className="tp-section-title">
                                Contact us we are <br /> around the world.
                            </h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-contact-inner-item-box d-flex flex-wrap">
                            {contactLocations.map(({ title, address, phone, email }) => (
                                <div key={title} className="tp-contact-inner-item">
                                    <span className="tp-contact-inner-item-title">{title}</span>
                                    {address}
                                    <Link href={`tel:${phone}`}>
                                        <span>
                                            <CallThreeSvg width="16" height="16" />
                                        </span>
                                        {phone}
                                    </Link>
                                    <Link href={`mailto:${email}`}>
                                        <span>
                                            <TeamEmailSvg />
                                        </span>
                                        {email}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}