import CounterList from "./subComponents/CounterList";
import { ICounterDT } from "@/types/custom-interface";
import AnimatedCounter from "./AnimatedCounter";

// Define the counter data
export const ApproachCounterData: ICounterDT[] = [
    {
        title: "Total area sq",
        count: 560,
        unit: "+",
        borderClass: "border-1",
        description: <><p>Bhumi have include <br /> total area sq</p></>
    },
    {
        title: "We are already sold apartments",
        count: 197,
        unit: "k+",
        borderClass: "border-2",
        description: <><p>We are already sold <br /> out apartments</p></>
    },
    {
        title: "Customers have all over world",
        count: 1980,
        unit: "+",
        borderClass: "border-3",
        description: <><p>Customers have all <br /> over the world</p> </>

    },
    {
        title: "Owned from properties transactions",
        count: 16,
        unit: "M",
        borderClass: "border-4",
        description: <><p>Owned from properties <br /> transactions</p></>
    },
];

export default function HomeApproachCounter() {
    return (
        <section className="tp-counter-area pb-130">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-counter-heading mb-45">
                            <h3 className="tp-section-title">
                                Our approach is all about innovation <br />
                                and effectiveness in real estate <br />
                                solutions.
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Counter List */}
                    <CounterList />
                    {/* Counter Data */}
                    <div className="col-lg-8">
                        <div className="tp-counter-content d-flex flex-wrap">
                             {/* Mapping over ApproachCounterData to render each counter item */}
                            {ApproachCounterData.map((data, index) => (
                                <div className={`tp-counter-item ${data.borderClass}`} key={index}>
                                    {data.description}
                                    <h4 className="tp-counter-title">
                                        {index === 3 && <span>$</span>}
                                        <AnimatedCounter min={0} max={data.count} />
                                        {data.unit}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
