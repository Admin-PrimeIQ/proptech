import { SocialLinkProps } from "@/types/team-d-t";
import Link from "next/link";

// Create a separate component for the social links
export default function TeamAgentSocialLink({ socialLinks }: { socialLinks: SocialLinkProps }) {
    return (
        <div className="tp-team-social-icon">
            {Object.entries(socialLinks).map(([key, link]) => {
                if (link) {
                    const iconClass = `fa-brands fa-${key === "facebookLink" ? "facebook-f" : key === "twitterLink" ? "twitter" : "linkedin-in"}`;
                    return (
                        <Link key={key} className={`action-${Object.keys(socialLinks).indexOf(key) + 1}`} href={link} target="_blank">
                            <span>
                                <i className={iconClass}></i>
                            </span>
                        </Link>
                    );
                }
                return null;
            })}
        </div>
    )
};