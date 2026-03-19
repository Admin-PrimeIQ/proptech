import BreadcrumbArea from "@/components/Breadcrumb/BreadcrumbArea";
import FaqPropertyArea from "@/components/FAQ/FaqPropertyArea";
import FaqContactArea from "@/components/FAQ/FaqContactArea";
import FaqArea from "@/components/FAQ/FaqArea";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ - Bhumi Real Estate React NextJs Template",
  };

export default function Faq() {
    return (
        <>
            {/* breadcrumb area */}
            <BreadcrumbArea title="Faq" />
            {/* breadcrumb area end */}
            
            {/* faq area start */}
            <FaqArea />
            {/* faq area end */}

            {/* faq contact area */}
            <FaqContactArea />
            {/* faq contact area end */}

            {/* faq property area */}
            <FaqPropertyArea />
            {/* faq property area end */}
        </>
    )
}