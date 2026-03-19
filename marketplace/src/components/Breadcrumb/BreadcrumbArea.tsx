import breadcrumbBg from "../../../public/assets/img/others/breadcrumb.jpg";
import Link from "next/link";

type BreadcrumbAreaProps = {
    title: string;
    /** Si se pasa, usa esta URL como fondo (ej. misma imagen que el hero principal). */
    backgroundImageUrl?: string | null;
};

export default function BreadcrumbArea({ title, backgroundImageUrl }: BreadcrumbAreaProps) {
    const bgUrl = backgroundImageUrl || breadcrumbBg.src;
    return (
        <section className="tp-breadcrumb__ptb p-relative z-index-1 fix">
            <div
                className="tp-breadcrumb__bg"
                style={{
                    backgroundImage: `url(${bgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            ></div>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-sm-12">
                        <div className="tp-breadcrumb__content">
                            <h3 className="tp-breadcrumb__title">{title}</h3>
                            <div className="tp-breadcrumb__list">
                                <span><Link href="/">Home</Link></span>{" "}
                                <span className="dvdr"></span>{" "}
                                <span>{title}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
