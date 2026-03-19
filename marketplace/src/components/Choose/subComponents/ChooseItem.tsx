import { ChooseItemProps } from "@/types/custom-interface";

export default function ChooseItem({ icon, title, description, isActive }: ChooseItemProps) {
    return (
        <div className={`tp-choose-item d-flex align-items-center mb-30 ${isActive ? 'active' : ''}`}>
            <div className="tp-choose-item-icon mr-30">
                <span>{icon}</span>
            </div>
            <div className="tp-choose-item-content">
                <h4 className="tp-choose-item-title">{title}</h4>
                <p>{description}</p>
            </div>
        </div>
    )
};