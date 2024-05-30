import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { RootState } from "../store";

const nftAdapter = createEntityAdapter<NFT>({});

const burnCapitalSlice = createSlice({
  name: "burnCartItems",
  initialState: nftAdapter.getInitialState([]),
  reducers: {
    addSelectedToBurn: nftAdapter.setOne,
    removeSelectedFromBurn: nftAdapter.removeOne,
    emptyBurnCart: nftAdapter.removeAll,
  },
});

interface UIStates {
  showCart: boolean;
}

const initialState: UIStates = {
  showCart: false,
};

const cartUI = createSlice({
  name: "burnCapitalFilters-ui",
  initialState,
  reducers: {
    setShowBurnCart: (state, action: PayloadAction<boolean>) => {
      state.showCart = action.payload;
    },
  },
});
export const selectShowCart = (state: RootState) =>
  state.burnCapitalCartItemsUI.showCart;

const selectors = nftAdapter.getSelectors();

export const selectSelectedNFTIds = (state: RootState) =>
  selectors.selectIds(state.burnCapitalCartItems);

export const selectAllSelectedNFTData = (state: RootState) =>
  selectors.selectAll(state.burnCapitalCartItems);
export const selectSelectedNFTDataById = (state: RootState, id: EntityId) =>
  selectors.selectById(state.burnCapitalCartItems, id);

export const { addSelectedToBurn, removeSelectedFromBurn, emptyBurnCart } =
  burnCapitalSlice.actions;

export const burnCapitalCartItems = burnCapitalSlice.reducer;

export const { setShowBurnCart } = cartUI.actions;

export const burnCapitalCartItemsUI = cartUI.reducer;
