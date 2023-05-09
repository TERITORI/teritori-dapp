import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { RootState } from "../store";

const nftAdapter = createEntityAdapter<NFT>({});

const marketplace = createSlice({
  name: "marketplaceCartItems",
  initialState: nftAdapter.getInitialState([]),
  reducers: {
    addSelected: nftAdapter.setOne,
    removeSelected: nftAdapter.removeOne,
    clearSelected: nftAdapter.removeAll,
  },
});

const selectors = nftAdapter.getSelectors();

export const selectSelectedNFTIds = (state: RootState) =>
  selectors.selectIds(state.marketplaceCartItems);

export const selectAllSelectedNFTData = (state: RootState) =>
  selectors.selectAll(state.marketplaceCartItems);
export const selectSelectedNFTDataById = (state: RootState, id: EntityId) =>
  selectors.selectById(state.marketplaceCartItems, id);

export const { addSelected, removeSelected, clearSelected } =
  marketplace.actions;

export const marketplaceCartItems = marketplace.reducer;
