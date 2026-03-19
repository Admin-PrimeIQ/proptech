
import BlogItemHomeThree from './subComponents/BlogItemHomeThree';
import blogData from '@/data/blogData';
import React from 'react';

export default function ReusableBlogArea({sectionClass="tp-blog-3-ptb pt-130"}) {
    return (
        <section className={`${sectionClass} pb-110`}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="tp-blog-3-heading mb-50">
                            <span className="tp-section-title-pre">recent news</span>
                            <h3 className="tp-section-title">Keep up to date</h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-blog-3-text d-flex justify-content-lg-end mb-50">
                            <p>Lorem ipsum dolor sit amet, consectetuer adipiscing <br /> modo ligula eget dolor. Aenean massa. Cum</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {blogData.slice(3, 6).map((blog, index) => (
                        // Display blogs 4 to 6
                        <BlogItemHomeThree key={index} {...blog} />
                    ))}
                </div>
            </div>
        </section>
    )
}