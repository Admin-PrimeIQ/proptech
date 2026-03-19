import Link from "next/link";

type SocialLinksProps = {
    /** "hero" = barra lateral en hero (default). "header" = inline en columna del logo. */
    variant?: "hero" | "header";
    /** Solo para variant="header" en HeaderOne: si sticky, iconos negros. */
    sticky?: boolean;
};

// SocialLinks Component
export function SocialLinks({ variant = "hero", sticky }: SocialLinksProps) {
    const links = (
        <>
            <Link href="https://www.instagram.com/" target="_blank"><span><i className="fa-brands fa-instagram"></i></span></Link>
            <Link href="https://www.whatsapp.com/" target="_blank"><span><i className="fa-brands fa-whatsapp"></i></span></Link>
            <Link href="https://www.facebook.com/" target="_blank"><span><i className="fa-brands fa-facebook-f"></i></span></Link>
        </>
    );

    if (variant === "header") {
        return (
            <div className="tp-header-social" data-sticky={sticky ? "true" : undefined}>
                {links}
            </div>
        );
    }

    return <div className="tp-hero-social">{links}</div>;
}

export function SocialLinksTwo() {
    return (
        <>
            <Link href="https://www.facebook.com/" target="_blank"><span><i className="fa-brands fa-facebook-f"></i></span></Link>{" "}
            <Link href="https://www.behance.net/" target="_blank"><span><i className="fa-brands fa-behance"></i></span></Link>{" "}
            <Link href="https://www.linkedin.com/" target="_blank"><span><i className="fa-brands fa-linkedin-in"></i></span></Link>{" "}
            <Link href="https://www.instagram.com/" target="_blank"><span><i className="fa-brands fa-instagram"></i></span></Link>
        </>
    )
}
export function SocialLinksThree() {
    return (
        <>
            <Link href="https://www.facebook.com/" target="_blank"><i className="fab fa-facebook-f"></i></Link>{" "}
            <Link href="https://www.instagram.com/" target="_blank"><i className="fa-brands fa-instagram"></i></Link>{" "}
            <Link href="https://vimeo.com/" target="_blank"><i className="fa-brands fa-vimeo-v"></i></Link>{" "}
            <Link href="https://www.pinterest.com/" target="_blank"><i className="fa-brands fa-pinterest-p"></i></Link>
        </>
    )
}

export function FooterSocialLinks() {
    return (
        <>
            <Link href="https://www.facebook.com/" target="_blank"><i className="fab fa-facebook-f"></i></Link>{" "}
            <Link href="https://www.instagram.com/" target="_blank"><i className="fa-brands fa-instagram"></i></Link>{" "}
            <Link href="https://www.pinterest.com/" target="_blank"><i className="fa-brands fa-pinterest-p"></i></Link>{" "}
            <Link href="https://x.com/" target="_blank"><i className="fab fa-twitter"></i></Link>
        </>
    )
}




