import React from "react";
import FooterContact from "./subComponents/FooterContact";
import FooterCompanyInfo from "./subComponents/FooterCompanyInfo";
import FooterCopyright from "./subComponents/FooterCopyright";

// Home-3 Footer component (sin newsletter)
export default function HomeThreeFooter() {
    return (
        <footer className="tp-footer-area p-relative pt-140">
            <div className="tp-footer-bg"></div>
            <div className="container">
                <div className="tp-footer-widget-border">
                    <div className="row">
                        <FooterContact />
                        <FooterCompanyInfo />
                    </div>
                </div>
                <FooterCopyright />
            </div>
        </footer>
    );
}

