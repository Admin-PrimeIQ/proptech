import userImg from "../../../../public/assets/img/blog/blog-details/blog-details-user.png";
import Image from "next/image";
import Link from "next/link";

export default function BlogDetailsAuthor() {
    return (
        <>
            <div className="tp-postbox-details-author-box mb-60 p-relative">
                <div className="tp-postbox-details-author-wrap d-flex align-items-center">
                    <div className="tp-postbox-details-author-avata">
                        <Image src={userImg} alt="user-image" />
                    </div>
                    <div className="tp-postbox-details-author-content">
                        <h4 className="tp-postbox-details-author-title">Alison Baker</h4>
                        <p>Ex erat referrentur vis. Vim ad consul molestie, eu malorum aliquando
                            referrentur pro, erroribus gloriatur sed at.!</p>
                        <div className="tp-postbox-details-author-social">
                            <Link href="https://www.facebook.com/" target="_Blank"><i className="fa-brands fa-facebook-f"></i></Link>
                            <Link href="https://x.com/" target="_Blank"><i className="fa-brands fa-twitter"></i></Link>
                            <Link href="https://www.linkedin.com/" target="_Blank"><i className="fa-brands fa-linkedin-in"></i></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}