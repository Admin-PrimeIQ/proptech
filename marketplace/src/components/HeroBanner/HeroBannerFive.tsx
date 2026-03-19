import heroThumbBg from "../../../public/assets/img/hero/home-5/hero-5-thumb-bg.png";
import heroThumb from "../../../public/assets/img/hero/home-5/hero-5-thumb-1.png";
import authorImg from "../../../public/assets/img/hero/home-5/author.png";
import iconImg from "../../../public/assets/img/hero/home-5/icon.png";
import starImg from "../../../public/assets/img/hero/home-5/star.png";
import HeroFiveBannerTab from "./subComponents/HeroFiveBannerTab";
import Image from "next/image";

export default function HeroBannerFive() {
    return (
        <section className="tp-hero-5-ptb p-relative pt-120" style={{ backgroundImage: `url(${heroThumbBg.src})` }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="tp-hero-5-heading mb-80 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            <h3 className="tp-hero-5-title">Discover your dream <br /> home with bhumi</h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-hero-5-content pl-70 mb-80 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                            <p className="tp-hero-5-content-p">Whether {`you're`} looking for a cozy apartment, a luxurious villa <br />
                                or a family-friendly house, {`we've`} got you covered</p>
                            <div className="tp-hero-5-content-box d-flex align-items-center">
                                <div className="tp-hero-5-rating d-flex align-items-center">
                                    <div className="tp-hero-5-rating-icon">
                                        <Image src={iconImg} alt="icon" />
                                    </div>
                                    <div className="tp-hero-5-rating-content">
                                        <span>4.9 <Image src={starImg} alt="star icon" /></span>
                                        <p>( 2.1+ {`user’s`} reviews )</p>
                                    </div>
                                </div>
                                <div className="tp-hero-5-author">
                                    <Image src={authorImg} alt="author image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="tp-hero-5-thumb text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay=".7s">
                            <Image style={{width:"100%", height:"auto"}} src={heroThumb} alt="thumb image" />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                     {/* Render HeroFiveBannerTab component */}
                       <HeroFiveBannerTab/>
                    </div>
                </div>
            </div>
        </section>
    )
}