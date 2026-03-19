
import ContactInfoList from "./subComponents/ContactInfoList";
import ContactForm from "../Form/ContactForm";

export default function ContactArea({btnClass}:{btnClass?:string}) {
    return (
        <section className="tp-contact-area pb-120 pt-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".3s">
                        <ContactInfoList/>
                    </div>
                    <div className="col-lg-7">
                        <div className="tp-contact-box wow fadeInUp" data-wow-duration="1s" data-wow-delay=".5s">
                            <ContactForm btnClass={btnClass}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}