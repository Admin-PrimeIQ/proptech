import { teamAgencyData } from "@/data/teamData";
import TeamRightBox from "./Single/TeamRightBox";
import TeamAgencyItem from "./Single/TeamAgencyItem";

export default function TeamAgencyArea() {
    return (
        <section className="tp-team-inner-ptb pt-120 pb-180">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="tp-team-left-box">
                            {
                                teamAgencyData.slice(0, 5).map((item) => (
                                    <TeamAgencyItem item={item} key={item.id} />
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <TeamRightBox />
                    </div>
                </div>
            </div>
        </section>
    )
}