import userImg from "../../../../public/assets/img/rent/property/review-user-1.png";
import userImg2 from "../../../../public/assets/img/rent/property/review-user-2.png";
import { ReplayIconSvg } from "@/components/SVG";
import { ICommentDT } from "@/types/blog-d-t";
import Image from "next/image";
import Link from "next/link";

// Define an array of comments with author details, date, text, and user image
const comments: ICommentDT[] = [
    {
        id: 1,
        author: "Chigusa Kisa",
        date: "July 21, 2020 at 7:22 pm",
        text: "Experience is fundamental to ensuring prospects stay engaged when visiting content page the most of this 2023 content trend.!",
        image: userImg,
    },
    {
        id: 2,
        author: "Nicolas Bryant",
        date: "July 21, 2020 at 7:22 pm",
        text: "Experience is fundamental to ensuring prospects stay engaged when visiting content page the most of this 2023 content trend.!",
        image: userImg2,
        isChild: true,
    },
];

export default function BlogComments() {
    return (
        <div className="tp-postbox-comment mb-100">
            <h3 className="tp-postbox-comment-title">{comments.length} Comments</h3>
            <ul>
                {/* Render comments with author info, text, and reply link */}
                {comments.map((comment) => (
                    <li key={comment.id} className={comment.isChild ? "children" : ""}>
                        <div className="tp-postbox-comment-box d-flex">
                            <div className="tp-postbox-comment-info">
                                <div className="tp-postbox-comment-avater mr-20">
                                    <Image src={comment.image} alt="user image" />
                                </div>
                            </div>
                            <div className="tp-postbox-comment-text">
                                <div className="tp-postbox-comment-name d-flex align-items-center">
                                    <h5 className="tp-postbox-comment-name-title">{comment.author}</h5>
                                    <span className="post-meta"> {comment.date}</span>
                                </div>
                                <p>{comment.text}</p>
                                <div className="tp-postbox-comment-reply">
                                    <Link href="#">
                                        <ReplayIconSvg />
                                        Reply
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}