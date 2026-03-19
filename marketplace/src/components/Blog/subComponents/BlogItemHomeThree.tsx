import { IBlogDT } from "@/types/blog-d-t";
import Image from "next/image";
import Link from "next/link";

export default function BlogItemHomeThree({ image, date, category, title, id, delay }:IBlogDT) {
    return (
        <div className="col-lg-4 col-md-6">
        <div className="tp-blog-3-item mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay={delay}>
            <div className="tp-blog-3-item-thumb">
                <Link href={`/blog-details/${id}`}><Image src={image} alt={title} /></Link>
            </div>
            <div className="tp-blog-3-item-content">
                <div className="tp-blog-3-item-tag d-flex align-items-center">
                    <span>{date}</span>
                    <p>{category}</p>
                </div>
                <h4 className="tp-blog-3-item-title">
                    <Link href={`/blog-details/${id}`}>{title}</Link>
                </h4>
                <div className="tp-blog-3-item-btn">
                    <Link className="tp-blog-3-btn textline" href={`/blog-details/${id}`}>
                        Read More{" "}
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
    )}
