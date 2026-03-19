"use client";
import { IFeaturedPropertyDT } from "@/types/property-d-t";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface CartState {
  compireProducts: IFeaturedPropertyDT[];
}

const initialState: CartState = {
  compireProducts: [],
};

export const compireSlice = createSlice({
  name: "compire",
  initialState,
  reducers: {
    compire_product: (state, { payload }: PayloadAction<IFeaturedPropertyDT>) => {
      const productIndex = state.compireProducts.findIndex(
        (item) => item.id === payload.id
      );

      if (productIndex >= 0) {
        toast.info(`"${payload.title.slice(0, 15)}" already added to compare list`, {
          duration: 1500,
        });
      } else {
        const tempProduct = { ...payload, quantity: 1 };
        state.compireProducts.push(tempProduct);
        toast.success(`"${payload.title.slice(0, 15)}" added to compare list`, {
          duration: 1500,
        });
      }
    },

    remove_compire_product: (state, { payload }: PayloadAction<IFeaturedPropertyDT>) => {
      state.compireProducts = state.compireProducts.filter(
        (item) => item.id !== payload.id
      );
      toast.error(`"${payload.title.slice(0, 15)}" removed from compare list`, {
        duration: 1500,
      });
    },
  },
});

export const { compire_product, remove_compire_product } = compireSlice.actions;
export default compireSlice.reducer;
