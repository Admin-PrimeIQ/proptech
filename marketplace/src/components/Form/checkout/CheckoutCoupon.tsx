export default function CheckoutCoupon() {
    return (
        <form action="#">
            <div className="tp-return-customer-input">
                <label>Coupon Code :</label>
                <input type="text" placeholder="Coupon" />
            </div>
            <button type="submit" className="tp-return-customer-btn tp-checkout-btn">Apply</button>
        </form>
    )
}