
import playStore from "../../../../public/assets/img/others/play-store.png";
import appale from "../../../../public/assets/img/others/appale.png";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function FooterAppLinks() {
    return (
        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
            <div className="tp-footer-widget tp-footer-3-col-4 mb-50">
                <div className="tp-footer-widget-content">
                    <div className="tp-footer-widget-contact">
                        <h3 className="tp-footer-widget-title">Get app</h3>

                        <div className="tp-footer-widget-item-box">
                            <Link href="#">
                                <div className="tp-footer-widget-item">
                                    <div className="tp-footer-widget-item-icon">
                                        <Image src={playStore} alt="Google Play" />
                                    </div>
                                    <div className="tp-footer-widget-item-content">
                                        <p>Get it on</p>
                                        <span>Google Play</span>
                                    </div>
                                </div>
                            </Link>

                            <Link href="#">
                                <div className="tp-footer-widget-item">
                                    <div className="tp-footer-widget-item-icon">
                                        <Image src={appale} alt="Apple Store" />
                                    </div>
                                    <div className="tp-footer-widget-item-content">
                                        <p>Get it on</p>
                                        <span>Apple Store</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
