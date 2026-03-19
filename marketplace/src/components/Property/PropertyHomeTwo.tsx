"use client"
import listingBgImg from "../../../public/assets/img/listing/listing-bg.png";
import PropertySingleCard from "../Common/PropertySingleCard";
import { usePropertyData } from "@/hooks/usePropertyData";

export default function PropertyHomeTwo() {
    const propertyData = usePropertyData();
    
    return (
        <section className="tp-listing-area pt-140 pb-110" style={{ backgroundImage: `url(${listingBgImg.src})` }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-listing-heading text-center mb-50">
                            <span className="tp-section-title-pre">Propiedades Destacadas</span>
                            <h3 className="tp-section-title">Propiedades destacadas</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        propertyData.slice(13, 16).map((item) => (
                            <div className="col-lg-4 col-md-6" key={item.id}>
                                    <PropertySingleCard item={item} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}
