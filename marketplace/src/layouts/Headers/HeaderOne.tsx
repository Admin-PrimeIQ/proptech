"use client";
import React from "react";
import OffcanvasArea from "../../components/OffCanvas/OffcanvasArea";
import useShoppingCartMetrics from "@/hooks/useCart";
import useGlobalContext from "@/hooks/useContext";
import { WishlistIconSvg } from "@/components/SVG";
import NavMenus from "../subComponents/NavMenus";
import UserSvg from "@/components/SVG/UserSvg";
import useSticky from "@/hooks/useSticky";
import Link from "next/link";
import DynamicLogo from "@/components/Logo/DynamicLogo";
import { SocialLinks } from "@/components/UI/SocialLinks";
import { useSession } from "next-auth/react";

export default function HeaderOne() {
  const { data: session, status } = useSession();
  const { toggleOffcanvas } = useGlobalContext();
  const { sticky } = useSticky();
  const { useWishlstQuantity } = useShoppingCartMetrics();
  const TotalWishlistQuantity = useWishlstQuantity();
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const userName = isLoggedIn
    ? ((session?.user as { nombreCompleto?: string | null })?.nombreCompleto ?? session?.user?.name ?? session?.user?.email ?? "")
    : "";

  const renderHeaderContent = () => (
    <div className="container container-large">
      <div className="row align-items-center tp-header-mobile-row">
        <div className="col-xl-2 col-lg-4 col-md-3 col-4 tp-header-mobile-logo">
          <div className="tp-header-logo tp-header-logo-stack">
            <Link href="/" className="tp-header-logo-link">
              <DynamicLogo 
                variant={sticky ? "black" : "white"} 
                width={150}
                height={60}
              />
            </Link>
            <div className="tp-header-social">
              <SocialLinks variant="header" sticky={sticky} />
            </div>
          </div>
        </div>
        <div className="col-xl-7 col-lg-4 d-none d-lg-block">
          <div className="tp-header-1-menu">
            <div className="tp-main-menu">
              <nav>
                <NavMenus />
              </nav>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-md-9 col-4 tp-header-mobile-contents">
          <div className="tp-header-main-right d-flex align-items-center justify-content-end tp-header-mobile-right-inner">
            <div className="tp-header-mobile-user-group d-flex align-items-center">
              <div className="tp-header-right-wishlist tp-header-wishlist-spacing">
                <Link href="/favoritos"><span>
                  <WishlistIconSvg color="currentColor" />
                </span>
                  <em>{TotalWishlistQuantity}</em>
                </Link>
              </div>
              <div className="tp-header-right-user-icon">
                {isLoggedIn ? (
                  <Link href="/dashboard/my-profile" title={userName}>
                    <span><UserSvg /></span>
                  </Link>
                ) : (
                  <Link href="/sign-in" title="Iniciar sesión">
                    <span><UserSvg /></span>
                  </Link>
                )}
              </div>
              <div className="tp-header-right-user-content d-none d-md-block">
                {isLoggedIn ? (
                  <Link href="/dashboard/my-profile" className="tp-header-user-link d-flex flex-column">
                    <p className="mb-0">
                      <span className="tp-header-user-label">Usuario: </span>
                      <span className="tp-header-user-name">{userName || "Mi cuenta"}</span>
                    </p>
                    <span>Mi cuenta</span>
                  </Link>
                ) : (
                  <Link href="/sign-in" className="tp-header-sign-in-link">
                    <p>Inicia sesión</p>
                    <span>Tu cuenta</span>
                  </Link>
                )}
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
      {/* Header visible al inicio: mismo aspecto que al hacer scroll (fondo blanco, iconos oscuros, sin pausa) */}
      <header className="tp-header-1-ptb tp-header-transparent tp-header-look-pinned top p-relative">
        <div className="tp-header-main-sticky tp-header-1-main p-relative">
          {renderHeaderContent()}
        </div>
      </header>
      <header className={`tp-header-1-ptb p-relative tp-int-menu tp-header-sticky-cloned ${sticky ? "tp-header-pinned" : ""}`}>
        <div className="tp-header-main-sticky tp-header-1-main p-relative">
          {renderHeaderContent()}
        </div>
      </header>
      {/* Offcanvas Area */}
      <OffcanvasArea />
    </>
  );
};
