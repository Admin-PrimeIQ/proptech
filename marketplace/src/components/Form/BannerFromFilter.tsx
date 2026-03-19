import ResetSvgIcon from '../SVG/BannerSvg/ResetSvgIcon';
import SaveSvgIcon from '../SVG/BannerSvg/SaveSvgIcon';
import SearchSvg from '../SVG/BannerSvg/SearchSvg';
import NiceSelect from '../UI/NiceSelect';
import React, { useState } from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const BannerFromFilter = () => {

    // Define state for both sliders
    const [priceRange, setPriceRange] = useState<[number, number]>([75, 300]);
    const [sizeRange, setSizeRange] = useState<[number, number]>([50, 800]);

    const handlePriceChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            if (values.length === 2) {
                setPriceRange([values[0], values[1]]);
            }
        } else {
            setPriceRange([values, values]);
        }
    };

    const handleSizeChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            if (values.length === 2) {
                setSizeRange([values[0], values[1]]);
            }
        } else {
            setSizeRange([values, values]);
        }
    };


    const handleSorting = () => { };

    return (
        <>

            <div className="tp-from-wrapper">
                <form>
                    <div className="tp-from-select-box d-flex flex-wrap flex-lg-nowrap">
                        <div className="tp-hero-tab-select tp-select">
                            <NiceSelect
                                options={[
                                    { value: "", label: "Property status" },
                                    { value: "Villa", label: "Villa" },
                                    { value: "Studio", label: "Studio" },
                                    { value: "Office", label: "Office" },
                                ]}
                                defaultCurrent={0}
                                onChange={() => handleSorting()}
                                name="Sorting"
                            />
                        </div>
                        <div className="tp-hero-tab-select tp-select">
                            <NiceSelect
                                options={[
                                    { value: "", label: "Bed rooms" },
                                    { value: "Villa", label: "Villa" },
                                    { value: "Studio", label: "Studio" },
                                    { value: "Office", label: "Office" },
                                ]}
                                defaultCurrent={0}
                                onChange={() => handleSorting()}
                                name="Sorting"
                            />
                        </div>
                        <div className="tp-hero-tab-select tp-select">
                            <NiceSelect
                                options={[
                                    { value: "", label: "Bath rooms" },
                                    { value: "Villa", label: "Villa" },
                                    { value: "Studio", label: "Studio" },
                                    { value: "Office", label: "Office" },
                                ]}
                                defaultCurrent={0}
                                onChange={() => handleSorting()}
                                name="Sorting"
                            />
                        </div>
                    </div>
                    <div className="tp-from-input-box d-flex flex-wrap flex-lg-nowrap">
                        <div className="tp-from-input">
                            <input type="text" placeholder="Min. area" />
                        </div>
                        <div className="tp-from-input">
                            <input type="text" placeholder="Max. area" />
                        </div>
                        <div className="tp-from-input">
                            <input type="text" placeholder="Min. price" />
                        </div>
                        <div className="tp-from-input">
                            <input type="text" placeholder="Max. price" />
                        </div>
                    </div>
                    <div className="tp-from-range-box">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="tp-from-range">
                                    <div className="tp-property-widget-filter p-relative">
                                        <span className="tp-property-widget-filter-title">Price Range: from </span>
                                        <span className="input-range">
                                            <input type="text" value={`$${priceRange[0]} - $${priceRange[1]}`} readOnly />
                                        </span>
                                        <Slider className="custom-slider" range min={0} max={500} value={priceRange} onChange={handlePriceChange} step={1} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="tp-from-range">
                                    <div className="tp-property-filter-item-2">
                                        <div className="tp-property-widget-filter p-relative">
                                            <span className="tp-property-widget-filter-title">Size Range: from</span>
                                            <span className="input-range">
                                                <input type="text" value={`$${sizeRange[0]} - $${sizeRange[1]}`} readOnly />
                                            </span>
                                            <Slider className="custom-slider" range min={0} max={1000} value={sizeRange} onChange={handleSizeChange} step={1} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tp-from-checkbox">
                        <h4 className="tp-from-checkbox-title">Bhumi Amenities</h4>
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-3">
                                <ul>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-1" type="checkbox" />
                                            <label htmlFor="remeber-1">Air conditioning</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-2" type="checkbox" />
                                            <label htmlFor="remeber-2">Built in robes</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-3" type="checkbox" />
                                            <label htmlFor="remeber-3">Garage</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-4" type="checkbox" />
                                            <label htmlFor="remeber-4">Outdoor spa</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <ul>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-5" type="checkbox" />
                                            <label htmlFor="remeber-5">Intercom</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-6" type="checkbox" />
                                            <label htmlFor="remeber-6">Heating</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-7" type="checkbox" />
                                            <label htmlFor="remeber-7">Parking</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-8" type="checkbox" />
                                            <label htmlFor="remeber-8">WiFi</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <ul>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-9" type="checkbox" />
                                            <label htmlFor="remeber-9">Swimming pool</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-10" type="checkbox" />
                                            <label htmlFor="remeber-10">Renovation</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-11" type="checkbox" />
                                            <label htmlFor="remeber-11">Security</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-12" type="checkbox" />
                                            <label htmlFor="remeber-12">Garden</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                                <ul>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-13" type="checkbox" />
                                            <label htmlFor="remeber-13">Basket ball court</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-14" type="checkbox" />
                                            <label htmlFor="remeber-14">Renovation</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-15" type="checkbox" />
                                            <label htmlFor="remeber-15">Security</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="tp-contact-input-remeber">
                                            <input id="remeber-16" type="checkbox" />
                                            <label htmlFor="remeber-16">Garden</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="tp-from-bottom d-flex justify-content-between flex-wrap">
                        <div className="tp-hero-tab-search">
                            <button>
                                <span>
                                    <SearchSvg />
                                </span> {" "}
                                Search Property
                            </button>
                        </div>
                        <div className="tp-from-button-box d-flex">
                            <div className="tp-from-button">
                                <button type="button">
                                    <SaveSvgIcon /> Save</button>
                            </div>
                            <div className="tp-from-button">
                                <button type="button">
                                    <ResetSvgIcon /> Reset</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default BannerFromFilter;