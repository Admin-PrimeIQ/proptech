import Link from "next/link";

export default function BlogPostTag() {
    return (
        <>
            <div className="tp-postbox-details-tags mb-40">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <div className="tagcloud tp-postbox-details-tag">
                            <h4 className="tp-postbox-details-tag-title">Tags:</h4>{" "}
                            <Link href="#">Education</Link>{" "}
                            <Link href="#">Life Style</Link>{" "}
                            <Link href="#">React</Link>{" "}
                            <Link href="#">Application</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}