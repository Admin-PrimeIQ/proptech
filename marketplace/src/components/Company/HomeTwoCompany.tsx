"use client"
import companyThumb from '../../../public/assets/img/newsletter/company-thumb.jpg';
import { CompanyItemProps } from '@/types/custom-interface';
import AnimatedCounter from '../Counter/AnimatedCounter';
import { companyStats } from '@/data/companyStatsData';

// Renders company item with animated value and optional suffix.
const CompanyItem: React.FC<CompanyItemProps> = ({ label, value, suffix = '', index }) => (
    <div className="tp-company-item d-flex justify-content-between align-items-center">
        <span>{label}</span>
        <h4 className="tp-company-title">
            {index === 2 && <span>$</span>}
            <AnimatedCounter min={0} max={value} />
            {suffix}
        </h4>
    </div>
);

export default function HomeTwoCompany() {
    return (
        <section
            className="tp-company-ptb pt-140 p-relative include-bg"
            style={{ backgroundImage: `url(${companyThumb.src})` }}
        >
            <div className="container">
                <div className="row">
                    <div className="col-lg-5"></div>
                    <div className="col-lg-7">
                        <div
                            className="tp-company-wrapper p-relative wow fadeInRight"
                            data-wow-duration="1s"
                            data-wow-delay=".3s"
                        >
                            <div className="tp-company-tag">
                                <span>AWARD WINNER COMPANY</span>
                            </div>
                            {/*renders company stats using CompanyItem component. */}
                            {companyStats.map((item, index) => (
                                <CompanyItem
                                    key={index}
                                    {...item}
                                    index={index}
                                />
                            ))}
                            <p>
                                Located in the middle of a beautiful landscape our <br />
                                property is waiting for you and your family <br />
                                to stay and enjoy a relaxing experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
