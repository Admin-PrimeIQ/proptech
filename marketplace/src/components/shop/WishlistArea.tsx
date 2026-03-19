"use client"
import { remove_wishlist_product } from "@/redux/slices/wishlistSlice";
import { cart_wishlist_product } from "@/redux/slices/cartSlice";
import { formatPrice } from "@/components/Utils/formatPrice";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { useDispatch, useSelector } from "react-redux";
import { CrossIconSvg } from "@/components/SVG";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";

export default function WishlistArea() {
    const dispatch = useDispatch();

    // Get the list of products added to the wishlist from the Redux store
    const wishlistProducts = useSelector(
        (state: RootState) => state.wishlist.wishlistProducts
    );

    // Add a product from the wishlist to the cart if it exists in the wishlist
    const handleAddToCart = (product: IFeaturedPropertyDT) => {
        const modifyProduct = wishlistProducts.find(
            (item) => item.id === product?.id
        );
        if (modifyProduct) {
            dispatch(cart_wishlist_product(modifyProduct));
        }
    };
    return (
        <>
            <section className="tp-cart-area pt-120 pb-120">
                <div className="container">
                    {wishlistProducts?.length ? (
                        <>
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="tp-cart-list mb-25">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th colSpan={2} className="tp-cart-header-product">Product</th>
                                                    <th className="tp-cart-header-price">Price</th>
                                                    <th className="tp-cart-header-quantity">Action</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {wishlistProducts?.map((item, index) => (
                                                    <tr key={index}>
                                                        {/* -- img -- */}
                                                        <td className="tp-cart-img"><Link href="#"> <Image src={item.image} alt="img" /></Link></td>
                                                        {/* -- title -- */}
                                                        <td className="tp-cart-title"><Link href="#">Safety Halmate</Link></td>
                                                        {/* -- price -- */}
                                                        <td className="tp-cart-price">
                                                            <span>{formatPrice(item.price, true)}</span>
                                                        </td>
                                                        {/* -- quantity -- */}
                                                        <td className="tp-cart-add-to-cart">
                                                            <button onClick={(e) => {
                                                                e.preventDefault(); handleAddToCart(item);
                                                            }} type="submit" className="tp-btn tp-btn-2 tp-btn-blue">Add To Cart</button>
                                                        </td>
                                                        {/* -- action -- */}
                                                        <td className="tp-cart-action">
                                                            <button
                                                                onClick={() => {
                                                                    const confirmRemove = window.confirm("Are you sure you want to remove this item?");
                                                                    if (confirmRemove) {
                                                                        dispatch(remove_wishlist_product(item))
                                                                    };
                                                                }}
                                                                className="tp-cart-action-btn"
                                                            >
                                                                <CrossIconSvg />{" "}
                                                                <span>Remove</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="tp-cart-bottom">
                                        <div className="row align-items-end">
                                            <div className="col-xl-6 col-md-4">
                                                <div className="tp-cart-update">
                                                    <Link href="/cart" className="tp-cart-update-btn">Go To Cart</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h3>Your wishlist is empty</h3>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}