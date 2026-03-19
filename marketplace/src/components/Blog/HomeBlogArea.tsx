import BlogItemHome from "./subComponents/BlogItemHome";
import blogData from "@/data/blogData";

export default function HomeBlogArea({wrapClass}:{wrapClass?:string}) {
    return (
        <section className={`pt-125 pb-110 ${wrapClass ? wrapClass : "tp-blog-area"}`} style={{ backgroundColor: "#F0F4FD" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-blog-heading text-center mb-50">
                            <h3 className="tp-section-title">Our latest article and news</h3>
                        </div>
                    </div>
                    {blogData.slice(0,3).map((blog) => (
                        <BlogItemHome key={blog.id} {...blog} />
                    ))}
                </div>
            </div>
        </section>
    );
};

