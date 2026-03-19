import PropertyPagination from "@/components/Common/pagination/PropertyPagination";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardPropertyItem from "../property/components/DashboardPropertyItem";
import { propertyData } from "@/data/propertyData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favourite - Bhumi Real Estate React NextJs Template",
};

export default function DashboardFavourite() {
  return (
    <>
      <DashboardLayout>
        <div className="tp-dashboard-property-wrapper">
          <div className="row">
            {/* My Property */}
            {
              propertyData.slice(55, 59).map((property) => (
                <DashboardPropertyItem property={property} key={property.id} />
              ))
            }
            {/* pagination area */}
            <div className="col-lg-12">
              <PropertyPagination />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}