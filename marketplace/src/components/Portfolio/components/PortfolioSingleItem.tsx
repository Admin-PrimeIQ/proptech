import { IPortfolio } from "@/types/custom-interface";
import Image from "next/image";
import Link from "next/link";

const PortfolioSingleItem: React.FC<IPortfolio> = ({ image, title, location, area, link, delay }) => {
    return (
        <div className="col-xl-3 col-lg-4 col-md-6">
            <div className="tp-portfolio-item p-relative mb-30 wow fadeInUp" data-wow-duration="1s" data-wow-delay={delay}>
                <div className="tp-portfolio-item-thumb">
                    <Image src={image} alt={title} />
                </div>
                <div className="tp-portfolio-item-content">
                    <h4 className="tp-portfolio-item-content-title">
                        <Link className="textline" href={link}>{title}</Link>
                    </h4>
                    <div className="tp-portfolio-item-meta">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9.00003 10.0726C10.2924 10.0726 11.34 9.02492 11.34 7.73258C11.34 6.44023 10.2924 5.39258 9.00003 5.39258C7.70769 5.39258 6.66003 6.44023 6.66003 7.73258C6.66003 9.02492 7.70769 10.0726 9.00003 10.0726Z" stroke="white" strokeWidth="1.5" />
                                <path d="M2.71503 6.3675C4.19253 -0.127498 13.815 -0.119998 15.285 6.375C16.1475 10.185 13.7775 13.41 11.7 15.405C10.1925 16.86 7.80753 16.86 6.29253 15.405C4.22253 13.41 1.85253 10.1775 2.71503 6.3675Z" stroke="white" strokeWidth="1.5" />
                            </svg>{" "}
                            {location}
                        </span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6.00004 14.6666H10C13.3334 14.6666 14.6667 13.3333 14.6667 9.99992V5.99992C14.6667 2.66659 13.3334 1.33325 10 1.33325H6.00004C2.66671 1.33325 1.33337 2.66659 1.33337 5.99992V9.99992C1.33337 13.3333 2.66671 14.6666 6.00004 14.6666Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 1.33325L9.30001 14.6666" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.68673 8.14673L1.33337 10.0001" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>{" "}
                            {area}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioSingleItem;