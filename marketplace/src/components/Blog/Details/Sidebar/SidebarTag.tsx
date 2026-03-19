import Link from "next/link";

export default function BlogSidebarTag() {
    return (
        <>
            <div className="tp-sidebar-content">
                <h5 className="tp-sidebar-widget-title">Tag</h5>
                <div className="tagcloud">
                    <Link href="#">Envato</Link>
                    <Link href="#">Development</Link>
                    <Link href="#">Technology</Link>
                    <Link href="#">Wordpress</Link>
                    <Link href="#">PHP</Link>
                    <Link href="#">Branding</Link>
                </div>
            </div>
        </>
    )
}