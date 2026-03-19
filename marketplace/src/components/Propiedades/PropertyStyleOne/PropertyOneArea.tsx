"use client"
import PropertySingleCard from "@/components/Common/PropertySingleCard";
import PropertyListCardItem from "./subComponents/PropertyListCardItem";
import { usePropertyData } from "@/hooks/usePropertyData";

export default function PropertyOneArea() {
    const propertyData = usePropertyData();
    return (
        <>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <div className="row">
                    {propertyData.slice(59, 67).map((item) => (
                            <div className="col-xl-6 col-sm-12" key={item.id}>
                                <PropertySingleCard item={item} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    {
                        propertyData.slice(20, 25).map((item) => (
                            <div className="co-lg-12" key={item.id}>
                                <PropertyListCardItem item={item} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}
