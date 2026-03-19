"use client"
import authorImg from "../../../public/assets/img/rent/home-5/author.png";
import videoBg from "../../../public/assets/img/offer/video-bg-2.jpg";
import { useVideoModal } from "@/provider/VideoProvider";
import VideoSvg from "../SVG/VideoSvg";
import Image from "next/image";
import Link from "next/link";

export default function VideoAreaTwo() {
    const { playVideo } = useVideoModal();

    return (
        <div className="tp-video-5-area-box">
            <div className="tp-video-5-top text-center">
                <p><Image src={authorImg} alt="author image" />Save your precious time and effort spent for finding
                    a property solution. <Link href="/contact">Contact us Now</Link></p>
            </div>
            {/* -- video area start -- */}
            <section className="tp-video-5-ptb p-relative" style={{ backgroundImage: `url(${videoBg.src})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tp-video-5-content text-center pt-250">
                                <div className="tp-video-5-btn">
                                    <span onClick={() => playVideo("293438220", "vimeo")} style={{ cursor: "pointer" }}>
                                        <VideoSvg color="#FAF5EF" />
                                    </span>
                                </div>
                                <h3 className="tp-video-5-title">Experience a memorable <br /> stay at our Bhumi.!</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* -- video area end -- */}
            <div className="tp-video-5-bottom text-center">
                <p>{`Let's`} make something great work together. Got a project in mind? <span><Link href="/contact"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 11L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 1H11V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg></Link></span></p>
            </div>
        </div>
    )
}