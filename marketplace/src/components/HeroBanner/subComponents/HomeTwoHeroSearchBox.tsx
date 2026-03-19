"use client"
import SearchSvg from "@/components/SVG/BannerSvg/SearchSvg";
import NiceSelect from "@/components/UI/NiceSelect";

export default function HomeTwoHeroSearchBox() {
    const handleSorting = () => { };
    return (
        <div className="tp-hero-2-tab-box d-flex align-items-center">
            <div className="tp-hero-tab-input p-relative">
                <input type="text" placeholder="Enter Keywords" />
            </div>
            <div className="tp-hero-tab-select tp-select">
                <NiceSelect
                    options={[
                        { value: "", label: "Types" },
                        { value: "Villa", label: "Villa" },
                        { value: "Studio", label: "Studio" },
                        { value: "Office", label: "Office" },
                    ]}
                    defaultCurrent={0}
                    onChange={() => handleSorting()}
                    name="Sorting"
                />
            </div>
            <div className="tp-hero-tab-search two">
                <button>
                    Search {" "}
                    <span>
                        <SearchSvg/>
                    </span>
                </button>
            </div>
        </div>
    )
}