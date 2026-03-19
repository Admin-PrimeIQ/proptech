import apartmentBg from "../../../public/assets/img/apartment/apartment-bg-2.jpg";
import apartmentTypes from "@/data/apartmentTypeData";
import Image from "next/image";
import Link from "next/link";

export default function HomeThreeApartment() {
    return (
        <section className="tp-apartment-ptb pt-140 pb-110" style={{ backgroundImage: `url(${apartmentBg.src})` }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-apartment-wrap-2 d-flex align-items-center justify-content-center wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                            {
                                apartmentTypes.map((apartment) => (
                                    // Display apartment details with icon, title, and description
                                    <div key={apartment.id} className="tp-apartment-item d-flex align-items-center mb-30">
                                        <div className="tp-apartment-item-icon">
                                            <span><Image src={apartment.image} alt="image" /></span>
                                        </div>
                                        <div className="tp-apartment-item-content">
                                            <h5 className="tp-apartment-item-title"><Link href="#">{apartment.title}</Link></h5>
                                            <p>{apartment.properties} Property</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}