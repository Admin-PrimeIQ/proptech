import FacebookSvg from "@/components/SVG/SocialSvg/FacebookSvg";
import LinkedinSvg from "@/components/SVG/SocialSvg/LinkedinSvg";
import TwitterSvg from "@/components/SVG/SocialSvg/TwitterSvg";
import { SocialLinkProps } from "@/types/team-d-t";
import Link from "next/link";

const TeamSocialLinks = ({ facebookLink, twitterLink, linkedinLink }: SocialLinkProps) => (
  <div className="tp-team-3-item-social">
    <Link className="action-1" href={facebookLink}>
      <span><FacebookSvg /></span>
    </Link>
    {twitterLink && (
      <Link className="action-2" href={twitterLink}>
        <span><TwitterSvg /></span>
      </Link>
    )}
    <Link className="action-3" href={linkedinLink}>
      <span><LinkedinSvg /></span>
    </Link>
  </div>
);

export default TeamSocialLinks;

