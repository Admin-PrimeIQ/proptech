import PropertyDetailsTwoArea from "@/components/Propiedades/PropertyDetailsTwo/DetailsTwo";
import { propertyData } from "@/data/propertyData";
import { PageParamsProps } from "@/types/custom-interface";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata(props: PageParamsProps) {
    const resolvedParams = await props.params;
    const { id } = resolvedParams;
    if (typeof id === "string" && UUID_REGEX.test(id)) {
        return { title: "Property Details" };
    }
    const property = propertyData.find((item) => item.id == Number(id));
    return { title: property?.title ? property.title : "Property Details" };
}

export default async function PropertyDetails(props: PageParamsProps) {
    const resolvedParams = await props.params;
    const { id } = resolvedParams;

    return (
        <main>
            <>
                {/* property details area start */}
                <PropertyDetailsTwoArea id={id} />
                {/* property details area end */}
            </>
        </main>
    );
}