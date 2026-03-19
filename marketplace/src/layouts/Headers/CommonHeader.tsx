
"use client";
import OffcanvasArea from "../../components/OffCanvas/OffcanvasArea";
import WishlistIconSvg from "@/components/SVG/WishlistIconSvg";
import useShoppingCartMetrics from "@/hooks/useCart";
import useGlobalContext from "@/hooks/useContext";
import NavMenus from "../subComponents/NavMenus";
import Link from "next/link";
import DynamicLogo from "@/components/Logo/DynamicLogo";
import { SocialLinks } from "@/components/UI/SocialLinks";
import { signOut, useSession } from "next-auth/react";
import UserSvg from "@/components/SVG/UserSvg";
import { useEffect, useRef, useState } from "react";

export default function CommonHeader({ wrapClass = "" }) {
    const { data: session, status } = useSession();
    const { useWishlstQuantity } = useShoppingCartMetrics();
    const { toggleOffcanvas } = useGlobalContext();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const closeMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const TotalWishlistQuantity = useWishlstQuantity();
    const isLoggedIn = status === "authenticated" && !!session?.user;
    const roles = session?.user?.roles ?? [];
    const isAdminOrSuperAdmin = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN") || roles.includes("SUPERADMIN");
    const userName = isLoggedIn
        ? ((session?.user as { nombreCompleto?: string | null })?.nombreCompleto ?? session?.user?.name ?? session?.user?.email ?? "")
        : "";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!userMenuRef.current) return;
            if (!userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        return () => {
            if (closeMenuTimeoutRef.current) {
                clearTimeout(closeMenuTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled((window.scrollY ?? 0) > 24);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleUserMenuEnter = () => {
        if (closeMenuTimeoutRef.current) {
            clearTimeout(closeMenuTimeoutRef.current);
            closeMenuTimeoutRef.current = null;
        }
        setIsUserMenuOpen(true);
    };

    const handleUserMenuLeave = () => {
        if (closeMenuTimeoutRef.current) {
            clearTimeout(closeMenuTimeoutRef.current);
        }
        closeMenuTimeoutRef.current = setTimeout(() => {
            setIsUserMenuOpen(false);
        }, 180);
    };

    // Header Content Component
    const renderHeaderContent = ({ toggleOffcanvas }: { toggleOffcanvas: () => void }) => (
        <div className="container container-large">
            <div className="row align-items-center tp-header-mobile-row">
                <div className="col-xl-3 col-lg-3 col-md-3 col-4 tp-header-mobile-logo">
                    <div className="tp-header-logo tp-header-logo-stack">
                        <Link href="/" className="tp-header-logo-link">
                            <DynamicLogo variant="black" width={152} height={48} />
                        </Link>
                    </div>
                </div>
                <div className="col-xl-6 col-lg-6 d-none d-lg-block">
                    <div className="tp-header-2-menu">
                        <div className="tp-main-menu">
                            <nav className="tp-mobile-menu-active">
                                <NavMenus />
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-9 col-4 tp-header-mobile-contents">
                    <div className="tp-header-5-main-right d-flex align-items-center justify-content-end tp-header-mobile-right-inner">
                        <div className="tp-header-social-between d-none d-lg-flex align-items-center">
                            <SocialLinks variant="header" />
                        </div>
                        <div className="tp-header-mobile-user-group d-flex align-items-center">
                            <div className="tp-header-right-wishlist color-black tp-header-wishlist-spacing d-flex align-items-center">
                                <Link href="/favoritos" className="tp-header-favoritos-link d-flex align-items-center">
                                    <span>
                                        <WishlistIconSvg color="#000" />
                                    </span>
                                    <em>{TotalWishlistQuantity}</em>
                                </Link>
                            </div>
                            <div className="tp-header-right-user-common d-flex align-items-center">
                                <div
                                    className="tp-header-user-menu"
                                    ref={userMenuRef}
                                    onMouseEnter={handleUserMenuEnter}
                                    onMouseLeave={handleUserMenuLeave}
                                >
                                    <button
                                        type="button"
                                        title={isLoggedIn ? userName : "Cuenta"}
                                        className="tp-header-user-icon-only"
                                        onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                        aria-expanded={isUserMenuOpen}
                                        aria-haspopup="menu"
                                    >
                                        <span><UserSvg /></span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <ul className="tp-header-user-dropdown" role="menu" onMouseEnter={handleUserMenuEnter}>
                                            {isLoggedIn ? (
                                                <>
                                                    <li role="none">
                                                        <Link href="/dashboard/my-profile" role="menuitem" onClick={() => setIsUserMenuOpen(false)}>
                                                            Mi perfil
                                                        </Link>
                                                    </li>
                                                    {isAdminOrSuperAdmin && (
                                                        <li role="none">
                                                            <Link href="/administrador/general" role="menuitem" onClick={() => setIsUserMenuOpen(false)}>
                                                                Panel de administrador
                                                            </Link>
                                                        </li>
                                                    )}
                                                    <li role="none">
                                                        <button
                                                            type="button"
                                                            role="menuitem"
                                                            className="tp-header-user-dropdown-btn"
                                                            onClick={() => {
                                                                setIsUserMenuOpen(false);
                                                                signOut({ callbackUrl: "/sign-in" });
                                                            }}
                                                        >
                                                            Cerrar sesion
                                                        </button>
                                                    </li>
                                                </>
                                            ) : (
                                                <>
                                                    <li role="none">
                                                        <Link href="/sign-in" role="menuitem" onClick={() => setIsUserMenuOpen(false)}>
                                                            Iniciar sesion
                                                        </Link>
                                                    </li>
                                                    <li role="none">
                                                        <Link href="/sign-up" role="menuitem" onClick={() => setIsUserMenuOpen(false)}>
                                                            Crear cuenta
                                                        </Link>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="tp-header-hamburger d-lg-none offcanvas-open-btn">
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
            {/* Main Header */}
            <header className={`tp-header-5-ptb tp-header-fixed p-relative ${isScrolled ? "tp-header-pinned" : ""} ${wrapClass}`}>
                <div className="tp-header-main-sticky p-relative">
                    {renderHeaderContent({ toggleOffcanvas })}
                </div>
            </header>

            {/* Offcanvas Area */}
            <OffcanvasArea />
        </>
    )
}
