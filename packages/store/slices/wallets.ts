import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "../store";

import { StoreWallet } from "@/utils/types/wallet";

interface AddressBookEntry {
  id: number;
  address: string;
  name: string;
  networkId: string;
}

interface TokenEntry {
  denom: string;
  enabled: boolean;
  networkId: string;
  contractAddress?: string;
  decimals: number;
  symbol: string;
}

// wallet
const storeWalletId = (wallet: StoreWallet) => `${wallet.index}`;
const storeWalletsAdapter = createEntityAdapter<StoreWallet>({
  selectId: storeWalletId,
});
const selectors = storeWalletsAdapter.getSelectors();
// address book
const storeAddress = createEntityAdapter<AddressBookEntry>();
const addressSelectors = storeAddress.getSelectors();
// tokens
const storeTokens = createEntityAdapter<TokenEntry>({
  selectId: (token) => token.denom,
});
const tokenSelectors = storeTokens.getSelectors();

const walletsSlice = createSlice({
  name: "wallets",
  initialState: {
    ...storeWalletsAdapter.getInitialState(),
    selectedWalletId: -1, // Add new state variable for selected wallet ID
  },
  reducers: {
    addSelected: storeWalletsAdapter.setOne,
    updateWallet: storeWalletsAdapter.upsertOne,
    removeWalletById: storeWalletsAdapter.removeOne,
    resetAllWallets: storeWalletsAdapter.removeAll,
    setSelectedNativeWalletIndex: (state, action: PayloadAction<number>) => {
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

const tokensSlice = createSlice({
  name: "tokens",
  initialState: storeTokens.getInitialState(),
  reducers: {
    updateToken: storeTokens.upsertOne,
    removeToken: storeTokens.removeOne,
    resetAllTokens: storeTokens.removeAll,
  },
});
// wallet
export const selectSelectedNativeWalletIndex = (state: RootState) =>
  state.wallets.selectedWalletId;
export const selectAllWallets = (state: RootState) =>
  selectors.selectAll(state.wallets);
export const selectWalletById = (state: RootState, id: EntityId) =>
  selectors.selectById(state.wallets, id);
// address book
export const selectAllAddressBook = (state: RootState) =>
  addressSelectors.selectAll(state.addressBook);
export const selectAddressBookById = (state: RootState, id: EntityId) =>
  addressSelectors.selectById(state.addressBook, id);
export const selectTokenId = (state: RootState, id: EntityId) =>
  tokenSelectors.selectById(state.tokens, id);

export const walletsReducer = walletsSlice.reducer;
export const addressBookReducer = addressBookSlice.reducer;
export const tokensReducer = tokensSlice.reducer;
export const { addEntry, removeEntry, resetAllAddressBook } =
  addressBookSlice.actions;

export const {
  addSelected,
  resetAllWallets,
  setSelectedNativeWalletIndex,
  updateWallet,
  removeWalletById,
} = walletsSlice.actions;
export const { updateToken, resetAllTokens } = tokensSlice.actions;
