import TeamRightBox from "../Agency/Single/TeamRightBox";
import TeamAgentItemTwo from "./Single/TeamAgentItemTwo";
import teamAgentData from "@/data/teamData";

export default function TeamAgentAreaTwo() {
    return (
        <section className="tp-team-ptb pt-120 pb-180">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="tp-team-left-box">
                            <div className="tp-team-details-left">
                                {/* Displays team agent items (index 8 to 12) on the left. */}
                                {
                                    teamAgentData.slice(8, 13).map((item) => (
                                        <TeamAgentItemTwo item={item} key={item.id} />
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        {/* Displays the right box with additional content. */}
                        <TeamRightBox />
                    </div>
                </div>
            </div>
        </section>
    )
}