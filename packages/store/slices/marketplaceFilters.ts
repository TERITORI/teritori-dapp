import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";

import { Attribute, PriceRange } from "../../api/marketplace/v1/marketplace";
import { RootState } from "../store";

const filter = createEntityAdapter<Attribute>({
  selectId: (attribute) => `${attribute.traitType}-${attribute.value}`,
});

interface UIStates {
  showFilters: boolean;
  buyNowState: boolean;
  priceRange: PriceRange;
}

const initialState: UIStates = {
  showFilters: false,
  buyNowState: true,
  priceRange: {
    min: 0,
    max: 0,
  },
};

export const selectShowFilters = (state: RootState) =>
  state.marketplaceFilterUI.showFilters;

export const selectBuyNow = (state: RootState) =>
  state.marketplaceFilterUI.buyNowState;

export const selectPriceRange = (state: RootState) =>
  state.marketplaceFilterUI.priceRange;

const filtersSlice = createSlice({
  name: "marketPlaceFilters",
  initialState: filter.getInitialState([]),
  reducers: {
    addSelected: filter.setOne,
    removeSelected: filter.removeOne,
    clearSelected: filter.removeAll,
  },
});

const filterUI = createSlice({
  name: "marketPlaceFilters-ui",
  initialState,
  reducers: {
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    setBuyNow: (state, action: PayloadAction<boolean>) => {
      state.buyNowState = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.priceRange = action.payload;
    },
  },
});

const selectors = filter.getSelectors();

export const selectSelectedAttributeIds = (state: RootState) =>
  selectors.selectIds(state.marketplaceFilters);

export const selectAllSelectedAttributeData = (state: RootState) =>
  selectors.selectAll(state.marketplaceFilters);

export const selectSelectedAttributeDataById = (
  state: RootState,
  id: EntityId
) => selectors.selectById(state.marketplaceFilters, id);

export const { addSelected, removeSelected, clearSelected } =
  filtersSlice.actions;

export const { setShowFilters, setBuyNow, setPriceRange } = filterUI.actions;

export const marketplaceFilters = filtersSlice.reducer;
export const marketplaceFilterUI = filterUI.reducer;
