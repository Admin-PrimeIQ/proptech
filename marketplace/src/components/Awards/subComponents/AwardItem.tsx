"use client";
import AwardArrowSvg from "@/components/SVG/AwardArrowSvg";
import { AwardItemProps } from "@/types/custom-interface";
import Link from "next/link";

export default function AwardItem({ title, date, description, image, handleMouseMove }: AwardItemProps) {
    return (
        <div
            className="tp-awards-item tp-hover-reveal-item p-relative"
            onMouseMove={(event) => handleMouseMove(event, ".tp-hover-reveal-item")}
        >
            <Link href="#">
                <div className="tp-awards-item-inner d-flex align-items-center justify-content-between">
                    <div className="tp-awards-item-left d-flex">
                        <div className="tp-awards-date">
                            <h4 className="tp-awards-date-title">{date}</h4>
                        </div>
                        <div className="tp-awards-text-wrap">
                            <h3 className="tp-awards-title">{title}</h3>
                            <span>{description}</span>
                        </div>
                    </div>
                    <div className="tp-awards-item-right">
                        <div className="tp-awards-icon">
                            <span><AwardArrowSvg/></span>
                        </div>
                    </div>
                </div>
            </Link>
            <div className="tp-hover-reveal-bg" style={{ backgroundImage: `url(${image.src})` }}></div>
        </div>
    )
}
