import { CallThreeSvg, TeamEmailSvg } from "@/components/SVG";
import { ITeamDT } from "@/types/team-d-t";
import Image from "next/image";
import Link from "next/link";

export default function TeamAgencyItem({ item }: { item: ITeamDT }) {
    return (
        <div className="tp-team-inner-item d-flex mb-40">
            <div className="tp-team-inner-thumb mr-40">
                <Link href={`/agency-details/${item.id}`}><Image src={item.image} alt="agency image" /></Link>
            </div>
            <div className="tp-team-inner-content">
                <h4 className="tp-team-inner-content-title"><Link href={`/agency-details/${item.id}`}>{item.name}</Link></h4>
                <p>agent at <span>{item.designation} </span></p>
                <div className="tp-team-details-info-contact">
                    <Link href="tel:2566"> <span><CallThreeSvg width="16" height="16" /></span>{item.phone}</Link>
                    <Link href={`mailto:${item.email}`}><span>
                        <TeamEmailSvg />
                    </span>{item.email}</Link>
                </div>
                <div className="tp-team-details-social">
                    {item.socialLinks.facebookLink && (
                        <Link href={item.socialLinks.facebookLink} target="_blank">
                            <span><i className="fa-brands fa-facebook-f"></i></span>
                        </Link>
                    )}{" "}
                    {item.socialLinks.behanceLink && (
                        <Link href={item.socialLinks.behanceLink} target="_blank">
                            <span><i className="fa-brands fa-behance"></i></span>
                        </Link>
                    )}{" "}
                    {item.socialLinks.linkedinLink && (
                        <Link href={item.socialLinks.linkedinLink} target="_blank">
                            <span><i className="fa-brands fa-linkedin-in"></i></span>
                        </Link>
                    )}{" "}
                    {item.socialLinks.instagramLink && (
                        <Link href={item.socialLinks.instagramLink} target="_blank">
                            <span><i className="fa-brands fa-instagram"></i></span>
                        </Link>
                    )}
                </div>
                <div className="tp-team-inner-btn">
                    <Link href={`/agency-details/${item.id}`}>{item.listedProperty}</Link>
                </div>
            </div>
        </div>
    )
}