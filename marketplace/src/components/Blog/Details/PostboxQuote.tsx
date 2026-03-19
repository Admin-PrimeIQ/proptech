import { BlogQuoteSvg } from "@/components/SVG/BlogQuoteSvg";

export default function PostboxQuote() {
    return (
        <div className="tp-postbox-quote mb-40">
            <div className="tp-postbox-quote-box p-relative d-flex">
                <div className="tp-postbox-quote-icon">
                    <span><BlogQuoteSvg /></span>
                </div>
                <div className="tp-postbox-quote-content">
                    <h3 className="tp-postbox-quote-title">“The team at @softecagency is incredibly dedicated,
                        knowledgeable, and helpful.</h3>
                    <div className="tp-postbox-quote-sub">
                        <span>Socrates</span>
                    </div>
                </div>
            </div>
        </div>
    )
}