import { CheckSvg } from "@/components/SVG";
import Link from "next/link";

// Data array with counter list items for displaying features
const CounterListData = [
    { text: "Complete 24/7 security" },
    { text: "Beautiful scene around" },
    { text: "Elegant design" },
];

export default function CounterList() {
    return (
        <div className="col-lg-4">
            <div className="tp-counter-wrap">
                <div className="tp-counter-list">
                    <ul>
                        {/* Maps over the data to render each counter item with an icon */}
                        {CounterListData.map((item, index) => (
                            <li key={index}>
                                <span>
                                    <CheckSvg />
                                </span>
                                {item.text}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="tp-counter-btn">
                    {/* Link to contact page with a button */}
                    <Link className="tp-btn" href="/contact">
                        <span className="btn-wrap">
                            <b className="text-1">Let’s Talk Now</b>
                            <b className="text-2">Let’s Talk Now</b>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
