import chooseImg from "../../../public/assets/img/others/why-chose-thumb.png";
import ChooseSvgThree from "../SVG/ChooseSvg/ChooseSvgThree";
import { ChooseItemProps } from "@/types/custom-interface";
import ChooseSvgOne from "../SVG/ChooseSvg/ChooseSvgOne";
import ChooseSvgTwo from "../SVG/ChooseSvg/ChooseSvgTwo";
import ChooseItem from "./subComponents/ChooseItem";
import Image from "next/image";

// List of items with icons, titles, descriptions, and optional active state
const chooseItems: ChooseItemProps[] = [
    {
        icon: <ChooseSvgOne />,
        title: "Affordable price",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing modo ligula eget dolor. Aenean massa. Cum"
    },
    {
        icon: <ChooseSvgTwo />,
        title: "Clear legality",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing modo ligula eget dolor. Aenean massa. Cum",
        isActive: true
    },
    {
        icon: <ChooseSvgThree />,
        title: "Experienced agents",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing modo ligula eget dolor. Aenean massa. Cum"
    }
];

export default function ChooseArea() {
    return (
        <section className="tp-choose-ptb pb-110 p-relative">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="tp-choose-heading wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".3s">
                            <h3 className="tp-section-title">
                                Comfort is our top <br /> priority for you
                            </h3>
                            <p>
                                At the heart of each of our investments is a strategy to build <br />
                                or buy a portfolio of real estate and the all platform <br />
                                should aim real estate
                            </p>
                            <Image src={chooseImg} alt="choose-image" />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="tp-choose-box wow fadeInRight" data-wow-duration="1s" data-wow-delay=".3s">
                            {chooseItems.map((item, index) => (
                               // Render choose items
                                <ChooseItem key={index} {...item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
