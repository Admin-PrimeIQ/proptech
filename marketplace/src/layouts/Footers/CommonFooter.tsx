import React from "react";
import FooterContact from "./subComponents/FooterContact";
import FooterCompanyInfo from "./subComponents/FooterCompanyInfo";
import FooterCopyright from "./subComponents/FooterCopyright";

// Main Footer: 2 columnas — (1) eslogan, nombre compañía, redes | (2) información empresa
export default function CommonFooter({ className = "pt-100" }) {
  return (
    <footer className={`tp-footer-area p-relative ${className}`}>
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

