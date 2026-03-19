import { BathroomsSvg, BedroomsSvg, LivingSvg } from "@/components/SVG";
import { teamAgencyData } from "@/data/teamData";
import Image from "next/image";
import Link from "next/link";

export default function RelatedTeamAgencyItem() {
    return (
        <div className="tp-team-details-left">
            {
                teamAgencyData.slice(5, 9).map((item) => (
                    <div className="tp-team-details-warp mb-40" key={item.id}>
                        <div className="tp-property-item d-flex justify-content-between align-items-center">
                            <div className="tp-property-content">
                                <h4 className="tp-property-title"><Link href={`/agency-details/${item.id}`}>{item.name}</Link></h4>
                                <p>{item.address}</p>
                                <span className="tp-property-usd">{`$${item.price}`} USD/mo</span>
                                <div className="tp-property-meta-box">
                                    <div className="tp-property-meta d-flex align-items-center">
                                        <span><BedroomsSvg color="#262B35" /></span>
                                        <p>{item.bathsRoom} Bed</p>
                                    </div>
                                    <div className="tp-property-meta d-flex align-items-center">
                                        <span><BathroomsSvg color="#262B35" /></span>
                                        <p>{item.bathsRoom} Baths</p>
                                    </div>
                                    <div className="tp-property-meta d-flex align-items-center">
                                        <span><LivingSvg color="#262B35" /></span>
                                        <p>{item.livingArea} Sq</p>
                                    </div>
                                </div>
                            </div>
                            <div className="tp-property-thumb p-relative">
                                <Link href={`/agency-details/${item.id}`}><Image src={item.image} alt="agency image" /></Link>
                                <span className="tp-property-tag">FOR RENT</span>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}