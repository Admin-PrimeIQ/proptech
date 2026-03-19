"use client"
import { cart_product, clear_cart, decrease_quantity, remove_cart_product } from "@/redux/slices/cartSlice";
import { CartPlusIconSvg, CrossIconSvg, MinusIconSvg } from "../SVG";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { useDispatch, useSelector } from "react-redux";
import ApplyCouponForm from "../Form/ApplyCouponForm";
import { formatPrice } from "../Utils/formatPrice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CartArea() {
    const [shippingCost, setShippingCost] = useState(0);
    const dispatch = useDispatch();

    //handle decress cart
    const cartProducts = useSelector(
        (state: RootState) => state.cart.cartProducts
    );

    // Clear all items from cart
    const removeAllProduct = () => {
        dispatch(clear_cart());
    };

    // Add product to cart
    const handleAddToCart = (product: IFeaturedPropertyDT) => {
        dispatch(cart_product(product));
    };

    // Decrease quantity of a product in cart
    const handleDecressCart = (product: IFeaturedPropertyDT) => {
        dispatch(decrease_quantity(product));
    };

    // Remove a single product from cart
    const handleRemoveProduct = (product: IFeaturedPropertyDT) => {
        dispatch(remove_cart_product(product));
    };

    // Calculate total price of cart items
    const totalPrice = cartProducts.reduce((total, product) => {
        if (typeof product.price === 'number' && product.price !== 0) {
            return total + (product.price ?? 0) * (product.quantity ?? 0);
        }
        return total;
    }, 0);

    const handleChange = () => { };
    return (
        <>
            {cartProducts.length === 0 &&
                <div className="container">
                    <div className="empty-text pt-100 pb-100 text-center">
                        <h3>Your cart is empty</h3>
                    </div>
                </div>
            }
            {cartProducts.length >= 1 &&
                <section className="tp-cart-area pb-120 pt-120">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-9 col-lg-8">
                                <div className="tp-cart-list mb-25 mr-30">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className="tp-cart-header-product">Product</th>
                                                <th className="tp-cart-header-price">Price</th>
                                                <th className="tp-cart-header-quantity">Quantity</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartProducts.map((item, index) => (
                                                    <tr key={index}>
                                                        {/* -- img -- */}
                                                        <td className="tp-cart-img">
                                                            <Link href="#">
                                                                <Image src={item.image} style={{ width: "100%", height: "auto" }} alt="Image" />
                                                            </Link></td>
                                                        {/* -- title -- */}
                                                        <td className="tp-cart-title"><Link href="#">{item?.title}</Link></td>
                                                        {/* -- price -- */}
                                                        <td className="tp-cart-price"><span>{formatPrice(item.price, true)}</span></td>
                                                        {/* -- quantity -- */}
                                                        <td className="tp-cart-quantity tp-product-details-quantity">
                                                            <div className="tp-product-quantity mt-10 mb-10">
                                                                <span onClick={() => handleDecressCart(item)} className="tp-cart-minus"><MinusIconSvg /></span>
                                                                <input className="tp-cart-input" type="text" onChange={handleChange} value={item.quantity} readOnly />
                                                                <span onClick={() => handleAddToCart(item)} className="tp-cart-plus"><CartPlusIconSvg /></span>
                                                            </div>
                                                        </td>
                                                        {/* -- action -- */}
                                                        <td className="tp-cart-action">
                                                                <button
                                                                    onClick={() => {
                                                                        const confirmRemove = window.confirm("Are you sure you want to remove this item?");
                                                                        if (confirmRemove) {
                                                                            handleRemoveProduct(item);
                                                                        }
                                                                    }}
                                                                    className="tp-cart-action-btn"
                                                                >
                                                                    <CrossIconSvg />{" "}
                                                                    <span>Remove</span>
                                                                </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tp-cart-bottom">
                                    <div className="row align-items-end">
                                        <div className="col-xl-6 col-md-8">
                                            <div className="tp-cart-coupon"><ApplyCouponForm /></div>
                                        </div>
                                        <div className="col-xl-6 col-md-4">
                                            <div className="tp-cart-update text-md-end mr-30">
                                                <button type="button" onClick={removeAllProduct} className="tp-cart-update-btn">Clear Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6">
                                <div className="tp-cart-checkout-wrapper">
                                    <div className="tp-cart-checkout-top d-flex align-items-center justify-content-between">
                                        <span className="tp-cart-checkout-top-title">Subtotal</span>
                                        <span className="tp-cart-checkout-top-price">{formatPrice(totalPrice, true)}</span>
                                    </div>
                                    <div className="tp-cart-checkout-shipping">
                                        <h4 className="tp-cart-checkout-shipping-title">Shipping</h4>
                                        <div className="tp-cart-checkout-shipping-option-wrapper">
                                            <div className="tp-cart-checkout-shipping-option">
                                                <input onClick={() => setShippingCost(20)} id="flat_rate" type="radio" name="shipping" />
                                                <label htmlFor="flat_rate">Flat rate: <span>{formatPrice(20, true)}</span></label>
                                            </div>
                                            <div className="tp-cart-checkout-shipping-option">
                                                <input onClick={() => setShippingCost(25)} id="local_pickup" type="radio" name="shipping" />
                                                <label htmlFor="local_pickup">Local pickup: <span>{formatPrice(25, true)}</span></label>
                                            </div>
                                            <div className="tp-cart-checkout-shipping-option">
                                                <input onClick={() => setShippingCost(0)} id="free_shipping" type="radio" name="shipping" />
                                                <label htmlFor="free_shipping">Free shipping</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tp-cart-checkout-total d-flex align-items-center justify-content-between">
                                        <span>Total</span>
                                        <span>{formatPrice(totalPrice + shippingCost, true)}</span>
                                    </div>
                                    <div className="tp-cart-checkout-proceed">
                                        <Link href="/checkout" className="tp-cart-checkout-btn w-100">Proceed to Checkout</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </>
    )
}