import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  AttributeRarityFloor,
  PriceRange,
} from "../../api/marketplace/v1/marketplace";
import { RootState } from "../store";

const filter = createEntityAdapter<AttributeRarityFloor>({
  selectId: (attribute) =>
    `${attribute.collectionId}-${attribute.traitType}-${attribute.value}`,
});

export interface PeriodItem {
  label: string;
  shortLabel: string;
  value: number;
}

export const marketplacePeriodItems: PeriodItem[] = [
  {
    label: "Last 10 minutes",
    shortLabel: "10m",
    value: 10,
  },
  {
    label: "Last 1 hour",
    shortLabel: "1h",
    value: 60,
  },
  {
    label: "Last 6 hours",
    shortLabel: "6h",
    value: 360,
  },
  {
    label: "Last 1 day",
    shortLabel: "1d",
    value: 1440,
  },
  {
    label: "Last 7 days",
    shortLabel: "7d",
    value: 10080,
  },
  {
    label: "Last 30 days",
    shortLabel: "30d",
    value: 43200, // 30 * 24 * 60
  },
];

interface UIStates {
  showFilters: boolean;
  showFilterButton: boolean;
  buyNowState: boolean;
  priceRange: PriceRange;
  timePeriod: PeriodItem;
}

const initialState: UIStates = {
  showFilters: false,
  showFilterButton: true,
  buyNowState: true,
  priceRange: {
    min: "0",
    max: "0",
  },
  timePeriod: marketplacePeriodItems[3],
};

export const selectShowFilters = (state: RootState) =>
  state.marketplaceFilterUI.showFilters;

export const selectBuyNow = (state: RootState) =>
  state.marketplaceFilterUI.buyNowState;

export const selectPriceRange = (state: RootState) =>
  state.marketplaceFilterUI.priceRange;

export const selectTimePeriod = (state: RootState) =>
  state.marketplaceFilterUI.timePeriod;

const filtersSlice = createSlice({
  name: "marketPlaceFilters",
  initialState: filter.getInitialState([]),
  reducers: {
    addSelected: filter.setOne,
    removeSelected: filter.removeOne,
    clearSelected: filter.removeAll,
    clearSelectedByCollection: filter.removeMany,
  },
});

const filterUI = createSlice({
  name: "marketPlaceFilters-ui",
  initialState,
  reducers: {
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    setShowFilterButton: (state, action: PayloadAction<boolean>) => {
      state.showFilterButton = action.payload;
    },
    setBuyNow: (state, action: PayloadAction<boolean>) => {
      state.buyNowState = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<PriceRange>) => {
      state.priceRange = action.payload;
    },
    setTimePeriod: (state, action: PayloadAction<PeriodItem>) => {
      state.timePeriod = action.payload;
    },
  },
});

const selectors = filter.getSelectors();

export const selectSelectedAttributeIds = (state: RootState) =>
  selectors.selectIds(state.marketplaceFilters);

export const selectAllSelectedAttributeDataByCollectionId = (
  state: RootState,
  collectionId: string,
) =>
  selectors.selectAll(state.marketplaceFilters).filter((filter) => {
    return filter.collectionId === collectionId;
  });

export const { addSelected, removeSelected, clearSelectedByCollection } =
  filtersSlice.actions;

export const { setShowFilters, setBuyNow, setPriceRange, setTimePeriod } =
  filterUI.actions;

export const marketplaceFilters = filtersSlice.reducer;
export const marketplaceFilterUI = filterUI.reducer;
