import FooterContact from "./subComponents/FooterContact";
import FooterCompanyInfo from "./subComponents/FooterCompanyInfo";

export default function FooterStyleTwo() {
    return (
        <footer className="tp-footer-area p-relative pt-200 pb-80">
            <div className="tp-footer-bg"></div>
            <div className="container">
                    <div className="row">
                        <FooterContact />
                        <FooterCompanyInfo />
                    </div>
            </div>
        </footer>
    )
}