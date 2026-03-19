import DashboardHomeSvg from "@/components/SVG/DashboardSvg/HomeSvg";

interface IStatsDT {
    label: string;
    value: string;
}
const statsData: IStatsDT[] = [
    { label: "Total pending", value: "06" },
    { label: "Total views", value: "3.9k" },
    { label: "All properties", value: "690" },
    { label: "Total favourites", value: "08" }
];

export default function StatsCardGrid() {
    return (
        <div className="tp-dashboard-up-box">
            <div className="row">
                {statsData.map((stat, index) => (
                    <div key={index} className="col-lg-3 col-sm-6">
                        <div className="tp-dashboard-up-item">
                            <p>{stat.label}</p>
                            <span>{stat.value}</span>
                            <div className="tp-dashboard-up-item-icon">
                                <DashboardHomeSvg />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
