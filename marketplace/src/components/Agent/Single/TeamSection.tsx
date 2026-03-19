import AISrartSvg from "@/components/SVG/AISrartSvg";
import { TeamSectionProps } from "@/types/team-d-t";
import TeamMember from "./TeamMember";

const TeamSection = ({ teamMembers, sectionTitle, pointTitles }: TeamSectionProps) => (
    <div className="container">
      <div className="row">
        <div className="col-xl-6 col-lg-4">
          <div className="tp-team-3-haedign">
            <h3 className="tp-section-title">{sectionTitle}</h3>
          </div>
        </div>
        <div className="col-xl-6 col-lg-8">
          <div className="tp-team-3-point-box d-flex flex-wrap">
            {pointTitles.map((title, index) => (
              <div key={index} className="tp-team-3-point d-flex">
                <span><AISrartSvg /></span>
                <h4 className="tp-team-3-point-title">{title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="row">
       {/* Maps through team members and renders each member's details. */}
        {teamMembers.map((member, index) => (
          <div key={index} className="col-lg-4 col-md-6">
            <TeamMember {...member} />
          </div>
        ))}
      </div>
    </div>
);

export default TeamSection;
