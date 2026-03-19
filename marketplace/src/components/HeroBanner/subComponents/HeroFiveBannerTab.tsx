"use client"
import BannerFromFilter from "@/components/Form/BannerFromFilter";
import TabContentHeroFive from "./TabContentHeroFive";
import { useState } from "react";

export default function HeroFiveBannerTab() {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const toggleFilter = () => setIsFilterVisible((prev) => !prev);

    return (
        <div className="tp-hero-5-tab p-relative">
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className="nav-link" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                        For Rent
                    </button>
                    <button className="nav-link active" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
                        For Sell
                    </button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    <TabContentHeroFive toggleFilter={toggleFilter}/>
                </div>
                <div className="tab-pane fade show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    <TabContentHeroFive toggleFilter={toggleFilter}/>
                </div>
            </div>

            {/* Filter Area */}
            <section className={`tp-from-filter ${isFilterVisible ? "show" : "hidden"}`}>
                <BannerFromFilter />
            </section>
        </div>
    );
}