import shapeImg from "../../../../public/assets/img/team/home-3/team-3-shape.png";
import TeamSocialLinks from "./TeamSocialLinks";
import { ITeamDT } from "@/types/team-d-t";
import Image from "next/image";
import Link from "next/link";

const TeamMember = ({ name, designation, image, socialLinks, id }: ITeamDT) => (
  <div className="tp-team-3-item p-relative mb-30 wow fadeInUp">
    <div className="tp-team-3-item-thumb p-relative">
      <Link href={`/agent-details/${id}`}><Image src={image} alt={name} /></Link>
      <div className="tp-team-3-item-shape">
        <Image style={{width:"100%", height:"auto"}} className="wow" src={shapeImg} alt="shape" />
      </div>
      <TeamSocialLinks {...socialLinks} />
    </div>
    <div className="tp-team-3-item-content">
      <h3 className="tp-team-3-item-title"><Link href={`/agent-details/${id}`}>{name}</Link></h3>
      <p>{designation}</p>
    </div>
  </div>
);

export default TeamMember;
