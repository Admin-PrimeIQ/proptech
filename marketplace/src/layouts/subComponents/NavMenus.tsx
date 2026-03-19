"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import menu_data_one from "@/data/menuData";
import { useAdminSubmenu, type AdminSubItem } from "@/hooks/useAdminSubmenu";

export default function NavMenus() {
   const [hoveredMenu, setHoveredMenu] = useState<number | null>(menu_data_one[0]?.id || null);
   const { items: adminSubmenu, status } = useAdminSubmenu();

   useEffect(() => {
      setHoveredMenu(menu_data_one[0]?.id || null);
   }, []);

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
            const hasDropdown = !!(submenuItems && submenuItems.length > 0) || !!useAdminDropdown;

            return (
               <li
                  key={menu.id}
                  className={`${hasDropdown ? `has-dropdown ${menu.previewImg ? "p-static" : ""}` : ""}`}
                  onMouseEnter={() => setHoveredMenu(menu.id)}
               >
                  <Link className={hoveredMenu === menu.id ? "hover" : ""} href={menu.url}>
                     {menu.label}{" "}
                  </Link>

                  {menu.home_menu && (
                     <div className="tp-mega-menu">
                        <div className="tp-home-menu">
                           <div className="row row-cols-1 row-cols-xl-5 row-cols-xxl-5">
                              {menu.submenu.map((sub) => (
                                 <div key={sub.id} className="col">
                                    <Link href={sub.url}>
                                       <div className="tp-home-thumb">
                                          <Image style={{ width: "100%", height: "auto" }} src={sub.img} alt="menu-image" />
                                       </div>
                                       <h3 className="tp-home-title">{sub.label}</h3>
                                    </Link>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {useAdminDropdown && submenuItems && submenuItems.length > 0 && !menu.home_menu && (
                     <ul className="sub-menu">
                        {status === "authenticated" && adminSubmenu.length > 0 ? (
                           adminSubmenu.map((sub) => (
                              <li key={sub.id}>
                                 {(sub as AdminSubItem).signOut ? (
                                    <button
                                       type="button"
                                       onClick={() => signOut({ callbackUrl: "/sign-in" })}
                                       style={{
                                          background: "none", border: "none", cursor: "pointer", padding: 0,
                                          font: "inherit", color: "inherit", width: "100%", textAlign: "left",
                                       }}
                                    >
                                       <span>{sub.label}</span>
                                    </button>
                                 ) : (
                                    <Link href={sub.url!}><span>{sub.label}</span></Link>
                                 )}
                              </li>
                           ))
                        ) : (
                           menu.submenu?.map((sub) => (
                              <li key={sub.id}>
                                 <Link href={sub.url}><span>{sub.label}</span></Link>
                              </li>
                           )) ?? null
                        )}
                     </ul>
                  )}

                  {submenuItems && submenuItems.length > 0 && !menu.home_menu && !useAdminDropdown && (
                     <ul className="sub-menu">
                        {(submenuItems as { id: number; label: string; url: string; authOnly?: boolean; authUrl?: string; guestUrl?: string }[]).map((sub) => {
                           const authOnly = (sub as any).authOnly;
                           const authUrl = (sub as any).authUrl;
                           const guestUrl = (sub as any).guestUrl;
                           const href = authOnly
                              ? (status === "authenticated" ? (authUrl || sub.url) : (guestUrl || "/sign-in"))
                              : sub.url;
                           return (
                           <li key={sub.id}>
                              <Link href={href}><span>{sub.label}</span></Link>
                           </li>
                           );
                        })}
                     </ul>
                  )}
               </li>
            );
         })}
      </ul>
   );
}
