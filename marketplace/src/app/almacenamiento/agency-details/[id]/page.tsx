
import TeamAgencyDetailsMain from "@/components/Agency/Details/TeamAgencyDetailsMain";
import BreadcrumbArea from "@/components/Breadcrumb/BreadcrumbArea";
import { PageParamsProps } from "@/types/custom-interface";
import { propertyData } from "@/data/propertyData";

export async function generateMetadata(props: PageParamsProps) {
    const resolvedParams = await props.params;
    const { id } = resolvedParams;
    const property = propertyData.find((item) => item.id == Number(id));
    return {
        title: property?.title ? property.title : "Agency Details",
    };
}

export default async function AgencyDeails(props: PageParamsProps) {
    const resolvedParams = await props.params;
    const { id } = resolvedParams;

    return (
        <main>
             <>
                    {/* breadcrumb area start */}
                    <BreadcrumbArea title="Agency Details" />
                    {/* breadcrumb area end */}

                    {/* agent details area start */}
                    <TeamAgencyDetailsMain id={id}/>
                    {/* agent details area end */}
                </>
        </main>
    );
}