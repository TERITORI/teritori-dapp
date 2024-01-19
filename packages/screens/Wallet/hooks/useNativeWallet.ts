import { getWalletFromMnemonic } from "@cosmology/core/src/utils/wallet";

import { getValueFor, save } from "../../../hooks/useMobileSecureStore";

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

export const getMnemonic = async () => {
  const mnemonic = await getValueFor("mnemonic");
  if (!mnemonic) {
    throw new Error("mnemonic not found");
  }
  return mnemonic;
};

export const setMnemonic = async (mnemonic: string) => {
  try {
    await save("mnemonic", mnemonic);
  } catch (e) {
    throw new Error(`failed to save mnemonic ${e}`);
  }
};
