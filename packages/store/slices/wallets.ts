import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface StoreWallet {
  publicKey: string;
  networkId: string;
}

export const storeWalletId = (wallet: StoreWallet) =>
  `${wallet.networkId}-${wallet.publicKey}`;

const storeWalletsAdapter = createEntityAdapter<StoreWallet>({
  selectId: storeWalletId,
});

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
