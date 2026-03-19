import Image from "next/image";
import starIcon from "../../../../public/assets/img/testimonial/star_icon.png";
import { ITestimonialIDT } from "@/types/testimonial-d-t";
import { StaticImageData } from "next/image";

type HomeTestimonialItemProps = {
  description: string;
  image: StaticImageData | string;
  name: string;
  role?: string;
};

export default function HomeTestimonialItem({ description, image, name, role }: HomeTestimonialItemProps) {
    const isExternalImage = typeof image === "string" && /^https?:\/\//i.test(image);
    
    return (
        <div className="tp-testimonial-item">
            <div className="tp-testimonial-icon">
                <Image src={starIcon} alt="Star Icon" />
            </div>
            <span>{description}</span>
            <div className="tp-testimonial-content d-flex align-items-center">
                <div className="tp-testimonial-thumb">
                    <Image 
                        src={image} 
                        alt={name}
                        width={50}
                        height={50}
                        style={{ 
                            width: "50px", 
                            height: "50px", 
                            objectFit: "cover",
                            borderRadius: "50%" 
                        }}
                        unoptimized={isExternalImage}
                    />
                </div>
                <div className="tp-testimonial-des">
                    <h4 className="tp-testimonial-title">{name}</h4>
                    {role && <p>{role}</p>}
                </div>
            </div>
        </div>
    );
}
