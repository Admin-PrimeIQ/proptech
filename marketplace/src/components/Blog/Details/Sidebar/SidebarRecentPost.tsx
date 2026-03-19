import blogImg1 from "../../../../../public/assets/img/blog/blog-details/recent-1.jpg";
import blogImg2 from "../../../../../public/assets/img/blog/blog-details/recent-2.jpg";
import blogImg3 from "../../../../../public/assets/img/blog/blog-details/recent-3.jpg";
import { RecentPost } from "@/types/blog-d-t";
import Image from "next/image";
import Link from "next/link";

// Define an array of recent blog posts with their id, image, title, and date
const recentPosts: RecentPost[] = [
    {
        id: 1,
        image: blogImg1,
        title: "Developing Privacy User Centric Apps",
        date: "May 4, 2024",
    },
    {
        id: 2,
        image: blogImg2,
        title: "Is Investing in Luxury Real Estate Worth the Hype",
        date: "May 4, 2024",
    },
    {
        id: 3,
        image: blogImg3,
        title: "The Ultimate Marketing Design Handbook",
        date: "May 4, 2024",
    },
];

export default function SidebarRecentPost() {
    return (
        <div className="tp-sidebar-widget mb-30">
            <h5 className="tp-sidebar-widget-title">Recent Posts</h5>
            {/* Loop through recent posts and display their image, title, and date with a link */}
            {recentPosts.map((post, index) => (
                <div key={index} className="tp-recent-post d-flex align-items-center mb-15">
                    <div className="tp-recent-post-thumb mr-15">
                        <Link href={`/blog-details/${post.id}`}>
                            <Image src={post.image} alt="blog image" />
                        </Link>
                    </div>
                    <div className="tp-recent-post-content">
                        <h3 className="tp-recent-post-title">
                            <Link href={`/blog-details/${post.id}`}>{post.title}</Link>
                        </h3>
                        <div className="tp-recent-post-meta">
                            <span>{post.date}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
