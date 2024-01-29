import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";

import { NetworkKind } from "../../networks";
import { RootState } from "../store";

export interface StoreWallet {
  index: number;
  address: string;
  provider: "native" | "ledger" | "google";
  network: NetworkKind;
  networkId: string;
  // needsPassword: boolean;
}

export interface AddressBookEntry {
  id: number;
  address: string;
  name: string;
  networkId: string;
}

const storeWalletId = (wallet: StoreWallet) => `${wallet.index}`;

const storeWalletsAdapter = createEntityAdapter<StoreWallet>({
  selectId: storeWalletId,
});
const selectors = storeWalletsAdapter.getSelectors();

const storeAddress = createEntityAdapter<AddressBookEntry>();
const addressSelectors = storeAddress.getSelectors();

const walletsSlice = createSlice({
  name: "wallets",
  initialState: {
    ...storeWalletsAdapter.getInitialState(),
    selectedWalletId: -1, // Add new state variable for selected wallet ID
  },
  reducers: {
    addSelected: storeWalletsAdapter.setOne,
    removeSelected: storeWalletsAdapter.removeOne,
    resetAllWallets: storeWalletsAdapter.removeAll,
    setSelectedNativeWalletIndex: (state, action: PayloadAction<number>) => {
      // Add new reducer function
      state.selectedWalletId = action.payload;
    },
  },
});

const addressBookSlice = createSlice({
  name: "addressBook",
  initialState: storeAddress.getInitialState(),
  reducers: {
    addEntry: storeAddress.setOne,
    removeEntry: storeAddress.removeOne,
    resetAllAddressBook: storeAddress.removeAll,
  },
});

export const selectSelectedNativeWalletIndex = (state: RootState) =>
  state.wallets.selectedWalletId;

export const selectAllWallets = (state: RootState) =>
  selectors.selectAll(state.wallets);

export const selectWalletById = (state: RootState, id: EntityId) =>
  selectors.selectById(state.wallets, id);

export const selectAllAddressBook = (state: RootState) =>
  addressSelectors.selectAll(state.addressBook);

export const selectAddressBookById = (state: RootState, id: EntityId) =>
  addressSelectors.selectById(state.addressBook, id);

export const walletsReducer = walletsSlice.reducer;
export const addressBookReducer = addressBookSlice.reducer;
export const { addEntry, removeEntry, resetAllAddressBook } =
  addressBookSlice.actions;
export const {
  addSelected,
  resetAllWallets,
  setSelectedNativeWalletIndex,
  removeSelected,
} = walletsSlice.actions;
