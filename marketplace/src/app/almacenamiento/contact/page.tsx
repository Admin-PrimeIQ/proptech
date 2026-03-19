import BreadcrumbTwo from "@/components/Breadcrumb/BreadcrumbTwo";
import ContactAreaTwo from "@/components/Contact/ContactAreaTwo";
import ContactFormTwo from "@/components/Form/ContactFormTwo";
import MapArea from "@/components/Contact/MapArea";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact - Bhumi Real Estate React NextJs Template",
  };

export default function Contact() {
    return (
        <>
            {/* breadcrumb area start */}
            <BreadcrumbTwo title="Contact us" subTitle="Contact us" />
            {/* breadcrumb area end */}

            {/* contact area start */}
            <ContactAreaTwo />
            {/* contact area end */}

            {/* map area start  */}
            <MapArea />
            {/* map area end  */}

            {/* contact form area start */}
            <section className="tp-contact-inner-form-ptb">
                <div className="container">
                    <div className="tp-contact-inner-form-shape"> 
                        <h4 className="tp-contact-inner-form-shape-title">real estate</h4>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="tp-contact-inner-wrap">
                                <h4 className="tp-contact-inner-wrap-title">{`Let’s`} talk. Have a project in mind?</h4>
                               <ContactFormTwo/>
                            </div>
                        </div>
                    </div>
                </div >
            </section>
        </>
    )
}
