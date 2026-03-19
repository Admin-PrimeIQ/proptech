import LocationSvg from "@/components/SVG/BannerSvg/LocationSvg";
import SearchSvg from "@/components/SVG/BannerSvg/SearchSvg";
import NiceSelect from "@/components/UI/NiceSelect";

interface HeroBannerProps {
    options: { value: string; label: string }[];
    handleSelectChange: (value: string) => void;
}

export default function HeroFourBannerTab({ options, handleSelectChange }: HeroBannerProps) {
    return (
        <div className="tp-hero-tab-box home-4 d-flex align-items-center">
            <div className="tp-hero-tab-input p-relative">
                <input type="text" placeholder="Enter Keywords" />
            </div>
            <div className="tp-hero-tab-select tp-select">
                <NiceSelect
                    options={options}
                    defaultCurrent={0}
                    onChange={(item) => handleSelectChange(item.value)}
                    name="Sorting"
                />
            </div>
            <div className="tp-hero-tab-input home-4 p-relative">
                <input type="text" placeholder="Location" />
                <span><LocationSvg /></span>
            </div>
            <div className="tp-hero-tab-search">
                <button>
                    Search {" "}
                    <span><SearchSvg /></span>
                </button>
            </div>
        </div>
    );
};