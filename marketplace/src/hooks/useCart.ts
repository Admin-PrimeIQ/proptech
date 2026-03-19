
import { useAppSelector } from '@/redux/hooks';
import { IFeaturedPropertyDT } from '@/types/property-d-t';

const useShoppingCartMetrics = () => {

    // Cart quantity
    const useCartProductQuantity = () => {
        const cartProducts = useAppSelector((state) => state.cart.cartProducts);
        const uniqueProductId = new Set();
        cartProducts.forEach((product: IFeaturedPropertyDT) => uniqueProductId.add(product.id));
        return uniqueProductId.size;
    };
    // Wishlist quantity
    const useWishlstQuantity = () => {
        const cartProducts = useAppSelector((state) => state?.wishlist.wishlistProducts);
        const uniqueProductId = new Set();
        cartProducts?.forEach((product: IFeaturedPropertyDT) => uniqueProductId.add(product.id));
        return uniqueProductId.size;
    }

    const useTotalPrice = () => {
        const cartProducts = useAppSelector((state) => state.cart.cartProducts);
        const totalPrice = cartProducts.reduce((total, product) => {
            if (typeof product.price === 'number' && product.price !== 0) {
                return total + (product.price ?? 0) * (product.quantity ?? 0);
            }
            return total;
        }, 0);
        return totalPrice;
    }

    return {
        useCartProductQuantity,
        useWishlstQuantity,
        useTotalPrice,
    }
};

export default useShoppingCartMetrics;