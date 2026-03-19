import Image from "next/image";
import { BathroomsSvg, BedroomsSvg, GarageSvg } from "@/components/SVG";

interface PlanPisoItem {
    nombreDelPlano: string;
    url: string;
}

interface PropertyFloorPlansProps {
    planesPiso?: Array<PlanPisoItem> | null;
    habitaciones?: number | null;
    banos?: number | null;
    parqueos?: number | null;
}

export default function PropertyFloorPlans({
    planesPiso,
    habitaciones,
    banos,
    parqueos,
}: PropertyFloorPlansProps) {
    const planes = planesPiso?.length ? planesPiso : [];
    const hasStats = habitaciones != null || banos != null || parqueos != null;

    return (
        <>
            {hasStats && (
                <div className="tp-property-details-plans d-flex justify-content-between align-items-center mb-30">
                    <div className="tp-property-details-plans-tag d-flex flex-wrap" style={{ gap: "1rem" }}>
                        {habitaciones != null && (
                            <p className="mb-0 d-flex align-items-center" style={{ gap: "6px" }}>
                                <span><BedroomsSvg color="#262B35"/></span> {habitaciones} Habitaciones
                            </p>
                        )}
                        {banos != null && (
                            <p className="mb-0 d-flex align-items-center" style={{ gap: "6px" }}>
                                <span><BathroomsSvg color="#262B35"/></span> {banos} Baños
                            </p>
                        )}
                        {parqueos != null && (
                            <p className="mb-0 d-flex align-items-center" style={{ gap: "6px" }}>
                                <span><GarageSvg color="#262B35"/></span> {parqueos} Parqueos
                            </p>
                        )}
                    </div>
                </div>
            )}

            {planes.length > 0 ? (
                <div className="tp-property-details-plans-thumb d-flex flex-wrap justify-content-center" style={{ gap: "1.5rem" }}>
                    {planes.map((plan, index) => (
                        <div key={plan.url + index} className="tp-property-details-plans-thumb">
                            {plan.nombreDelPlano && (
                                <p className="mb-2 small fw-medium">{plan.nombreDelPlano}</p>
                            )}
                            <Image
                                src={plan.url}
                                alt={plan.nombreDelPlano || `Plano ${index + 1}`}
                                width={600}
                                height={400}
                                style={{ objectFit: "contain", maxWidth: "100%" }}
                                unoptimized={plan.url.startsWith("http")}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted mb-0">Sin planes de piso registrados.</p>
            )}
        </>
    );
}
