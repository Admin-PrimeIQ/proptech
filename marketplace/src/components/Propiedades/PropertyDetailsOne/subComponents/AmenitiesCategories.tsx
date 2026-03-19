import { CheckSvg } from "@/components/SVG";

interface AmenityItemProps {
    label: string;
}

function AmenityItem({ label }: AmenityItemProps) {
    return (
        <li>
            <div className="tp-contact-input-remeber property tp-property-category">
                <CheckSvg />
                <span>{label}</span>
            </div>
        </li>
    );
}

interface AmenitiesCategoriesProps {
    amenidades?: Array<{ idPublic: string; nombreAmenidad: string }> | null;
}

export default function AmenitiesCategories({ amenidades }: AmenitiesCategoriesProps) {
    const list = amenidades?.length ? amenidades.map((a) => a.nombreAmenidad) : [];
    const chunkSize = 4;
    const columns = list.length
        ? Array.from({ length: Math.ceil(list.length / chunkSize) }, (_, i) =>
            list.slice(i * chunkSize, i * chunkSize + chunkSize)
          )
        : [];

    return (
        <div className="tp-property-details-checking">
            {columns.length > 0 && (
                <div className="row">
                    {columns.map((column, columnIndex) => (
                        <div key={columnIndex} className="col-12 col-md-6 col-lg-4">
                            <ul>
                                {column.map((amenity, index) => (
                                    <AmenityItem key={index} label={amenity} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
            {list.length === 0 && (
                <p className="text-muted mb-0">Sin amenidades registradas.</p>
            )}
        </div>
    );
}