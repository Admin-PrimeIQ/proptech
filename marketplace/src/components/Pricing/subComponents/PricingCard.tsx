
import { CheckThreeSvg } from "@/components/SVG";
import { IPricingProps } from "@/types/custom-interface";
import Link from "next/link";

const features = [
    "Complete 24/7 security",
    "Beautiful scene around",
    "Elegant design",
    "Free / Pro Ads",
    "Apps Integrated"
];

export default function PricingCard({ name, price, delay, active = false }:IPricingProps) {
    return (
        <div className="col-lg-4 col-md-6">
            <div
                className={`tp-pricing-item p-relative mb-30 wow fadeInUp ${active ? "active" : ""}`}
                data-wow-duration="1s"
                data-wow-delay={delay}
            >
                <div className="tp-pricing-item-heading">
                    <span>{name}</span>
                    <h4 className="tp-pricing-item-title">{price} <span>/month</span></h4>
                </div>
                <div className="tp-pricing-item-btn">
                    <Link className="tp-btn" href="/contact">
                        <span className="btn-wrap">
                            <b className="text-1">Get Started</b>
                            <b className="text-2">Get Started</b>
                        </span>
                    </Link>
                    <p>The most popular plan</p>
                </div>
                <div className="tp-pricing-item-list">
                    <ul>
                        {features.map((feature, index) => (
                            <li key={index}>
                                <span><CheckThreeSvg /></span> {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}