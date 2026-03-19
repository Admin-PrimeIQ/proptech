"use client"
import { propertyData } from "@/data/propertyData";
import PropertySingleCardTwo from "../Common/PropertySingleCardTwo";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function RentAreaHomeFive() {
    //handle wishlist
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlistProducts);
    return (
        <section className="tp-rent-5-ptb pt-130 pb-110" style={{ backgroundColor: "#F0F4FD" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-rent-5-heading text-center mb-40">
                            <h3 className="tp-section-title">Discover our best deals</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        propertyData.slice(41, 47).map((item) => {
                            const isWishlisted = wishlist.some((wishlistItem) => wishlistItem.id === item.id);
                            return (
                                <div className="col-xl-4 col-md-6" key={item.id}>
                                    <PropertySingleCardTwo item={item} isWishlisted={isWishlisted}/>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </section>
    );
}
