import { getWalletFromMnemonic } from "@cosmology/core/src/utils/wallet";

import { getValueFor, remove, save } from "../../../hooks/useMobileSecureStore";

export const useNativeWallet = async (token: "TORI") => {
  const wallet = getWalletFromMnemonic({
    mnemonic: getMnemonic(),
    token, //has to be all caps for TORI
  });
  if (!wallet) {
    throw new Error("wallet not found");
  }
  return wallet;
};

export const getMnemonic = (index?: 0) => {
  return getValueFor(`mnemonic-${index}`)
    .then((res) => res)
    .catch((e) => {
      throw new Error(`failed to get mnemonic ${e}`);
    });
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
