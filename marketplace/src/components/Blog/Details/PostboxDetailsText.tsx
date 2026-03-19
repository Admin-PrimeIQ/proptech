import blogImg1 from "../../../../public/assets/img/blog/blog-details/blog-details-1.jpg";
import blogImg2 from "../../../../public/assets/img/blog/blog-details/blog-details-2.jpg";
import Image from "next/image";

export default function PostboxDetailsText() {
    return (
        <div className="tp-postbox-details-text">
            <h4 className="tp-postbox-details-title">How to build your own property</h4>

            <p className="text-3">Felis morbi ut tristique pretium libero. Eget purus, enim, orci, quis tempor sed. Sed nec eget nibh et Ut orci, sagittis tellus dui congue. Blandit laoreet nullam amet eget. Ut tincidunt diam tempor sed turpis odio vitae sem lobortis.</p>
            <div className="row tp-gx-20">
                <div className="col-lg-6">
                    <div className="tp-postbox-details-thumb p-relative">
                        <Image style={{width:"100%", height:"auto"}} src={blogImg1} alt="blog-image" />
                        <p>Images by <span>@sample</span></p>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="tp-postbox-details-thumb p-relative">
                        <Image style={{width:"100%", height:"auto"}} src={blogImg2} alt="blog-image" />
                        <p>Images by <span>@sample</span></p>
                    </div>
                </div>
            </div>
            <p className="text-4">Felis morbi ut tristique pretium libero. Eget purus, enim, orci, quis tempor sed. Sed nec eget nibh et Ut orci, sagittis tellus dui congue. Blandit laoreet nullam amet eget. Ut tincidunt diam tempor sed turpis odio vitae sem lobortis. sed turpis odio vitae sem lobortis.</p>
        </div>
    )
}