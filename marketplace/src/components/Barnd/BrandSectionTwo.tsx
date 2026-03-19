import Image from "next/image";
import Link from "next/link";
import brandImg1 from "../../../public/assets/img/brand/home-2/brand-thumb-1.png";
import brandImg2 from "../../../public/assets/img/brand/home-2/brand-thumb-2.png";
import brandImg3 from "../../../public/assets/img/brand/home-2/brand-thumb-3.png";
import brandImg4 from "../../../public/assets/img/brand/home-2/brand-thumb-4.png";
import brandImg5 from "../../../public/assets/img/brand/home-2/brand-thumb-5.png";
import brandImg6 from "../../../public/assets/img/brand/home-2/brand-thumb-6.png";
import brandImg7 from "../../../public/assets/img/brand/home-2/brand-thumb-7.png";
import brandImg8 from "../../../public/assets/img/brand/home-2/brand-thumb-8.png";

// Array of brand images for display in the brand section
const brandData = [
    brandImg1, brandImg2,brandImg3,brandImg4,brandImg5,brandImg6,brandImg7,brandImg8
];

export default function BrandSectionTwo() {
    return (
        <div className="tp-brand-2-border pb-120">
            <div className="container">
                <div className="row gx-0">

                    {brandData.map((image, index) => (
                        // Render brand logos in a responsive grid with links and tooltips
                          <div className="col-lg-3 col-sm-6" key={index}>
                          <div className="tp-brand-2-item p-relative">
                              <Link href="#">
                                  <Image src={image} alt="Brand Logo" />
                              </Link>
                              <div className="tp-brand-2-toltip">
                                  <Link href="#">
                                      <span>Visit Bhumi</span>
                                  </Link>
                              </div>
                          </div>
                      </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
