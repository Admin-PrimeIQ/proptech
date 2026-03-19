import newsletterThumb from "../../../public/assets/img/newsletter/newsletter-thumb.png";
import faqImg from "../../../public/assets/img/brand/faq-2.jpg";
import { faqItemsData } from "@/data/faqData";
import { CheckThreeSvg } from "../SVG";
import Image from "next/image";
import Link from "next/link";

export default function FaqHomeFour() {
  return (
    <section className="tp-faq-4-ptb fix p-relative pt-140 pb-140">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div
              className="tp-faq-4-thumb p-relative wow fadeInLeft"
              data-wow-duration="1s"
              data-wow-delay=".3s"
            >
              <div className="image-anime">
                <Image src={faqImg} alt="FAQ Image" />
              </div>

              <div className="tp-faq-4-shapes tp-newsletter-content">
                <div className="tp-apartment-item d-flex align-items-center mb-30">
                  <div className="tp-apartment-item-icon">
                    <Image
                      src={newsletterThumb}
                      alt="Apartment"
                    />
                  </div>
                  <div className="tp-apartment-item-content">
                    <h5 className="tp-apartment-item-title">
                      <Link href="#">Apartments</Link>
                    </h5>
                    <p>From $56 000</p>
                  </div>
                </div>
                {/* Render a list of features with icons for each item */} 
                {[
                  "Local Area Knowledge",
                  "Proven Expertise",
                ].map((text, index) => (
                  <div
                    key={index}
                    className={`tp-newsletter-item ${index === 0 ? "one" : "two"}`}
                  >
                    <span>
                      <CheckThreeSvg />
                      {" "}
                      {text}
                    </span>
                  </div>
                ))}
              </div>
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
                {/* Render each FAQ item with accordion toggle and content */} 
                {faqItemsData.map(({ id, question, answer, isOpen }) => (
                  <div className="accordion-item" key={id}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${id}`}
                        aria-expanded={isOpen}
                        aria-controls={id}
                      >
                        {question}
                        <span className="accordion-btn"></span>
                      </button>
                    </h2>
                    <div
                      id={id}
                      className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
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
