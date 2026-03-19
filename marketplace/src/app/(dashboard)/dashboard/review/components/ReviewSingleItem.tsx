import { ReplayIconSvg } from "@/components/SVG";
import { Review } from "@/types/custom-interface";
import Image from "next/image";
import Link from "next/link";

const ReviewItem: React.FC<Review> = ({ name, date, comment, avatar }) => (
    <li>
        <div className="tp-postbox-comment-box d-flex">
            <div className="tp-postbox-comment-info">
                <div className="tp-postbox-comment-avater mr-20">
                    <Image src={avatar} height={60} alt={name} />
                </div>
            </div>
            <div className="tp-postbox-comment-text">
                <div className="tp-product-details-review-avater-rating d-flex align-items-center">
                    {[...Array(5)].map((_, index) => (
                        <span key={index}>
                            <i className="fa-solid fa-star"></i>
                        </span>
                    ))}
                </div>
                <div className="tp-postbox-comment-name d-flex align-items-center">
                    <h5 className="tp-postbox-comment-name-title">{name}</h5>
                    <span className="post-meta"> {date}</span>
                </div>
                <p>{comment}</p>
                <div className="tp-postbox-comment-reply">
                    <Link href="#">
                        <ReplayIconSvg />
                        Reply
                    </Link>
                </div>
            </div>
        </div>
    </li>
);

export default ReviewItem;