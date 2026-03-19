import ArrowNextSvg from "@/components/SVG/BannerSvg/ArrowNextSvg";
import Link from "next/link";

export default function SidebarCatefories() {
    return (
        <>
            <div className="tp-sidebar-widget mb-30">
                <div className="tp-sidebar-content">
                    <h5 className="tp-sidebar-widget-title">Categories</h5>
                    <ul>
                        <li><Link href="#"><ArrowNextSvg width="6" height="10" />Apartments <span>04</span></Link></li>
                        <li><Link href="#"><ArrowNextSvg width="6" height="10" />Real estate <span>06</span></Link></li>
                        <li><Link href="#"><ArrowNextSvg width="6" height="10" />Office <span>01</span></Link></li>
                        <li><Link href="#"><ArrowNextSvg width="6" height="10" />Luxury vilas <span>09</span></Link></li>
                        <li><Link href="#"><ArrowNextSvg width="6" height="10" />Duplex house <span>10</span></Link></li>
                    </ul>
                </div>
            </div>
        </>
    )
}