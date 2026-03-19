
export default function ApplyCouponForm() {
    return (
        <form action="#">
            <div className="tp-cart-coupon-input-box">
                <label>Coupon Code:</label>
                <div className="tp-cart-coupon-input d-flex align-items-center">
                    <input type="text" placeholder="Enter Coupon Code" />
                    <button type="submit">Apply</button>
                </div>
            </div>
        </form>
    )
}