import PropertyVideoImg from "../../../public/assets/img/rent/property/property-video.jpg";
import PropertyVideoImg1 from "../../../public/assets/img/rent/property/property-video-1.jpg";
import PropertyVideoImg2 from "../../../public/assets/img/rent/property/property-video-2.jpg";
import VideoIcon from "../../../public/assets/img/rent/property/property-video-icon.jpg";
import { useVideoModal } from "@/provider/VideoProvider";
import Image from "next/image";

export default function PropertyDetailsVideo() {
     const { playVideo } = useVideoModal();
    return (
        <div className="tp-property-details-video p-relative">
            <Image className="main" src={PropertyVideoImg} alt="video image" />
            <div className="tp-property-details-video-text">
                <h4 className="tp-property-details-video-title">HOW LISTING SIGHT <br />
                    MAKE MONEY</h4>
            </div>
            <div className="tp-property-details-video-shape-1">
                <Image src={PropertyVideoImg1} alt="video image" />
            </div>
            <div className="tp-property-details-video-shape-2">
                <Image src={PropertyVideoImg2} alt="video image" />
            </div>
            <div className="tp-property-details-video-icon">
                <button onClick={() => playVideo("4jnzf1yj48M")}>
                    <Image src={VideoIcon} alt="video icon" />
                </button>
            </div>
        </div>
    )
}