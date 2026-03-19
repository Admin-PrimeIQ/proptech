"use client"
import detailsThumb from "../../../../public/assets/img/team/team-details/details-thumb-1.jpg";
import { LocationSvg, SearchSvgTwo, } from "@/components/SVG";
import { categoriesTypeOptions } from "@/data/dropdownData";
import FeaturedProperty from "./TeamFeaturedProperty";
import NiceSelect from "@/components/UI/NiceSelect";
import Image from "next/image";
import Link from "next/link";

// Interfaces
interface ContactInputProps {
    placeholder: string;
    Icon: React.ElementType;
}

// Renders a contact input with a placeholder and icon.
const ContactInput = ({ placeholder, Icon }: ContactInputProps) => (
    <div className="tp-team-contact-input p-relative">
        <input type="text" placeholder={placeholder} />
        <span><Icon /></span>
    </div>
);
// Displays a discount widget with an image and link.
const DiscountWidget = () => (
    <div className="tp-team-details-widget mb-40">
        <div className="tp-team-details-discount p-relative">
            <div className="tp-team-details-discount-thumb">
                <Image src={detailsThumb} alt="thumb" />
            </div>
            <div className="tp-team-details-discount-content">
                <h4>Get 70% discount <br />on amazon</h4>
                <Link href="/contact">Try Now</Link>
            </div>
        </div>
    </div>
);

export default function TeamRightBox() {
    const handleSorting = () => { };

    return (
        <div className="tp-team-right-box">
            <div className="tp-team-widget mb-40">
                <div className="tp-team-contact">
                    <ContactInput placeholder="Enter agent name" Icon={SearchSvgTwo} />
                    <div className="tp-team-contact-select tp-select">
                        <NiceSelect
                            options={categoriesTypeOptions}
                            defaultCurrent={0}
                            onChange={handleSorting}
                            name="Sorting"
                            cls="select wide"
                        />
                    </div>
                    <ContactInput placeholder="Location" Icon={LocationSvg} />
                </div>
            </div>
            <DiscountWidget />
            <FeaturedProperty />
        </div>
    );
}

