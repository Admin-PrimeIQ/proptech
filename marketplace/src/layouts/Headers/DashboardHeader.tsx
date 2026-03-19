"use client"

import OffcanvasArea from "../../components/OffCanvas/OffcanvasArea";
import useGlobalContext from "@/hooks/useContext";
import NavMenus from "../subComponents/NavMenus";
import useSticky from "@/hooks/useSticky";
import Link from "next/link";
import SignInForm from "@/components/Form/auth/SignInForm";
import DynamicLogo from "@/components/Logo/DynamicLogo";
import UserAvatarPlaceholder from "@/components/UI/UserAvatarPlaceholder";
import { useSession, signOut } from "next-auth/react";

export default function DashboardHeader() {
    const { data: session, status } = useSession();
    const { toggleOffcanvas } = useGlobalContext();
    const { sticky } = useSticky();
    const isLoggedIn = status === "authenticated" && !!session?.user;

    const renderHeaderContent = () => (
        <div className="container-fluid">
            <div className="row align-items-center">
                <div className="col-xl-2 col-lg-4 col-md-3 col-6">
                    <div className="tp-header-logo d-flex align-items-center">
                        <Link href="/" className="d-flex align-items-center">
                            <DynamicLogo variant="black" width={150} height={60} />
                        </Link>
                    </div>
                </div>
                <div className="col-xl-7 col-lg-4 d-none d-lg-block">
                    <div className="tp-header-dashboard-menu d-flex justify-content-center">
                        <div className="tp-main-menu d-none d-xl-block">
                            <nav className="tp-mobile-menu-active">
                                <NavMenus />
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4 col-md-9 col-6">
                    <div className="tp-header-dashboard-main-right d-flex align-items-center justify-content-end">
                        {/* Sesión: cuadro con nombre de usuario + botón cerrar sesión */}
                        <div className="tp-header-dashboard-user d-flex align-items-center gap-2">
                            {isLoggedIn ? (
                                <>
                                    <div className="tp-header-dashboard-user-box">
                                        <span className="tp-header-dashboard-user-name">
                                            {(session?.user as { nombreCompleto?: string })?.nombreCompleto ?? session?.user?.email ?? ""}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="tp-btn tp-btn-border btn-sm"
                                        onClick={() => signOut({ callbackUrl: "/sign-in" })}
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="p-0 border-0 bg-transparent"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModalToggle"
                                    aria-label="Iniciar sesión"
                                >
                                    <UserAvatarPlaceholder size={40} />
                                </button>
                            )}
                        </div>

                        <div className="tp-header-hamburger d-xl-none offcanvas-open-btn">
                            <button onClick={toggleOffcanvas} className="hamburger-btn">
                                <span></span>
                                <span></span>
                                <span></span> 
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <OffcanvasArea />

            {/* header area start */}
            <header className="tp-header-dashboard-ptb p-relative">
                <div className="tp-header-main-sticky p-relative">
                    {renderHeaderContent()}
                </div>
            </header>
            <header className={`tp-header-2-ptb tp-header-dashboard-sticky p-relative tp-int-menu tp-header-sticky-cloned ${sticky ? "tp-header-pinned" : ""}`}>
                <div className="tp-header-main-sticky tp-header-5-main p-relative">
                    {renderHeaderContent()}
                </div>
            </header>
            {/* header area end */}

            {/* modal area start */}
            <div className="tp-modal-box">
                <div className="modal fade" id="exampleModalToggle" aria-hidden="true" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="tp-sign-in-register-box p-relative text-center">
                                <div className="tp-sign-in-register-heading mb-30">
                                    <h4 className="tp-sign-in-register-title">Hello again</h4>
                                    <p>Enter your credentials to access your account.</p>
                                </div>
                                <div className="tp-sign-in-input-form">
                                    <SignInForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* modal area end */}
        </>
    )
}
