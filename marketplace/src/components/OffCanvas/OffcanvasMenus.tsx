'use client'
import menu_data_one from "@/data/menuData";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useAdminSubmenu, type AdminSubItem } from "@/hooks/useAdminSubmenu";
import useGlobalContext from "@/hooks/useContext";

const OffcanvasMenus = () => {
    const [navTitle, setNavTitle] = useState("");
    const { items: adminSubmenu, status } = useAdminSubmenu();
    const { toggleOffcanvas } = useGlobalContext();

    const openMobileMenu = (menu: string) => {
        if (navTitle === menu) {
            setNavTitle("");
        } else {
            setNavTitle(menu);
        }
    };

    const isAdminItem = (url: string) => url === "/administrador";
    const isEnterpriseItem = (url: string) => url === "/enterprise";

    return (
        <ul>
            {menu_data_one.map((menu) => {
                const useAdminDropdown = isAdminItem(menu.url);
                const useEnterpriseDropdown = isEnterpriseItem(menu.url);
                const submenuItems = useAdminDropdown && status === "authenticated"
                    ? adminSubmenu
                    : useEnterpriseDropdown
                        ? (status === "authenticated" ? menu.submenu : [])
                        : menu.submenu;
                const hasSubmenu = menu.home_menu || (submenuItems && submenuItems.length > 0) || (useAdminDropdown && submenuItems && submenuItems.length > 0);

                return (
                    <li key={menu.id} className={menu.home_menu ? 'p-static' : navTitle === menu.label ? 'active' : ''}>
                        <Link href={menu.url} onClick={toggleOffcanvas}>{menu.label}</Link>
                        {menu.home_menu && (
                            <div className="tp-mega-menu" style={{ display: navTitle === menu.label ? "block" : "none" }}>
                                <div className="tp-main-has-submenu">
                                    <div className="row gx-6 row-cols-1 row-cols-md-2 row-cols-lg-5">
                                        {menu.submenu?.map((hm) => (
                                            <div key={hm.id} className="col">
                                                <span>
                                                    <div className="tp-home-thumb">
                                                        <Link href={hm.url} onClick={toggleOffcanvas}>
                                                            <Image style={{ width: "100%", height: "auto" }} src={hm.img!} alt={hm.label} />
                                                        </Link>
                                                    </div>
                                                </span>
                                                <h3 className="tp-home-title">
                                                    <Link href={hm.url} onClick={toggleOffcanvas}>{hm.label}</Link>
                                                </h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {!menu.home_menu && submenuItems && submenuItems.length > 0 && (
                            <ul className="tp-submenu submenu offcanvas-admin-submenu" style={{ display: navTitle === menu.label ? "block" : "none" }}>
                                {status === "authenticated" && useAdminDropdown && adminSubmenu.length > 0 ? (
                                    adminSubmenu.map((sub) => (
                                        <li key={sub.id}>
                                            {(sub as AdminSubItem).signOut ? (
                                                <button
                                                    type="button"
                                                    onClick={() => { toggleOffcanvas(); signOut({ callbackUrl: "/sign-in" }); }}
                                                    className="offcanvas-submenu-btn"
                                                >
                                                    {sub.label}
                                                </button>
                                            ) : (
                                                <Link href={sub.url!} onClick={toggleOffcanvas}>{sub.label}</Link>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    (submenuItems as { id: number; label: string; url: string; authOnly?: boolean; authUrl?: string; guestUrl?: string }[]).map((sm) => {
                                        const href = sm.authOnly
                                            ? (status === "authenticated" ? (sm.authUrl || sm.url) : (sm.guestUrl || "/sign-in"))
                                            : sm.url;
                                        return (
                                            <li key={sm.id}>
                                                <Link href={href} onClick={toggleOffcanvas}>{sm.label}</Link>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        )}
                        {hasSubmenu && (
                            <button onClick={() => openMobileMenu(menu.label)} className="tp-menu-close" aria-label={navTitle === menu.label ? "Cerrar submenú" : "Abrir submenú"}>
                                <i className="far fa-chevron-right"></i>
                            </button>
                        )}
                    </li>
                );
            })}
        </ul>
    )
}

export default OffcanvasMenus;
