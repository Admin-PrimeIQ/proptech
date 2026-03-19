import useGlobalContext from '@/hooks/useContext';
import OffcanvasMenus from './OffcanvasMenus';
import OffcanvasFilter from './OffcanvasFilter';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { signOut, useSession } from 'next-auth/react';

const LOG_ENDPOINT = process.env.NEXT_PUBLIC_DEBUG_LOG_ENDPOINT?.trim() || '';
function sendLog(payload: Record<string, unknown>) {
  if (!LOG_ENDPOINT) return;
  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, timestamp: Date.now(), sessionId: 'debug-session' }),
  }).catch(() => {});
}

export default function OffcanvasArea() {
    const { openOffcanvas, toggleOffcanvas } = useGlobalContext();
    const { status } = useSession();

    const content = (
        <>
            {/* -- offcanvas area start -- */}
            <div
                className={`offcanvas__area ${openOffcanvas ? "offcanvas-opened" : ""}`}
                onClick={(e) => { if (e.target === e.currentTarget) toggleOffcanvas(); }}
                role="dialog"
                aria-modal={openOffcanvas}
                aria-hidden={!openOffcanvas}
            >
                <div className="offcanvas__wrapper">
                    <div className="offcanvas__close">
                        <button type="button" onClick={toggleOffcanvas} className="offcanvas__close-btn offcanvas-close-btn" aria-label="Cerrar menú">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1 1L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <div className="offcanvas__content">
                        <div className="tp-offcanvas-menu fix d-xl-none mb-30">
                            <nav>
                                <OffcanvasMenus />
                            </nav>
                        </div>

                        <div className="offcanvas__filter-wrap d-lg-none">
                            <OffcanvasFilter />
                        </div>

                        {status === "authenticated" && (
                            <div className="offcanvas__signout-wrap d-lg-none">
                                <button
                                    type="button"
                                    onClick={() => {
                                        toggleOffcanvas();
                                        signOut({ callbackUrl: "/sign-in" });
                                    }}
                                    className="offcanvas-signout-btn"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}

                        <div className="offcanvas__contact d-none d-xl-block">
                            <div className="offcanvas__text mb-30">
                                <p>The design readable content of a page hen looking at its layout The point our of using Movie template</p>
                            </div>
                            <div className="offcanvas__gallery mb-30">
                                <h4 className="offcanvas__title">Gallery</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={toggleOffcanvas} className={`body-overlay ${openOffcanvas ? "opened" : ""}`}></div>
            {/* -- offcanvas area end -- */}
        </>
    );

    useEffect(() => {
      const hasDocument = typeof document !== 'undefined';
      sendLog({
        hypothesisId: 'H1',
        location: 'OffcanvasArea.tsx:mount',
        message: 'Portal usage',
        data: { hasDocument, usingPortal: hasDocument },
      });
      const el = document.querySelector('.offcanvas__area');
      const overlay = document.querySelector('.body-overlay');
      sendLog({
        hypothesisId: 'H1_H5',
        location: 'OffcanvasArea.tsx:useEffect',
        message: 'Offcanvas mount parent',
        data: {
          offcanvasParentTag: el?.parentElement?.tagName ?? null,
          offcanvasParentIsBody: el?.parentElement === document.body,
          bodyOverlayParentTag: overlay?.parentElement?.tagName ?? null,
        },
      });
    }, []);

    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
}
