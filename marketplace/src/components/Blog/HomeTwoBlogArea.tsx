import BlogItemHomeTwo from "./subComponents/BlogItemHomeTwo";
import blogData from "@/data/blogData";

export default function HomeTwoBlogArea() {
    return (
        <section
            className="tp-blog-2-area pt-130 pb-110"
            style={{ backgroundColor: "#F0F4FD" }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-blog-2-heading text-center mb-50">
                            <span className="tp-section-title-pre">
                                OUR LATEST BLOG POST
                            </span>
                            <h3 className="tp-section-title">
                                Read our latest articles
                            </h3>
                        </div>
                    </div> 
                </div>
                <div className="row">
                    {blogData.slice(6, 9).map((blog) => (
                        <BlogItemHomeTwo key={blog.id} {...blog} />
                    ))}
                </div>
            </div>
        </section>
    );
}
