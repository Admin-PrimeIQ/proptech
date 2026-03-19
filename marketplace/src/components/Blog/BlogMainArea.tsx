"use client";
import BlogPagination from "./subComponents/BlogPagination";
import { blogData } from "@/data/blogData";
 import { useState } from "react";
 import Image from "next/image";
 import Link from "next/link";
 
const ITEMS_PER_PAGE = 6; // Number of blogs per page
const SLICE_START = 9;
const SLICE_END = 19;

export default function BlogMainArea() {
    const [currentPage, setCurrentPage] = useState(1);

    // Slice the required data range
    const slicedData = blogData.slice(SLICE_START, SLICE_END);

    const totalPages = Math.ceil(slicedData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBlogs = slicedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <section className="tp-blog-inner-ptb pt-140 pb-120">
            <div className="container">
                <div className="row">
                    {paginatedBlogs.map((item) => (
                        <div className="col-lg-4 col-md-6" key={item.id}>
                            <div className="tp-blog-2-item p-relative mb-35">
                                <div className="tp-blog-2-thumb p-relative">
                                    <Link href={`/blog-details/${item.id}`}>
                                        <Image src={item.image} alt="image" />
                                    </Link>
                                    <span className="tp-blog-2-date">{item.date} <i>{item.month}</i></span>
                                </div>
                                <div className="tp-blog-2-content">
                                    <div className="tp-blog-2-meta-btn">
                                        <Link href="#">{item.category}</Link>
                                    </div>
                                    <h3 className="tp-blog-2-title">
                                        <Link className="textline" href={`/blog-details/${item.id}`}>
                                            {item.title}
                                        </Link>
                                    </h3>
                                    <p>{item.description}</p>
                                    <div className="tp-blog-2-btn">
                                        <Link href={`/blog-details/${item.id}`}>Read More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                </div>
            </div>
        </section>
    );
};
