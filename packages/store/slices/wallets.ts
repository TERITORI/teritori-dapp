import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Network } from "../../utils/network";
import { RootState } from "../store";

export interface StoreWallet {
  publicKey: string;
  network: Network;
}

export const storeWalletId = (wallet: StoreWallet) =>
  `${wallet.network}-${wallet.publicKey}`;

const storeWalletsAdapter = createEntityAdapter<StoreWallet>({
  selectId: storeWalletId,
});

export const selectStoreWallets = (state: RootState) =>
  storeWalletsAdapter.getSelectors().selectAll(state.wallets);

export const walletsSlice = createSlice({
  name: "wallets",
  initialState: storeWalletsAdapter.getInitialState(),
  reducers: {
    addWallet: (state, action: PayloadAction<StoreWallet>) => {
      storeWalletsAdapter.upsertOne(state, action.payload);
    },
  },
});

export const { addWallet } = walletsSlice.actions;

export const walletsReducer = walletsSlice.reducer;
