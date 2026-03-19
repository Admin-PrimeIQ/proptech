import { IBlogDT } from "@/types/blog-d-t";
import Image from "next/image";
import Link from "next/link";

export default function BlogItemHomeTwo({ id, delay, image, date, month, category, title, description }: IBlogDT) {
    return (
        <div className="col-lg-4 col-md-6" data-wow-duration="1s" data-wow-delay={delay}>
            <div className="tp-blog-2-item p-relative mb-35 wow fadeInUp">
                <div className="tp-blog-2-thumb p-relative">
                    <Link href={`/blog-details/${id}`}>
                        <Image src={image} alt={title} />
                    </Link>
                    <span className="tp-blog-2-date">
                        {date} <i>{month}</i>
                    </span>
                </div>
                <div className="tp-blog-2-content">
                    <div className="tp-blog-2-meta-btn">
                        <Link href="#">{category}</Link>
                    </div>
                    <h3 className="tp-blog-2-title">
                        <Link className="textline" href={`/blog-details/${id}`}>{title}</Link>
                    </h3>
                    <p>{description}</p>
                    <div className="tp-blog-2-btn">
                        <Link href={`/blog-details/${id}`}>Read More</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}