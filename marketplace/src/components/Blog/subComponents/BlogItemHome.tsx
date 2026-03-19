import { IBlogDT } from "@/types/blog-d-t";
import Image from "next/image";
import Link from "next/link";

export default function BlogItemHome({id, delay, image, category, title, readTime, authorImage, authorName, authorRole }:IBlogDT) {
    return (
        <div className="col-lg-4 col-md-6" key={id}>
        <div className="tp-blog-item p-relative mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay={delay}>
            <div className="tp-blog-item-thumb">
                <Link href={`/blog-details/${id}`}><Image src={image} alt={title} /></Link>
            </div>
            <div className="tp-blog-item-content">
                <div className="tp-blog-meta d-flex align-items-center">
                    <div className="tp-blog-meta-btn">
                        <Link href="#">{category}</Link>
                    </div>
                    <span>{readTime}</span>
                </div>
                <h5 className="tp-blog-item-title">
                    <Link className="textline" href={`/blog-details/${id}`}>{title}</Link>
                </h5>
                <div className="tp-blog-user d-flex align-items-center">
                    <div className="tp-blog-user-thumb">
                        {authorImage && <Image src={authorImage} alt="author image" />}
                    </div>
                    <div className="tp-blog-user-content">
                        <h6>{authorName}</h6>
                        <p>{authorRole}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )}