
import teamBgImg from "../../../public/assets/img/team/home-3/team-3-bg.png";
import TeamSection from "./Single/TeamSection";
import teamAgentData from "@/data/teamData";

const pointTitles = [
    "Find your future home",
    "Experienced agents",
    "List your own property",
    "Buy or rent home"
];

const TeamTwoArea = () => (
    // Displays team section with background image and key points.
    <section className="tp-team-3-ptb p-relative include-bg pt-190 pb-110" style={{ backgroundImage: `url(${teamBgImg.src})` }}>
        <TeamSection teamMembers={teamAgentData.slice(5, 8)} sectionTitle="We'll find the perfect home" pointTitles={pointTitles} />
    </section>
);

export default TeamTwoArea;



