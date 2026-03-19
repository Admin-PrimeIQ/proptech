import React from "react";
import portfolioThumb1 from "../../../public/assets/img/portfolio/portfolio-thumb-1.jpg";
import portfolioThumb2 from "../../../public/assets/img/portfolio/portfolio-thumb-2.jpg";
import portfolioThumb3 from "../../../public/assets/img/portfolio/portfolio-thumb-3.jpg";
import portfolioThumb4 from "../../../public/assets/img/portfolio/portfolio-thumb-4.jpg";
import PortfolioSingleItem from "./components/PortfolioSingleItem";
import { IPortfolio } from "@/types/custom-interface";

export default function HomeTwoPortfolio() {
    //portfolio data
    const portfolioItems:IPortfolio[] = [
        {
            image: portfolioThumb1,
            title: "Solhuzuret",
            location: "Stavanger",
            area: "160m2",
            link: "/propiedades",
            delay: ".3s"
        },
        {
            image: portfolioThumb2,
            title: "Dragonvain",
            location: "Piramid",
            area: "160m2",
            link: "/propiedades",
            delay: ".5s"
        },
        {
            image: portfolioThumb3,
            title: "Hawavobon",
            location: "Singapore",
            area: "160m2",
            link: "/propiedades",
            delay: ".7s"
        },
        {
            image: portfolioThumb4,
            title: "Sunway",
            location: "Thala",
            area: "160m2",
            link: "/propiedades",
            delay: ".9s"
        }
    ];

    return (
        <section className="tp-portfolio-area pt-125 pb-110">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-portfolio-heading text-center mb-50">
                            <h3 className="tp-section-title">Publicado recientemente</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                  {/* Render each portfolio item using PortfolioSingleItem component */}
                    {portfolioItems.map((item, index) => (
                        <PortfolioSingleItem
                            key={index}
                            image={item.image}
                            title={item.title}
                            location={item.location}
                            area={item.area}
                            link={item.link}
                            delay={item.delay}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

