"use client"
import aboutThumb from "../../../public/assets/img/about/home-4/about-4-thumb.jpg";
import { useVideoModal } from "@/provider/VideoProvider";
import { CircleCheckSvg } from "../SVG";
import VideoSvg from "../SVG/VideoSvg";
import StarSvg from "../SVG/StarSvg";
import Image from "next/image";
import Link from "next/link";

export default function AboutHomeFour() {
    const { playVideo } = useVideoModal();
    return (
        <section className="tp-about-4-ptb pt-140 pb-140">
            <div className="container">
                <div className="row">
                    {/* Image Section */}
                    <div className="col-lg-6">
                        <div
                            className="tp-about-4-thumb image-anime wow fadeInLeft"
                            data-wow-duration="1s"
                            data-wow-delay=".3s"
                        >
                            <Image
                                src={aboutThumb}
                                alt="About Us Thumbnail"
                                priority
                            />
                            <div className="tp-about-4-thumb-video-box">
                                <button onClick={() => playVideo("293438220", "vimeo")} className="tp-about-4-thumb-video popup-video">
                                    <span>
                                        <VideoSvg width="12" height="14" />
                                    </span>
                                </button>
                            </div>
                            <div className="tp-about-4-thumb-box">
                                <h4 className="tp-about-4-thumb-title">4.9</h4>
                                <div className="rating-stars">
                                    {[...Array(5)].map((_, index) => (
                                        <StarSvg key={index} />
                                    ))}
                                </div>
                                <p>Puntuación de confianza</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div
                        className="col-lg-6 wow fadeInRight"
                        data-wow-duration="1s"
                        data-wow-delay=".3s"
                    >
                        <div className="tp-about-4-heading">
                            <span className="tp-section-title-pre">
                                ES HORA DE CONOCERNOS
                            </span>
                            <h3 className="tp-section-title">
                                Te ayudamos a encontrar tus nuevos lugares.
                            </h3>
                            <p>
                                Mercado inmobiliario en línea para comprar, vender y alquilar
                                propiedades residenciales y comerciales. Utilizado por millones
                                de inquilinos para encontrar propiedades. Explora millones de propiedades
                                en tu ciudad y guarda tus favoritas.
                            </p>
                        </div>

                        {/* List Section */}
                        <div className="tp-about-4-list">
                            <ul>
                                <li>
                                    <span>
                                        <CircleCheckSvg />
                                    </span>
                                    Más de 10 años de experiencia
                                </li>
                                <li>
                                    <span>
                                        <CircleCheckSvg />
                                    </span>
                                    Más de 1000 clientes confían en nuestra agencia
                                </li>
                            </ul>
                        </div>
                        {/* Button Section */}
                        <div className="tp-about-btn d-flex">
                            <Link className="tp-btn mb-20" href="/about">
                                <span className="btn-wrap">
                                    <b className="text-1">Sobre la Empresa</b>
                                    <b className="text-2">Sobre la Empresa</b>
                                </span>
                            </Link>

                            <Link className="tp-btn btn-2 mb-20" href="/propiedades">
                                <span className="btn-wrap">
                                    <b className="text-1">Buscar Propiedad</b>
                                    <b className="text-2">Buscar Propiedad</b>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
