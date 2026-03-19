import BlogDetailsArea from "@/components/Blog/Details/BlogDetailsArea";
import BreadcrumbTwo from "../../../../components/Breadcrumb/BreadcrumbTwo";
import { propertyData } from "@/data/propertyData";
import { PageParamsProps } from "@/types/custom-interface";

export async function generateMetadata(props: PageParamsProps) {
    const resolvedParams = await props.params;
    const { id } = resolvedParams;
    const property = propertyData.find((item) => item.id == Number(id));
    return {
        title: property?.title ? property.title : "Blog Details",
    };
}

export default async function BlogDeails(props: PageParamsProps) {
    const resolvedParams = await props.params;
    const { id } = resolvedParams;

    return (
        <main>
            <>
                {/* breadcrumb area start */}
                <BreadcrumbTwo title="Blog Details" subTitle="Blog Details" />
                {/* breadcrumb area end */}

                {/* blog details area start */}
                <BlogDetailsArea id={id} />
                {/* blog details area end */}
            </>
        </main>
    );
}