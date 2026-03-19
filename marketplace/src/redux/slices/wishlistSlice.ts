"use client";

import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface WishlistState {
  wishlistProducts: IFeaturedPropertyDT[];
}

const initialState: WishlistState = {
  wishlistProducts: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggle_wishlist: (state = initialState, { payload }: PayloadAction<IFeaturedPropertyDT>) => {
      if (!state.wishlistProducts) {
        state.wishlistProducts = []; 
      }
      const existingIndex = state.wishlistProducts.findIndex(
        (item) => item.id === payload.id || item.idPublic === payload.idPublic
      );
    
      if (existingIndex >= 0) {
        state.wishlistProducts.splice(existingIndex, 1);
        // No mostrar toast aquí, el hook lo maneja
      } else {
        state.wishlistProducts.push(payload);
        // No mostrar toast aquí, el hook lo maneja
      }
    },
    remove_wishlist_product: (
      state,
      { payload }: PayloadAction<IFeaturedPropertyDT>
    ) => {
      const toastId = toast.loading("");
      state.wishlistProducts = state.wishlistProducts.filter(
        (item) => item.id !== payload.id && item.idPublic !== payload.idPublic
      );
      toast.error(`Remove from your wishlist`, { id: toastId, duration: 1000 });
    },
    set_favoritos_from_backend: (
      state,
      { payload }: PayloadAction<IFeaturedPropertyDT[]>
    ) => {
      state.wishlistProducts = payload;
    },
  },
});

export const { toggle_wishlist, remove_wishlist_product, set_favoritos_from_backend } = wishlistSlice.actions;
export default wishlistSlice.reducer;

