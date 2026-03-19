import empty_cart_img from '../../../public/assets/img/cartmini/empty-cart.png';
import { remove_cart_product } from "@/redux/slices/cartSlice";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { useDispatch, useSelector } from "react-redux";
import useShoppingCartMetrics from "@/hooks/useCart";
import { formatPrice } from "../Utils/formatPrice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// prop type
type IProps = {
  openCartMini: boolean;
  setOpenCartMini: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CartOffcanvas({ openCartMini, setOpenCartMini }: IProps) {
  const dispatch = useDispatch();

  // Extract total price metric from shopping cart
  const { useTotalPrice } = useShoppingCartMetrics();

  // Handle product removal from the cart
  const handleRemoveCart = (product: IFeaturedPropertyDT) => {
    dispatch(remove_cart_product(product));
  };

  // Retrieve current cart products from the Redux state
  const cartProducts = useSelector(
    (state: RootState) => state.cart.cartProducts
  );

  return (
    <>
      <div className={`cartmini__area ${openCartMini ? "cartmini-opened" : ""}`}>
        <div className="cartmini__wrapper p-relative d-flex justify-content-between flex-column">
          <div className="cartmini__close">
            <button onClick={() => setOpenCartMini(false)} type="button" className="cartmini__close-btn cartmini-close-btn"><i className="fal fa-times"></i></button>
          </div>
          <div className="cartmini__top-wrapper">
            <div className="cartmini__top p-relative">
              <div className="cartmini__top-title">
                <h4>Shopping cart</h4>
              </div>
            </div>
            <div className="cartmini__widget">
              {/* Render cart items display  */}
              {cartProducts.length > 0 ? (
                cartProducts.map((item) => {
                  const detailId = item.idPublic ?? String(item.id);
                  const isExternalImg = typeof item.image === "string" && /^https?:\/\//i.test(item.image);
                  return (
                  <div key={item.idPublic ?? item.id}>
                      <div className="cartmini__widget-item">
                        <div className="cartmini__thumb">
                          <Link href={`/property-details-2/${detailId}`}>
                            <Image
                              src={item.image}
                              alt="propery image"
                              width={100}
                              height={75}
                              style={{ objectFit: "cover" }}
                              unoptimized={isExternalImg}
                            />
                          </Link>
                        </div>
                        <div className="cartmini__content">
                          <h5 className="cartmini__title"><Link href={`/property-details-2/${detailId}`}>{item.title}</Link></h5>
                          <div className="cartmini__price-wrapper">
                            <span className="cartmini__price">{formatPrice(item.price, true, item.moneda)}</span>
                            <span className="cartmini__quantity">x{item.quantity}</span>
                          </div>
                        </div>
                        <button onClick={() => handleRemoveCart(item)} className="cartmini__del"><i className="fa-regular fa-xmark"></i></button>
                      </div>
                  </div>
                ); })
              ) : (
                <div className={`cartmini__empty text-center ${cartProducts.length === 0 ? '' : 'd-none'}`}>
                  <Image src={empty_cart_img} alt="empty-cart-img" />
                  <p>Your Cart is empty</p>
                  <Link href="/propiedades" className="tp-cartmini-btn">Go to Shop</Link>
                </div>
              )}
            </div>
          </div>
          <div className="cartmini__checkout">
            <div className="cartmini__checkout-title mb-30">
              <h4>Subtotal:</h4>
              <span>${useTotalPrice()}.00</span>
            </div>
            <div className="cartmini__checkout-btn">
              <Link href="/cart" className="tp-btn mb-10 w-100"> view cart</Link>
              <Link href="/checkout" className="tp-btn tp-btn-border w-100"> checkout</Link>
            </div>
          </div>
        </div>
      </div>
      {/* overlay */}
      <div
        onClick={() => setOpenCartMini(false)}
        className={`body-overlay ${openCartMini ? "opened" : ""}`}
      ></div>
    </>
  );
}
