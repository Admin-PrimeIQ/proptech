"use client"

import { useVideoModal } from "@/provider/VideoProvider";
import videoBg from "../../../public/assets/img/offer/video-bg.jpg";
import VideoSvg from "../SVG/VideoSvg";

export default function VideoArea() {
   const { playVideo } = useVideoModal();
   return (
      <div className="tp-video-ptb p-relative pt-240 pb-240 include-bg" style={{ backgroundImage: `url(${videoBg.src})` }}>
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tp-video-content text-center">
                     <div className="tp-video-btn">
                        <button onClick={() => playVideo("293438220", "vimeo")}>
                           <span>
                              <VideoSvg />
                           </span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}