import AddressSvg from "@/components/SVG/ContactSvg/AddressSvg";
import CallSvg from "@/components/SVG/ContactSvg/CallSvg";
import ContactEmailSvg from "@/components/SVG/ContactSvg/EmailSvg";
import Link from "next/link";

export default function ContactInfoList() {
    return (
        <div className="tp-contact-wrap">
            <div className="tp-contact-info d-flex align-items-center mb-10">
                <div className="tp-contact-info-icon">
                    <span><CallSvg /></span>
                </div>
                <div className="tp-contact-info-content">
                    <span>Call us at</span>
                    <Link href="tel:123654">+(602) 762 472 96</Link>
                </div>
            </div>
            <div className="tp-contact-info d-flex align-items-center mb-10">
                <div className="tp-contact-info-icon">
                    <span><ContactEmailSvg /></span>
                </div>
                <div className="tp-contact-info-content">
                    <span>Email us on</span>
                    <Link href="mailto:bhumi@info.com">bhumi@info.com</Link>
                </div>
            </div>
            <div className="tp-contact-info d-flex align-items-center mb-10">
                <div className="tp-contact-info-icon">
                    <span><AddressSvg /></span>
                </div>
                <div className="tp-contact-info-content">
                    <span>Address</span>
                    <Link href="https://www.google.com/maps">102 Thompson, New York</Link>
                </div>
            </div>
        </div>
    )
}