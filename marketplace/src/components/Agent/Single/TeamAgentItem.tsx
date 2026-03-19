import { ITeamDT } from "@/types/team-d-t";
import Image from "next/image";
import { StaticImageData } from "next/image";

type TeamAgentItemProps = {
  id: number;
  image: StaticImageData | string;
  name: string;
  designation?: string;
  socialLinks?: any;
};

// Create a separate component for each team member
export default function TeamAgentItem({ id, image, name, designation }: TeamAgentItemProps) {
    const isExternalImage = typeof image === "string" && /^https?:\/\//i.test(image);
    
    return (
        <div className="tp-team-item text-center">
            <div className="tp-team-thumb p-relative" style={{ aspectRatio: "270/360", overflow: "hidden" }}>
                <Image 
                    src={image} 
                    alt={`${name} - ${designation || "Miembro del equipo"}`}
                    width={270}
                    height={360}
                    style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover"
                    }}
                    unoptimized={isExternalImage}
                />
            </div>
            <div className="tp-team-content">
                <h5 className="tp-team-title">{name}</h5>
                {designation && <p>{designation}</p>}
            </div>
        </div>
    )

};