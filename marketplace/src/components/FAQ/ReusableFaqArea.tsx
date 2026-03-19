import FaqImg from '../../../public/assets/img/brand/faq.png';
import { faqItemsDataTwo } from '@/data/faqData';
import Image from 'next/image';
import React from 'react';

export default function ReusableFaqArea() {
    return (
        <section className="tp-faq-area pt-140 pb-120">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div
                            className="tp-faq-thumb wow fadeInLeft"
                            data-wow-duration="1s"
                            data-wow-delay=".3s"
                        >
                            <Image src={FaqImg} alt="FAQ" />
                        </div>
                    </div>
                    <div
                        className="col-lg-6 wow fadeInRight"
                        data-wow-duration="1s"
                        data-wow-delay=".3s"
                    >
                        <div className="tp-faq-heading">
                            <span className="tp-section-title-pre">WHAT CLIENTS ASK US</span>
                            <h4 className="tp-section-title">
                                Experience the best real estate service
                            </h4>
                        </div>
                        <div className="tp-faq-box">
                            <div className="accordion accordion-flush" id="accordionFlushExample">
                                {/* Render FAQ items with accordion */} 
                                {faqItemsDataTwo.map(({ id, question, answer, isOpen }) => (
                                    <div className="accordion-item" key={id}>
                                        <h2 className="accordion-header">
                                            <button
                                                className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#${id}`}
                                                aria-expanded={isOpen ? 'true' : 'false'}
                                                aria-controls={id}
                                            >
                                                {question}
                                                <span className="accordion-btn"></span>
                                            </button>
                                        </h2>
                                        <div
                                            id={id}
                                            className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                                            data-bs-parent="#accordionFlushExample"
                                        >
                                            <div className="accordion-body">{answer}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}