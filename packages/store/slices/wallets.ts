import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { NetworkKind } from "../../networks";
import { RootState } from "../store";

export interface StoreWallet {
  index: number;
  address: string;
  provider: "native" | "ledger" | "google";
  network: NetworkKind;
  networkId: string;
}

const storeWalletId = (wallet: StoreWallet) => `${wallet.index}`;

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
    resetAll: storeWalletsAdapter.removeAll,
  },
});

export const selectAllWallets = (state: RootState) =>
  selectors.selectAll(state.wallets);

export const walletsReducer = walletsSlice.reducer;
export const { addSelected, resetAll } = walletsSlice.actions;
