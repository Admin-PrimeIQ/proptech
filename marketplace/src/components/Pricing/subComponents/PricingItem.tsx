import { PricingItemProps } from "@/types/custom-interface";
import Link from "next/link";

const PricingItem: React.FC<PricingItemProps> = ({ title, price, discount, isActive = false }) => (
    <div className={`tp-price-item d-flex align-items-center justify-content-between mb-30 ${isActive ? 'active' : ''}`}>
        <div className="tp-price-item-title">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M2.75 8.35075V13.6399C2.75 15.5832 2.75 15.5832 4.58333 16.8207L9.625 19.7357C10.3858 20.1757 11.6233 20.1757 12.375 19.7357L17.4167 16.8207C19.25 15.5832 19.25 15.5832 19.25 13.6491V8.35075C19.25 6.41658 19.25 6.41658 17.4167 5.17908L12.375 2.26408C11.6233 1.82408 10.3858 1.82408 9.625 2.26408L4.58333 5.17908C2.75 6.41658 2.75 6.41658 2.75 8.35075Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48122 12.5188 8.25 11 8.25C9.48122 8.25 8.25 9.48122 8.25 11C8.25 12.5188 9.48122 13.75 11 13.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {title}
            </span>
        </div>
        <div className="tp-price-item-btn">
            <Link href="#"><span>{discount}</span></Link>
        </div>
        <div className="tp-price-item-price">
            <h4>{price}</h4>
        </div>
    </div>
);
export default PricingItem;