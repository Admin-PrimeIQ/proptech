
"use client"
import textImg1 from "../../../public/assets/img/text-img/text-img-1.jpg";
import textImg2 from "../../../public/assets/img/text-img/text-img-2.jpg";
import textImg3 from "../../../public/assets/img/text-img/text-img-3.jpg";
import textImg4 from "../../../public/assets/img/text-img/text-img-4.jpg";
import textImg5 from "../../../public/assets/img/text-img/text-img-5.jpg";
import textImg6 from "../../../public/assets/img/text-img/text-img-6.jpg";
import textImg7 from "../../../public/assets/img/text-img/text-img-7.jpg";
import useHoverReveal from "@/hooks/useHoverReveal";
import Link from "next/link";

const categories = [
    { name: "Technology", img: textImg1 },
    { name: "Safety", img: textImg2 },
    { name: "Eco", img: textImg3 },
    { name: "Luxury", img: textImg4 },
    { name: "Apartments", img: textImg5 },
    { name: "Smart", img: textImg6 },
    { name: "Home", img: textImg7 },
    { name: "Building", img: textImg6 },
    { name: "Real Estate", img: textImg4 },
];

export default function TextArea() {
    const { handleMouseMove } = useHoverReveal();
    return (
        <div className="tp-text-ptb fix pt-140 pb-140">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-text-wrap text-center">
                            <div>
                                {/* Loop through each category and create a hover reveal item */}
                                {categories.map((category, index) => (
                                    <span key={index} className="tp-hover-reveal-item" onMouseMove={(event) => handleMouseMove(event, ".tp-hover-reveal-item")}>
                                        <Link href="#">{category.name}</Link>
                                        <span
                                            className="tp-hover-reveal-bg"
                                            style={{ backgroundImage: `url(${category.img.src})` }}
                                        ></span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
