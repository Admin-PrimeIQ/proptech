"use client"
import LocationSvg from "../SVG/BannerSvg/LocationSvg";
import NiceSelect from "../UI/NiceSelect";
import FilterSvg from "../SVG/FilterSvg";
import Link from "next/link";

export default function ExperienceArea() {
    const handleSorting = () => { };
    return (
        <section className="tp-experience-area p-relative">
            <div className="tp-experience-bg"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="tp-experience-heading d-flex pb-140 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            <h3 className="tp-experience-title"><i>2</i>4</h3>
                            <div className="tp-experience-content">
                                <span>Years working
                                    experience.</span>
                                <p>Lorem  ipsum dolor sit amet
                                    consectetuer adipiscing</p>
                                <Link href="/about">Read More</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-experience-tab-box p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                            <h4 className="tp-experience-tab-title">Find Your Dream Home</h4>
                            <div className="tp-experience-tab-input">
                                <input type="text" placeholder="Enter Keywords" />
                            </div>
                            <div className="tp-experience-tab-select tp-select">
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
                            <div className="tp-experience-tab-input">
                                <input type="text" placeholder="Neighbourhoods" />
                                <span>
                                    <LocationSvg />
                                </span>
                            </div>
                            <div className="tp-experience-tab-input">
                                <input type="text" placeholder="Advanced" />
                                <span className="filter-btn">
                                    <button>
                                        <FilterSvg />
                                    </button>
                                </span>
                            </div>
                            <div className="tp-experience-tab-search">
                                <button className="tp-btn">Search Here</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}