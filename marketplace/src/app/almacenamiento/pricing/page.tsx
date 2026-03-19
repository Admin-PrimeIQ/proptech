import BreadcrumbArea from "@/components/Breadcrumb/BreadcrumbArea";
import ContactHomeFour from "@/components/Contact/ContactHomeFour";
import CounterHomeFour from "@/components/Counter/CounterHomeFour";
import PricingPlanTwo from "@/components/Pricing/PricingPlanTwo";
import ProgressArea from "@/components/Progress/ProgressArea";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing - Bhumi Real Estate React NextJs Template",
};

export default function Pricing() {
    return (
        <>
            {/* breadcrumb area */}
            <BreadcrumbArea title="Pricing table" />
            {/* breadcrumb area end */}

            {/* counter area start */}
            <CounterHomeFour />
            {/* counter area end */}

            {/* pricing area */}
            <PricingPlanTwo />
            {/* pricing area end */}

            {/* progress area */}
            <ProgressArea paddingTopCls="pt-130" paddingBottomCls="" />
            {/* progress area end */}

            {/* get in touch area */}
            <ContactHomeFour />
            {/* get in touch area end */}
        </>
    )
}