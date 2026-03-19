import BlogDetailsArea from "@/components/Blog/Details/BlogDetailsArea";
import BreadcrumbTwo from "../../../components/Breadcrumb/BreadcrumbTwo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog Details - Bhumi Real Estate React NextJs Template",
  };

export default async function BlogDeails() {

    return (
        <main>
            <>
                {/* breadcrumb area start */}
                <BreadcrumbTwo title="Blog Details" subTitle="Blog Details" />
                {/* breadcrumb area end */}

                {/* blog details area start */}
                <BlogDetailsArea id={1} />
                {/* blog details area end */}
            </>
        </main>
    );
}