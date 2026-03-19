import Link from "next/link";
import React from "react";

// Define types for FooterLink and FooterSectionProps
interface FooterLink {
    label: string;
    href: string;
}

interface FooterSectionProps {
    title: string;
    links: FooterLink[];
    footerCol?: number;
}

// Corrected export syntax for FooterColumn
const FooterColumn: React.FC<FooterSectionProps> = ({ title, links, footerCol }) => {
    return (
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className={`tp-footer-widget ${footerCol ? "tp-footer-col-3" : "tp-footer-col-2"} mb-50`}>
                <h3 className="tp-footer-widget-title">{title}</h3>
                <div className="tp-footer-widget-content">
                    <ul>
                        {links.map((link, index) => (
                            <li key={index}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FooterColumn;
