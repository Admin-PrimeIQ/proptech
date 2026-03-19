import Image from "next/image";
import Link from "next/link";
import { getCategoriasConConteo } from "@/lib/categorias-conteo";
import ApartmentIcon1 from "../../../public/assets/img/apartment/apartment-icon-1.png";
import ApartmentIcon2 from "../../../public/assets/img/apartment/apartment-icon-2.png";
import ApartmentIcon3 from "../../../public/assets/img/apartment/apartment-icon-3.png";
import ApartmentIcon4 from "../../../public/assets/img/apartment/apartment-icon-4.png";
import ApartmentIcon5 from "../../../public/assets/img/apartment/apartment-icon-5.png";
import ApartmentIcon6 from "../../../public/assets/img/apartment/apartment-icon-6.png";
import ApartmentIcon7 from "../../../public/assets/img/apartment/apartment-icon-7.png";

// Array de iconos para rotar entre las categorías
const iconosDisponibles = [
    ApartmentIcon1,
    ApartmentIcon2,
    ApartmentIcon3,
    ApartmentIcon4,
    ApartmentIcon5,
    ApartmentIcon6,
    ApartmentIcon7,
];

export default async function HomeApartmentTypes() {
    const categorias = await getCategoriasConConteo();
    
    // Si no hay categorías, no mostrar la sección
    if (!categorias || categorias.length === 0) {
        return null;
    }

    // Ordenar por conteo descendente (el que tiene más propiedades primero)
    const categoriasOrdenadas = [...categorias].sort((a, b) => b.conteo - a.conteo);
    
    // Calcular cuántos niveles podemos crear con la cantidad de categorías disponibles
    // Nivel 1: 1 elemento, Nivel 2: 2 elementos, Nivel 3: 3 elementos, etc.
    // Total elementos = 1 + 2 + 3 + ... + n = n(n+1)/2
    // Necesitamos encontrar el máximo n tal que n(n+1)/2 <= categoriasOrdenadas.length
    let numeroNiveles = 0;
    let totalElementos = 0;
    while (totalElementos + (numeroNiveles + 1) <= categoriasOrdenadas.length) {
        numeroNiveles++;
        totalElementos += numeroNiveles;
    }

    // Inicializar niveles
    const niveles: typeof categoriasOrdenadas[] = [];
    for (let i = 0; i < numeroNiveles; i++) {
        niveles.push([]);
    }

    // Distribuir categorías secuencialmente en niveles
    // Nivel 0: 1 elemento (índice 0)
    // Nivel 1: 2 elementos (índices 1-2)
    // Nivel 2: 3 elementos (índices 3-5)
    // Nivel 3: 4 elementos (índices 6-9)
    // etc.
    let indiceActual = 0;
    for (let nivel = 0; nivel < numeroNiveles; nivel++) {
        const elementosEnNivel = nivel + 1; // Nivel 0 tiene 1, nivel 1 tiene 2, etc.
        for (let i = 0; i < elementosEnNivel && indiceActual < categoriasOrdenadas.length; i++) {
            niveles[nivel].push(categoriasOrdenadas[indiceActual]);
            indiceActual++;
        }
    }

    // Calcular escalas para cada nivel (el nivel superior es más grande)
    const escalasPorNivel = niveles.map((_, nivelIndex) => {
        if (numeroNiveles === 1) return 1.0;
        const factorReduccion = nivelIndex / (numeroNiveles - 1);
        // Escala de 1.0 (nivel superior) a 0.75 (nivel inferior)
        return Math.max(0.75, 1 - (factorReduccion * 0.25));
    });

    return (
        <section className="tp-apartment-area pt-130 pb-110">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="tp-apartment-heading text-center mb-50">
                            <h3 className="tp-section-title">Nuestras propiedades</h3>
                        </div>
                        <div 
                            className="tp-apartment-wrap d-flex flex-column align-items-center wow fadeInUp" 
                            data-wow-duration="1s" 
                            data-wow-delay=".5s"
                            style={{
                                gap: "5px",
                            }}
                        >
                            {niveles.map((nivelCategorias, nivelIndex) => {
                                if (nivelCategorias.length === 0) return null;
                                
                                const escalaNivel = escalasPorNivel[nivelIndex];
                                
                                return (
                                    <div
                                        key={`nivel-${nivelIndex}`}
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            flexWrap: "wrap",
                                            gap: "15px",
                                            width: "100%",
                                            marginBottom: "0",
                                        }}
                                    >
                                        {nivelCategorias.map((categoria, categoriaIndex) => {
                                            const icono = iconosDisponibles[
                                                (nivelIndex * nivelCategorias.length + categoriaIndex) % iconosDisponibles.length
                                            ] || ApartmentIcon1;
                                            
                                            return (
                                                <div 
                                                    key={categoria.idPublic} 
                                                    className="tp-apartment-item d-flex align-items-center"
                                                    style={{
                                                        transform: `scale(${escalaNivel})`,
                                                        transformOrigin: "center center",
                                                        transition: "all 0.3s ease",
                                                    }}
                                                >
                                                    <div className="tp-apartment-item-icon">
                                                        <span>
                                                            <Image src={icono} alt={categoria.nombre} />
                                                        </span>
                                                    </div>
                                                    <div className="tp-apartment-item-content">
                                                        <h5 className="tp-apartment-item-title">
                                                            <Link href={`/propiedades?categoriaIdPublic=${categoria.idPublic}`}>
                                                                {categoria.nombre}
                                                            </Link>
                                                        </h5>
                                                        <p>{categoria.conteo} {categoria.conteo === 1 ? "Propiedad" : "Propiedades"}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}