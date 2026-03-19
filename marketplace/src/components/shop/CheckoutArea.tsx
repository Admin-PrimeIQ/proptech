"use client";

import CheckoutDetailsForm from "@/components/Form/checkout/CheckoutDetailsForm";
import paymentImg from "../../../public/assets/img/shop/payment-option.png";
import CheckoutLoginForm from "@/components/Form/checkout/CheckoutLogin";
import CheckoutCoupon from "@/components/Form/checkout/CheckoutCoupon";
import { formatPrice } from "@/components/Utils/formatPrice";
import useGlobalContext from "@/hooks/useContext";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutArea() {
    const { toggleOpen, isOpen } = useGlobalContext();
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);

    // Retrieve the list of products currently in the cart from the Redux store
    const cartProducts = useSelector((state: RootState) => state.cart.cartProducts);

    // Calculate the total price by summing (price × quantity) of each product in the cart
    const totalPrice = cartProducts.reduce((total, product) => {
        const price = typeof product.price === "number" ? product.price : 0;
        const quantity = product.quantity ?? 0;
        return total + price * quantity;
    }, 0);

    return (
        <section
            className="tp-checkout-area pb-120 pt-120"
            style={{ backgroundColor: "#EFF1F5" }}
        >
            <div className="container">
                <div className="row">
                    {/* Login & Coupon Section */}
                    <div className="col-xl-7 col-lg-7">
                        <div className="tp-checkout-verify">
                            <div className="tp-checkout-verify-item">
                                <p className="tp-checkout-verify-reveal">
                                    Returning customer?{" "}
                                    <button
                                        onClick={toggleOpen}
                                        type="button"
                                        className="tp-checkout-login-form-reveal-btn"
                                    >
                                        Click here to login
                                    </button>
                                </p>
                                <div className={`tp-return-customer ${isOpen ? "d-block" : "d-none"}`}>
                                    <CheckoutLoginForm />
                                </div>
                            </div>

                            <div className="tp-checkout-verify-item">
                                <p className="tp-checkout-verify-reveal">
                                    Have a coupon?{" "}
                                    <button
                                        onClick={() => setIsCouponOpen(!isCouponOpen)}
                                        type="button"
                                        className="tp-checkout-coupon-form-reveal-btn"
                                    >
                                        Click here to enter your code
                                    </button>
                                </p>
                                <div className={`tp-return-customer ${isCouponOpen ? "d-block" : "d-none"}`}>
                                    <CheckoutCoupon />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing Form */}
                    <div className="col-lg-7">
                        <div className="tp-checkout-bill-area">
                            <h3 className="tp-checkout-bill-title">Billing Details</h3>
                            <div className="tp-checkout-bill-form">
                                <CheckoutDetailsForm />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-5">
                        <div className="tp-checkout-place white-bg">
                            <h3 className="tp-checkout-place-title">Your Order</h3>

                            <div className="tp-order-info-list">
                                <ul>
                                    <li className="tp-order-info-list-header">
                                        <h4>Product</h4>
                                        <h4>Total</h4>
                                    </li>

                                    {cartProducts.map((item) => (
                                        <li className="tp-order-info-list-desc" key={item.id}>
                                            <p>
                                                {item.title}
                                                <span> x {item.quantity}</span>
                                            </p>
                                            <span>
                                                {item.price && item.quantity
                                                    ? `${formatPrice(item.price * item.quantity, true)}`
                                                    : "N/A"}
                                            </span>
                                        </li>
                                    ))}

                                    <li className="tp-order-info-list-subtotal">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(totalPrice, true)}</span>
                                    </li>

                                    <li className="tp-order-info-list-shipping">
                                        <span>Shipping</span>
                                        <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
                                            <span>
                                                <input
                                                    onClick={() => setShippingCost(20)}
                                                    id="flat_rate"
                                                    type="radio"
                                                    name="shipping"
                                                />
                                                <label htmlFor="flat_rate">
                                                    Flat rate: <span>{formatPrice(20, true)}</span>
                                                </label>
                                            </span>
                                            <span>
                                                <input
                                                    onClick={() => setShippingCost(25)}
                                                    id="local_pickup"
                                                    type="radio"
                                                    name="shipping"
                                                />
                                                <label htmlFor="local_pickup">
                                                    Local pickup: <span>{formatPrice(25, true)}</span>
                                                </label>
                                            </span>
                                            <span>
                                                <input
                                                    onClick={() => setShippingCost(0)}
                                                    id="free_shipping"
                                                    type="radio"
                                                    name="shipping"
                                                />
                                                <label htmlFor="free_shipping">Free shipping</label>
                                            </span>
                                        </div>
                                    </li>

                                    <li className="tp-order-info-list-total">
                                        <span>Total</span>
                                        <span>{formatPrice(totalPrice + shippingCost, true)}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Payment Method */}
                            <div className="tp-checkout-payment">
                                {[
                                    { id: "bank_transfer", label: "Direct Bank Transfer" },
                                    { id: "cheque_payment", label: "Cheque Payment" },
                                    { id: "cod", label: "Cash on Delivery" },
                                ].map(({ id, label }) => (
                                    <div key={id} className="tp-checkout-payment-item">
                                        <input type="radio" id={id} name="payment" />
                                        <label htmlFor={id}>{label}</label>
                                    </div>
                                ))}

                                <div className="tp-checkout-payment-item paypal-payment">
                                    <input type="radio" id="paypal" name="payment" />
                                    <label htmlFor="paypal">
                                        PayPal
                                        <Image src={paymentImg} alt="payment-img" />
                                        <Link href="#">What is PayPal?</Link>
                                    </label>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="tp-checkout-agree">
                                <div className="tp-checkout-option">
                                    <input id="read_all" type="checkbox" />
                                    <label htmlFor="read_all">
                                        I have read and agree to the website.
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="tp-checkout-btn-wrapper">
                                <button
                                    type="submit"
                                    className="tp-checkout-btn w-100"
                                    onClick={() =>
                                        toast.success("Your order has been placed successfully! 🎉")
                                    }
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}