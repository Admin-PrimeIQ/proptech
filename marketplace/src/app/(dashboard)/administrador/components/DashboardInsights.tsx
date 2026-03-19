import { CircleCheckSvg } from "@/components/SVG";
import PropertyViewChart from "./PropertyViewChart";
import { JSX } from "react";

interface Activity {
    id: number;
    message: JSX.Element;
}

const activities: Activity[] = Array(6).fill(null).map((_, index) => ({
    id: index,
    message: <>Your listing Modern <i>House in Greenville</i> has <br /> been approved!</>
}));

function RecentActivities() {
    return (
        <div className="tp-dashboard-activity">
            <h4 className="tp-dashboard-activity-title mb-50">Recent activities</h4>
            <div className="tp-dashboard-activity-list">
                <ul>
                    {activities.map(activity => (
                        <li key={activity.id}>
                            <span>
                                <CircleCheckSvg />
                            </span>
                            <p>{activity.message}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function DashboardInsights() {
    return (
        <div className="tp-dashboard-down-box">
            <div className="row">
                <div className="col-lg-8">
                    <PropertyViewChart />
                </div>
                <div className="col-lg-4">
                    <RecentActivities />
                </div>
            </div>
        </div>
    );
}
