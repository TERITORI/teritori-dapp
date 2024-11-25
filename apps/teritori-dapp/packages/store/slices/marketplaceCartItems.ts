import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { RootState } from "../store";

const nftAdapter = createEntityAdapter<NFT>({});

const marketplace = createSlice({
  name: "marketplaceCartItems",
  initialState: nftAdapter.getInitialState([]),
  reducers: {
    addSelected: nftAdapter.setOne,
    removeSelected: nftAdapter.removeOne,
    emptyCart: nftAdapter.removeAll,
  },
});

interface UIStates {
  showCart: boolean;
}

const initialState: UIStates = {
  showCart: false,
};

const cartUI = createSlice({
  name: "marketPlaceFilters-ui",
  initialState,
  reducers: {
    setShowCart: (state, action: PayloadAction<boolean>) => {
      state.showCart = action.payload;
    },
  },
});

export const selectShowCart = (state: RootState) =>
  state.marketplaceCartItemsUI.showCart;

const selectors = nftAdapter.getSelectors();

export const selectSelectedNFTIds = (state: RootState) =>
  selectors.selectIds(state.marketplaceCartItems);

export const selectAllSelectedNFTData = (state: RootState) =>
  selectors.selectAll(state.marketplaceCartItems);
export const selectSelectedNFTDataById = (state: RootState, id: EntityId) =>
  selectors.selectById(state.marketplaceCartItems, id);

export const { addSelected, removeSelected, emptyCart } = marketplace.actions;
export const { setShowCart } = cartUI.actions;

export const marketplaceCartItems = marketplace.reducer;
export const marketplaceCartItemsUI = cartUI.reducer;
