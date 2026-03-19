import BreadcrumbArea from "@/components/Breadcrumb/BreadcrumbArea";
import WishlistArea from "@/components/shop/WishlistArea";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wishlist - Bhumi Real Estate React NextJs Template",
};

export default function Wishlist() {

    return (
        <main>
             {/* -- Breadcrumb start -- */}
            <BreadcrumbArea title="Wish_List" />
             {/* -- Breadcrumb end -- */}
             
            {/* -- Wishlist area start -- */}
            <WishlistArea />
            {/* -- wishlist area end -- */}
        </main>
    )
}