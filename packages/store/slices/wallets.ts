import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

import { NetworkKind } from "../../networks";

interface StoreWallet {
  publicKey: string;
  network: NetworkKind;
}

const storeWalletId = (wallet: StoreWallet) =>
  `${wallet.network}-${wallet.publicKey}`;

const storeWalletsAdapter = createEntityAdapter<StoreWallet>({
  selectId: storeWalletId,
});

const walletsSlice = createSlice({
  name: "wallets",
  initialState: storeWalletsAdapter.getInitialState(),
  reducers: {},
});

export const walletsReducer = walletsSlice.reducer;
