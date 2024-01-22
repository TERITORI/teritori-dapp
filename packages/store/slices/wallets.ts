import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { NetworkKind } from "../../networks";
import { RootState } from "../store";

interface StoreWallet {
  publicKey: string;
  network: NetworkKind;
}

const storeWalletId = (wallet: StoreWallet) =>
  `${wallet.network}-${wallet.publicKey}`;

const storeWalletsAdapter = createEntityAdapter<StoreWallet>({
  selectId: storeWalletId,
});

const selectors = storeWalletsAdapter.getSelectors();

const walletsSlice = createSlice({
  name: "wallets",
  initialState: storeWalletsAdapter.getInitialState(),
  reducers: {
    addSelected: storeWalletsAdapter.setOne,
    removeSelected: storeWalletsAdapter.removeOne,
  },
});

export const selectAllWallets = (state: RootState) =>
  selectors.selectAll(state.wallets);

export const walletsReducer = walletsSlice.reducer;
export const { addSelected, removeSelected } = walletsSlice.actions;
