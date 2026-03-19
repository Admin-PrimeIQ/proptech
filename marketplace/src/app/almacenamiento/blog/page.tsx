
import BlogMainArea from "@/components/Blog/BlogMainArea";
import BreadcrumbTwo from "../../../components/Breadcrumb/BreadcrumbTwo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog - Bhumi Real Estate React NextJs Template",
  };

export default function Blog() {
    return (
        <main>
            {/* breadcrumb area start */}
            <BreadcrumbTwo title="Blog List" subTitle="Blog List" />
            {/* breadcrumb area end */}
            
            {/* blog area start */}
            <BlogMainArea/>
            {/* blog area end */}
        </main>
    )
}
