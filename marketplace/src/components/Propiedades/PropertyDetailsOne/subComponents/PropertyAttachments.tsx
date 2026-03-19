import PdfFileSvg from "@/components/SVG/PropertyDetailsSvg/PdfFileSvg";

export default function PropertyAttachments() {
    return (
        <div className="tp-property-details-attachment d-flex flex-wrap mb-40">
            <div className="tp-property-details-attachment-item d-flex align-items-center mb-20">
                <div className="tp-property-details-attachment-icon">
                    <span><PdfFileSvg /></span>
                </div>
                <div className="tp-property-details-attachment-content">
                    <h4 className="tp-property-details-attachment-title">Ultra demo PDF file</h4>
                    <span>156.60 kb</span>
                </div>
            </div>
            <div className="tp-property-details-attachment-item d-flex align-items-center mb-20">
                <div className="tp-property-details-attachment-icon">
                    <span><PdfFileSvg /></span>
                </div>
                <div className="tp-property-details-attachment-content">
                    <h4 className="tp-property-details-attachment-title">Ultra demo PDF file</h4>
                    <span>156.60 kb</span>
                </div>
            </div>
        </div>
    )
}