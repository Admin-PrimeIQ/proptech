import Image from "next/image";
import thumb1 from "../../../../../public/assets/img/rent/property/property-details-thumb-1.png"
import thumb2 from "../../../../../public/assets/img/rent/property/property-details-thumb-2.png"
import thumb3 from "../../../../../public/assets/img/rent/property/property-details-thumb-3.png"

export default function PropertyGallery() {
    return (
        <div className="row tp-gx-10">
            <div className="col-lg-6">
                <div className="tp-property-details-gallery">
                    <Image className="w-100" src={thumb1} alt="thumb" />
                </div>
            </div>
            <div className="col-lg-6">
                <div className="tp-property-details-gallery mb-20 ">
                    <Image className="w-100" src={thumb2} alt="thumb" />
                </div>
                <div className="tp-property-details-gallery">
                    <Image className="w-100" src={thumb3} alt="thumb" />
                </div>
            </div>
        </div>
    )
}