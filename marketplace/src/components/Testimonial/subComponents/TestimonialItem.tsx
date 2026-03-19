
import StarSvg from "@/components/SVG/StarSvg";
import { ITestimonialIDT } from "@/types/testimonial-d-t";
import Image from "next/image";

export default function TestimonialItem({ image, name, description }: ITestimonialIDT) {
    return (
        <div className="tp-testimonial-3-item">
            <div className="tp-testimonial-3-content d-flex align-items-center">
                <div className="tp-testimonial-3-user">
                    <Image src={image} alt={name} />
                </div>
                <div className="tp-testimonial-3-text">
                    <p>{description}</p>
                </div>
            </div>
            <div className="tp-testimonial-3-bottom d-flex justify-content-between">
                <h4 className="tp-testimonial-3-title">{name}</h4>
                <div className="tp-testimonial-3-stars">
                    {[...Array(5)].map((_, index) => (
                        <span key={index}><StarSvg />{index !== 4 && "\u00A0"}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}