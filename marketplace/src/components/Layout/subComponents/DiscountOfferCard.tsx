import detailsThumb from "../../../../public/assets/img/team/team-details/details-thumb-1.jpg";
import Image from "next/image";
import Link from "next/link";

interface IPropsWrapperCls {
    wrapperCls?: string;
}
export default function DiscountOfferCard({ wrapperCls }: IPropsWrapperCls) {
    return (
        <>
            <div className={`${wrapperCls ? wrapperCls : "tp-team-details-widget"} mb-40`}>
                <div className="tp-team-details-discount p-relative">
                    <div className="tp-team-details-discount-thumb">
                        <Image style={{width:"100%", height:"auto"}} src={detailsThumb} alt="thumb" />
                    </div>
                    <div className="tp-team-details-discount-content">
                        <h4>Get 70% discount <br />
                            on amazon</h4>
                        <Link href="/contact">Try Now</Link>
                    </div>
                </div>
            </div>
        </>
    )
}