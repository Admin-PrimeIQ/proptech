import TeamAgentAreaTwo from "@/components/Agent/TeamAgentAreaTwo";
import BreadcrumbArea from "@/components/Breadcrumb/BreadcrumbArea";
import CtaArea from "@/components/CTA/CtaArea";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Agent - Bhumi Real Estate React NextJs Template",
  };

export default function Agent() {
    return (
        <>
            {/* breadcrumb area */}
            <BreadcrumbArea title="Agent" />
            {/* breadcrumb area end */}

            {/* team area start */}
            <TeamAgentAreaTwo />
            {/* team area end */}

            {/* cta area */}
            <CtaArea wrapClass="tp-cta-4-ptb" />
            {/* cta area end */}
        </>
    )
}