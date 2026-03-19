import FilterBtnSvg from "@/components/SVG/BannerSvg/FilterBtnSvg";
import LocationSvg from "@/components/SVG/BannerSvg/LocationSvg";
import SearchSvg from "@/components/SVG/BannerSvg/SearchSvg";
import NiceSelect from "@/components/UI/NiceSelect";
import { propertyTypeOptions } from "@/data/dropdownData";

interface tabProps{
    toggleFilter?:()=>void;
}
export default function TabContentHeroFive({toggleFilter}:tabProps) {
    return (
        <div className="tp-hero-tab-box d-flex align-items-center">
        <div className="tp-hero-tab-input p-relative">
            <input type="text" placeholder="Enter Keywords" />
        </div>
        <div className="tp-hero-tab-select tp-select">
            <NiceSelect options={propertyTypeOptions} defaultCurrent={0} onChange={() => { }} name="Sorting" />
        </div>
        <div className="tp-hero-tab-input p-relative">
            <input type="text" placeholder="Neighbourhoods" />
            <span><LocationSvg /></span>
        </div>
        <div className="tp-hero-tab-filter">
            <button onClick={toggleFilter} className="tp-hero-filter-btn filter-btn">
                <span> <FilterBtnSvg /> </span>
            </button>
        </div>
        <div className="tp-hero-tab-search">
            <button> Search {" "}<span> <SearchSvg /></span> </button>
        </div>
    </div>
    )
}