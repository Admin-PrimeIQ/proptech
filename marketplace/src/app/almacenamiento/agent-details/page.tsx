
import AgentDetaisMain from "@/components/Agent/Details/AgentDetaisMain";
import BreadcrumbArea from "@/components/Breadcrumb/BreadcrumbArea";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Agent Details - Bhumi Real Estate React NextJs Template",
  };

export default async function AgentDetails() {

    return (
        <main>
             <>
                   {/* breadcrumb area */}
                   <BreadcrumbArea title="Agent Details" />
                    {/* breadcrumb area end */}

                    {/*agent details area start */}
                    <AgentDetaisMain id={1}/>
                    {/*agent details area end */}
                </>
        </main>
    );
}