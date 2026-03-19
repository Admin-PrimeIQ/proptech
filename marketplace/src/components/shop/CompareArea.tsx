"use client"
import { formatPrice } from "@/components/Utils/formatPrice";
import { cart_wishlist_product } from "@/redux/slices/cartSlice";
import { remove_compire_product } from "@/redux/slices/compireSlice";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";

export default function CompareArea() {
   const dispatch = useDispatch();

   // Get the list of products marked for comparison from the Redux store
   const compireProducts = useSelector(
      (state: RootState) => state.compire.compireProducts
   );

   // Add a product from the compare list to the cart if it exists
   const handleAddToCart = (product: IFeaturedPropertyDT) => {
      const modifyProduct = compireProducts.find(
         (item) => item.id === product?.id
      );
      if (modifyProduct) {
         dispatch(cart_wishlist_product(modifyProduct));
      }
   };
   // Define the structure and content of each row in the comparison table,
   const compareRows = [
      {
         title: "Product",
         render: (item: IFeaturedPropertyDT) => (
            <div className={`${compireProducts.length > 3 ? "tp-compare-thumb compare-width" : "tp-compare-thumb"}`}>
               <Image src={item.image} alt="image" />
               <h4 className="tp-compare-product-title">
                  <Link href="#">{item.title}</Link>
               </h4>
            </div>
         ),
      },
      {
         title: "Description",
         render: () => (
            <div className="tp-compare-desc">
               <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, distinctio.</p>
            </div>
         ),
      },
      {
         title: "Price",
         render: (item: IFeaturedPropertyDT) => (
            <div className="tp-compare-price">
               <span>{formatPrice(item.price, true)}</span>
               <span className="old-price">{formatPrice(128, true)}</span>
            </div>
         ),
      },
      {
         title: "Add to cart",
         render: (item: IFeaturedPropertyDT) => (
            <div className="tp-compare-add-to-cart">
               <button
                  onClick={() => handleAddToCart(item)}
                  className="tp-btn"
               >
                  Add to Cart
               </button>
            </div>
         ),
      },
      {
         title: "Rating",
         render: () => (
            <div className="tp-compare-rating">
               {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}><i className="fas fa-star"></i></span>
               ))}
            </div>
         ),
      },
      {
         title: "Remove",
         render: (item: IFeaturedPropertyDT) => (
            <div className="tp-compare-remove">
               <button
                  onClick={() => {
                     const confirmRemove = window.confirm("Are you sure you want to remove this item?");
                     if (confirmRemove) {
                        dispatch(remove_compire_product(item))
                     };
                  }}>
                  <i className="fal fa-trash-alt"></i>
               </button>
            </div>
         ),
      },
   ];
   return (
      <>
         <section className="tp-compare-area pt-120 pb-120">
            <div className="container">
               {compireProducts?.length ? (
                  <div className="row">
                     <div className="col-xl-12">
                        <div className="tp-compare-table table-responsive text-center">
                           <table className="table">
                              <tbody>
                                 {compareRows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                       <th>{row.title}</th>
                                       {compireProducts.map((item, colIndex) => (
                                          <td key={colIndex}>{row.render(item)}</td>
                                       ))}
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="text-center">
                     <h3>Your compire list is empty</h3>
                  </div>
               )}
            </div>
         </section>
      </>
   )
}