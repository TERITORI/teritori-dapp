import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";

import { Attribute } from "../../api/marketplace/v1/marketplace";
import { RootState } from "../store";

const filter = createEntityAdapter<Attribute>({});

interface UIStates {
  showFilters: boolean;
}

const initialState: UIStates = {
  showFilters: false,
};

export const selectShowFilters = (state: RootState) =>
  state.marketplaceFilterUI.showFilters;

const marketplace = createSlice({
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
  },
});

const selectors = filter.getSelectors();

export const selectSelectedNFTIds = (state: RootState) =>
  selectors.selectIds(state.marketplaceFilters);

export const selectAllSelectedNFTData = (state: RootState) =>
  selectors.selectAll(state.marketplaceFilters);
export const selectSelectedNFTDataById = (state: RootState, id: EntityId) =>
  selectors.selectById(state.marketplaceFilters, id);

export const { addSelected, removeSelected, clearSelected } =
  marketplace.actions;

export const { setShowFilters } = filterUI.actions;

export const marketplaceFilters = marketplace.reducer;
export const marketplaceFilterUI = filterUI.reducer;
