
import PropertyDetailsTwoArea from "@/components/Propiedades/PropertyDetailsTwo/DetailsTwo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Property Details - Bhumi Real Estate React NextJs Template",
};

export default async function PropertyDetailsTwo() {
    return (
        <main>
            <>
                {/* property details two main area start */}
                <PropertyDetailsTwoArea id={14} />
                {/* property details two main area end */}
            </>
        </main>
    );
}