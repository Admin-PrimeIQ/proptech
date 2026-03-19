import progressThumb2 from "../../../public/assets/img/listing/home-3/progress-thumb-2.png";
import progressThumb from "../../../public/assets/img/listing/home-3/progress-thumb.png";
import AnimatedCounter from "../Counter/AnimatedCounter";
import { ProgressData } from "@/types/custom-interface";
import Image from "next/image";
import Link from "next/link";

// Progress Wrapper Component
const ProgressWrapper: React.FC<ProgressData> = ({ title, value, counter }) => (
    <div className="tp-progress-wrapper mb-45">
        <div className="tp-progress-title">{title}</div>
        <div className="tp-progress">
            <div 
                className="progress-bar wow slideInLeft" 
                data-wow-duration="1s" 
                data-wow-delay=".1s"
                role="progressbar"
                style={{ width: `${value}%` }}
                aria-valuenow={value} 
                aria-valuemin={0} 
                aria-valuemax={100}
            />
            <span className="tp-progress-counter">{counter}</span>
        </div>
    </div>
);

export default function ProgressArea({paddingTopCls="", paddingBottomCls="pb-130"}) {
    const progressData: ProgressData[] = [
        { title: "Legal amount", value: 50, counter: "$129456" },
        { title: "Interest rate", value: 30, counter: "$50" },
        { title: "Loan tenure", value: 20, counter: "$35" },
    ];

    return (
        <section className={`tp-progress-ptb ${paddingBottomCls} ${paddingTopCls}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-5">
                        <div className="tp-progress-bar-box wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            {progressData.map((item, index) => (
                                <ProgressWrapper 
                                    key={index} 
                                    title={item.title} 
                                    value={item.value} 
                                    counter={item.counter} 
                                />
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="tp-progress-item p-relative wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s"
                            style={{ backgroundImage: `url(${progressThumb.src})` }}>
                            <div className="tp-progress-item-content">
                                <span>Find your</span>
                                <h4 className="tp-progress-item-title">Dream house</h4>
                                <div className="tp-progress-item-btn">
                                    <Link href="#">FOR SALE</Link>
                                </div>
                            </div>
                            <div className="tp-progress-item-shape">
                                <Image src={progressThumb2} alt="progress thumb" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="tp-progress-count-box text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay=".7s">
                            <h4 className="tp-counter-title">
                                $<AnimatedCounter min={0} max={2056} />
                            </h4>
                            <span>Monthly payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}