import { getWalletFromMnemonic } from "@cosmology/core/src/utils/wallet";

import { getValueFor, remove, save } from "../../../hooks/useMobileSecureStore";

export const useNativeWallet = async () => {
  const wallet = getWalletFromMnemonic({
    mnemonic: getMnemonic(),
    token: "tori",
  });
  if (!wallet) {
    throw new Error("wallet not found");
  }
  return wallet;
};

export const getMnemonic = async (index?: 0) => {
  const mnemonic = await getValueFor(`mnemonic-${index}`);
  if (!mnemonic) {
    throw new Error("mnemonic not found");
  }
  return mnemonic;
};

export const setMnemonic = async (mnemonic: string, index?: 0) => {
  try {
    await save(`mnemonic-${index}`, mnemonic);
  } catch (e) {
    throw new Error(`failed to save mnemonic ${e}`);
  }
};

export const resetWallet = async () => {
  try {
    await remove("mnemonic");
  } catch (e) {
    throw new Error(`failed to remove mnemonic ${e}`);
  }
};
