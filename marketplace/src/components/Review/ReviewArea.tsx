import chooseThumb from "../../../public/assets/img/others/why-chose-thumb.png";
import userImgTwo from "../../../public/assets/img/team/user-2.png";
import userImg from "../../../public/assets/img/team/user-1.png";
import Image from "next/image";
import Link from "next/link";

export default function ReviewArea() {
    return (
        <section className="tp-review-ptb pb-140 p-relative">
            <div className="tp-review-shape">
                <Image src={chooseThumb} alt="choose thumb" />
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">

                        <div className="tp-review-item-box wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".3s">
                            <div className="tp-review-item d-flex align-items-center mb-30 ml-100">
                                <div className="tp-review-item-thumb">
                                    <Image src={userImg} alt="user thumb" />
                                </div>
                                <div className="tp-review-item-content">
                                    <p>Lorem  ipsum dolor sit amet, co <br />
                                        sectetuer adipiscing modo  ligula</p>
                                    <span>Richard Crue, Themepure</span>
                                </div>
                            </div>

                            <div className="tp-review-item d-flex align-items-center">
                                <div className="tp-review-item-thumb">
                                    <Image src={userImgTwo} alt="user thumb" />
                                </div>
                                <div className="tp-review-item-content">
                                    <p>Lorem  ipsum dolor sit amet, co <br />
                                        sectetuer adipiscing modo  ligula</p>
                                    <span>Liza, Themepure</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="col-lg-6">
                        <div className="tp-review-heading pl-70 wow fadeInRight" data-wow-duration="1s" data-wow-delay=".3s">
                            <h3 className="tp-section-title">Customers review <br />
                                existing user</h3>
                            <p className="mb-30">Online property marketplace to buy, sell, and rent residential and <br />
                                comme cial properties. Used by millions of renters to find <br />
                                property. Browse millions of properties</p>
                            <div className="tp-review-btn">
                                <Link className="tp-btn" href="/contact">
                                    <span className="btn-wrap">
                                        <b className="text-1">Get Started</b>
                                        <b className="text-2">Get Started</b>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}