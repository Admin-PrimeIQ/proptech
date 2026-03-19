
import { BathroomSvg, BedRoomSvg, GarageSvg, HomeSvg, LandSizeSvg, MessageSvgTwo, SquareFeetSvg, YearBuiltIconSvg } from "@/components/SVG";
import { ReactNode } from "react";

interface PropertyDetail {
    icon: ReactNode;
    label: string;
    value: string;
}
const propertyDetails:PropertyDetail[] = [
    { icon: <HomeSvg />, label: "ID", value: "1298" },
    { icon: <MessageSvgTwo />, label: "Type", value: "Office" },
    { icon: <BedRoomSvg />, label: "Bedroom", value: "03" },
    { icon: <BathroomSvg />, label: "Bathroom", value: "03" },
    { icon: <GarageSvg />, label: "Garage", value: "2" },
    { icon: <SquareFeetSvg />, label: "Size", value: "900 sq ft" },
    { icon: <LandSizeSvg />, label: "Land size", value: "1500 sq ft" },
    { icon: <YearBuiltIconSvg />, label: "Year built", value: "2023" },
];

export default function PropertyDetailsBox() {
    return (
        <div className="tp-property-details-tags-content">
            <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-2">
                {propertyDetails.map((detail, index) => (
                    <div className="col" key={index}>
                        <div className="tp-property-details-tags-item align-items-center mb-30 d-flex">
                            <div className="tp-property-details-tags-icon">
                                <span>{detail.icon}</span>
                            </div>
                            <div className="tp-property-details-tags-content">
                                <span>{detail.label}</span>
                                <p>{detail.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}