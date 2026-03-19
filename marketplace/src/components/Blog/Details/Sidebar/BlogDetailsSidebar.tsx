"use client"
import SidebarPropertyItem from "../../../Layout/subComponents/SidebarPropertyItem";
import SidebarRecentPost from "./SidebarRecentPost";
import SidebarCatefories from "./SidebarCatefories";
import { SearchSvg } from "@/components/SVG";
import BlogSidebarTag from "./SidebarTag";

export default function BlogDetailsSidebar() {
    return (
        <>
            <div className="tp-sidebar-wrapper">
                <div className="tp-sidebar-widgets mb-30">
                    <div className="tp-sidebar-content">
                        <div className="tp-sidebar-search">
                            <h5 className="tp-sidebar-widgets-title">Search</h5>
                            <form action="#" className="p-relative" onSubmit={(e) => e.preventDefault()}>
                                <input type="text" placeholder="Type keyword here" />
                                <button className="tp-sidebar-search-btn" type="submit">
                                    <span> <SearchSvg width="18" height="18" /></span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {/* recent post */}
                <SidebarRecentPost />

                {/* Categories */}
                <SidebarCatefories />

                {/* sidebar single property */}
                 <SidebarPropertyItem customClass="tp-team-details-item"/>

                {/* Blog tag */}
                <div className="tp-sidebar-widget mb-30">
                    <BlogSidebarTag />
                </div>
            </div>
        </>
    )
}