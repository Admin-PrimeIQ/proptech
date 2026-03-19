import detailsImg from "../../../../public/assets/img/team/team-details/agent-details.jpg"
import SidebarPropertyItem from "@/components/Layout/subComponents/SidebarPropertyItem";
import DiscountOfferCard from "@/components/Layout/subComponents/DiscountOfferCard";
import UserContactCard from "@/components/Layout/subComponents/UserContactCard";
import { SocialLinksTwo } from "@/components/UI/SocialLinks";
import RelatedTeamAgencyItem from "./RelatedTeamAgencyItem";
import MessageSvg from "@/components/SVG/MessageSvg";
import { IdProps } from "@/types/custom-interface";
import { teamAgencyData } from "@/data/teamData";
import Image from "next/image";
import Link from "next/link";

export default function TeamAgencyDetailsMain({ id }: IdProps) {
    // Fetch agency details based on the provided 'id' prop.
    const agency = teamAgencyData.find((agency) => agency.id == id);

    return (
        <section className="tp-team-details-ptb pt-140 pb-90">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-team-details-box d-flex mb-60">
                            <div className="tp-team-details-thumb">
                                <Image src={detailsImg} style={{width:"100%", height:"auto"}} alt="agency image" />
                            </div>
                            <div className="tp-team-details-content">
                                <h4 className="tp-team-details-content-title">{agency?.name}</h4>
                                <div className="tp-team-details-share d-flex align-items-center flex-wrap">
                                    <div className="tp-team-details-social">
                                        <SocialLinksTwo />
                                    </div>
                                    <div className="tp-team-details-message">
                                        <Link href="#"><span><MessageSvg /></span>Message</Link>
                                    </div>
                                </div>
                                <div className="tp-team-details-text">
                                    <p className="mb-20">The time it takes to sell a home varies, but the average duration is  influenced <br />
                                        like market conditions, pricing, and property  location. In a balanced <br />
                                        it may take several weeks to a few  months.</p>
                                    <p>specializing in property management, investment sales, leasing,  and <br /> appraisal. Founded in 1917, the company has become one of the  world’s <br /> largest and most successful real estate brands. Cushman &  over 70 <br /> countries worldwide and has a global  network </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="tp-team-details-left">
                         {/* Component displaying a related team agency item */}
                            <RelatedTeamAgencyItem />
                            <div className="tp-taem-details-btn mb-40">
                                <Link href="/propiedades" className="tp-btn">
                                    <span className="btn-wrap">
                                        <b className="text-1">View My all Properties</b>
                                        <b className="text-2">View My all Properties</b>
                                    </span>
                                </Link>
                            </div>
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