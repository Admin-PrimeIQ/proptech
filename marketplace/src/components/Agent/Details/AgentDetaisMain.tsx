import agentDetailsImg from "../../../../public/assets/img/team/team-details/team-details.jpg"
import SidebarPropertyItem from "@/components/Layout/subComponents/SidebarPropertyItem";
import DiscountOfferCard from "@/components/Layout/subComponents/DiscountOfferCard";
import UserContactCard from "@/components/Layout/subComponents/UserContactCard";
import { SocialLinksTwo } from "@/components/UI/SocialLinks";
import RelatedPropertyItem from "./RelatedPropertyItem";
import MessageSvg from "@/components/SVG/MessageSvg";
import { IdProps } from "@/types/custom-interface";
import teamAgentData from "@/data/teamData";
import Image from "next/image";
import Link from "next/link";

export default function AgentDetaisMain({ id }: IdProps) {
    // Fetch agent details based on the provided 'id' prop.
    const agent = teamAgentData.find((agent) => agent.id == id);

    return (
        <section className="tp-team-details-ptb pt-140 pb-90">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-team-details-box d-flex mb-60">
                            <div className="tp-team-details-thumb">
                                <Image src={agentDetailsImg}  alt="property image" />
                            </div>
                            <div className="tp-team-details-content">
                                <h4 className="tp-team-details-content-title">{agent?.name}</h4>
                                <div className="tp-team-details-share d-flex align-items-center flex-wrap">
                                    <div className="tp-team-details-social">
                                        <SocialLinksTwo />
                                    </div>
                                    <div className="tp-team-details-message">
                                        <Link href="#"><span><MessageSvg /></span>Message</Link>
                                    </div>
                                </div>
                                <div className="tp-team-details-text mb-40">
                                    <p>The time it takes to sell a home varies, but the average duration is  influenced <br />
                                        like market conditions, pricing, and property  location. In a balanced <br />
                                        it may take several weeks to a few  months.</p>
                                </div>
                                <div className="tp-team-details-list">
                                    <ul>
                                        <li><span>Position:</span> <p>Rental property expert</p></li>
                                        <li><span>Project: </span> <p> 200 Property</p></li>
                                        <li><span>Experience:</span> <p>15+ Years experience</p></li>
                                        <li><span>Phone: </span> <p> 123 2564 8965</p></li>
                                        <li><span>Location: </span> <p> Sydney 134 road, ST</p></li>
                                        <li><span>Location: </span> <p> Sydney 134 road, ST</p></li>
                                        <li><span>Practise area: </span> <p>Sydney 134 road, ST</p></li>
                                        <li><span>Email: </span> <p> bhumi@gmail.com</p></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        <div className="tp-team-details-left">
                            {/* Displays a related property item. */}
                            <RelatedPropertyItem />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="tp-team-details-right">
                            <UserContactCard />
                            {/* discount */}
                            <DiscountOfferCard />
                            {/* property */}
                            <SidebarPropertyItem />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}