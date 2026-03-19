"use client";
import { awardsData } from "@/data/awardsData";
import AwardItem from "./subComponents/AwardItem";
import useHoverReveal from "@/hooks/useHoverReveal";

export default function HomeTwoAwards() {
    const { handleMouseMove } = useHoverReveal();

    return (
        <section className="tp-awards-area pt-130 pb-110">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-award-heading mb-50">
                            <span className="tp-section-title-pre">AWARDS OF BHUMI</span>
                            <h3 className="tp-section-title">
                                We are proud of our awards. <br /> Explore latest recognitions
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-awards-item-box">
                            {/* Render award items with animation effect on mouse move */}
                            {awardsData.map((award, index) => (
                                <AwardItem
                                    key={index}
                                    title={award.title}
                                    date={award.date}
                                    description={award.description}
                                    image={award.image}
                                    handleMouseMove={handleMouseMove}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
