import { faqTabItemsTwo } from "@/data/faqData";
import { ArrowSvgTwo } from "../SVG";

export default function FaqArea() {
    return (
        <section className="tp-faq-inner-ptb pt-130 pb-130">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center mb-60">
                        <h3 className="tp-section-title fns-70">Frequently Asked Questions</h3>
                    </div>
                    <div className="col-lg-4">
                        <div className="tp-faq-inner-box">
                            {/* Render vertical pill navigation for FAQ tabs */} 
                            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                {faqTabItemsTwo.map((tab, index) => (
                                    <button
                                        key={tab.id}
                                        className={`nav-link ${index === 0 ? "active" : ""}`}
                                        id={`v-pills-${tab.id}-tab`}
                                        data-bs-toggle="pill"
                                        data-bs-target={`#v-pills-${tab.id}`}
                                        type="button"
                                        role="tab"
                                        aria-controls={`v-pills-${tab.id}`}
                                        aria-selected={index === 0}
                                    >
                                        {tab.label} <span><ArrowSvgTwo width="16" height="16" /></span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="tp-faq-inner-content">
                            <div className="tab-content" id="v-pills-tabContent">
                               {/* Render FAQ tabs with accordion content */} 
                                {faqTabItemsTwo.map((tab, faqIndex) => (
                                    <div
                                        key={tab.id}
                                        className={`tab-pane fade ${faqIndex === 0 ? "show active" : ""}`}
                                        id={`v-pills-${tab.id}`}
                                        role="tabpanel"
                                        aria-labelledby={`v-pills-${tab.id}-tab`}
                                    >
                                        <div className="tp-faq-inner-item">
                                            <div className="tp-faq-box">
                                                <div className="accordion accordion-flush" id={`accordion-${tab.id}`}>
                                                    {tab.content.map((faq, faqIndex) => (
                                                        <div key={faq.id} className="accordion-item">
                                                            <h2 className="accordion-header">
                                                                <button
                                                                    className={`accordion-button ${faqIndex === 1 ? "" : "collapsed"}`}
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#collapse-${faq.id}`}
                                                                    aria-expanded={faqIndex === 1 ? "true" : "false"}
                                                                    aria-controls={`collapse-${faq.id}`}
                                                                >
                                                                    {faq.question}
                                                                    <span className="accordion-btn"></span>
                                                                </button>
                                                            </h2>
                                                            <div
                                                                id={`collapse-${faq.id}`}
                                                                className={`accordion-collapse collapse ${faqIndex === 1 ? "show" : ""}`}
                                                                data-bs-parent={`#accordion-${tab.id}`}
                                                            >
                                                                <div className="accordion-body">{faq.answer}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
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