import PricingCard from "./subComponents/PricingCard";

const pricingPlans = [
    { name: "Basic", price: "$45", delay: ".3s" },
    { name: "Standard", price: "$55", delay: ".5s", active: true },
    { name: "Premium", price: "$65", delay: ".7s" }
];


export default function PricingPlanTwo() {
    return (
        <section className="tp-pricing-ptb pt-130 pb-100" style={{ backgroundColor: "#262B35" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-pricing-heading mb-50">
                            <span className="tp-section-title-pre">OUR PRICING PLAN</span>
                            <h4 className="tp-section-title">Choose the right pricing <br /> plan for you</h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {pricingPlans.map((plan, index) => (
                        <PricingCard key={index} {...plan} />
                    ))}
                </div>
            </div>
        </section>
    );
}
