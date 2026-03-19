"use client"
import { BathroomsSvg, BedroomsSvg, CartSvg, CompireSvg, WishListSvg } from "@/components/SVG";
import ActiveWishListSvg from "@/components/SVG/PropertySvg/ActiveWishListSvg";
import { toggle_wishlist } from "@/redux/slices/wishlistSlice";
import { compire_product } from "@/redux/slices/compireSlice";
import { formatPrice } from "@/components/Utils/formatPrice";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { cart_product } from "@/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import UserAvatarPlaceholder from "@/components/UI/UserAvatarPlaceholder";
import Image from "next/image";
import Link from "next/link";

export default function PropertyItemHomeFour({ item }: { item: IFeaturedPropertyDT; }) {
    const dispatch = useDispatch();
    const detailId = item.idPublic ?? String(item.id);
    const linkBase = `/property-details-2/${detailId}`;

  // Handle adding product to cart
    const handleAddToCart = (product: IFeaturedPropertyDT) => {
        if (product) {
            dispatch(cart_product(product))
        }
    }
    // Handle comparing products
    const handleCompare = (product: IFeaturedPropertyDT) => {
        if (product) {
            dispatch(compire_product(product))
        }
    };

 // Check if product is already in wishlist
    const wishlist = useSelector((state: RootState) => state.wishlist.wishlistProducts);
    const isWishlisted = wishlist?.some((wishlistItem) => wishlistItem.id === item.id);

    return (
        <div className="tp-rent-item p-relative">
            <div className="tp-rent-thumb p-relative">
                <Link href={linkBase}><Image src={item.image} alt="property image" /></Link>
                <div className="tp-rent-user-wrap d-flex align-items-center justify-content-between">
                    <div className="tp-rent-user d-flex align-items-center">
                        <div className="tp-rent-user-thumb">
                            {item.userImage ? (
                                <Image src={item.userImage} alt="image" />
                            ) : (
                                <UserAvatarPlaceholder size={60} />
                            )}
                        </div>
                        <div className="tp-rent-user-content">
                            <h5 className="tp-rent-user-content-title">{item.userName}</h5>
                            <span>{item.userRole}</span>
                        </div>
                    </div>
                    <div className="tp-rent-option d-flex">
                        <button onClick={() => handleCompare(item)}>
                            <span><CompireSvg /></span>
                        </button>
                        <button onClick={() => dispatch(toggle_wishlist(item))}>
                            <span>{isWishlisted ? <ActiveWishListSvg /> : <WishListSvg />}</span>
                        </button>
                        <button onClick={() => handleAddToCart(item)}>
                            <span><CartSvg /></span>
                        </button>
                    </div>
                </div>
                {item.showTags && (
                    <div className="tp-rent-tags">
                        {item.isForRent === true ? <Link href="#">FOR RENT</Link> : ""}{" "}
                        {item.isFeatured === true ? <Link className="two" href="#">FEATURED</Link> : ""}
                    </div>
                )}
            </div>
            <div className="tp-rent-content">
                <h4 className="tp-rent-title pb-20"><Link className="textline" href={linkBase}>{item.title}</Link></h4>
                <div className="tp-rent-4-country d-flex flex-wrap pb-10">
                    <div className="tp-rent-4-country-item">
                        <span>City</span>
                        <p>{item.city}</p>
                    </div>
                    <div className="tp-rent-4-country-item">
                        <span>State</span>
                        <p>{item.state}</p>
                    </div>
                    <div className="tp-rent-4-country-item">
                        <span>For sale</span>
                        <span>{formatPrice(item.price, true)}</span>
                    </div>
                    <div className="tp-rent-4-country-item">
                        <span>Flat space</span>
                        <p>{item.livingArea}</p>
                    </div>
                </div>
                <div className="tp-rent-4-meta-box d-flex">
                    <div className="tp-rent-4-meta-item">
                        <span><BedroomsSvg /> {item.bedrooms} Habitaciones</span>
                    </div>
                    <div className="tp-rent-4-meta-item">
                        <span><BathroomsSvg /> {item.bathrooms} Baños</span>
                    </div>
                </div>
                <div className="tp-rent-4-btn">
                    <Link className="tp-btn w-100 text-center" href={linkBase}>Ver detalles</Link>
                </div>
            </div>
        </div>
    )
}