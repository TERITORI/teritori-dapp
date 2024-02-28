import { Secp256k1HdWallet } from "@cosmjs/amino";
import { stringToPath } from "@cosmjs/amino/node_modules/@cosmjs/crypto/build/slip10";

import { getValueFor, remove, save } from "./secure-store";

import { createMnemonic } from "@/utils/wallet/seed";

export const getNativeWallet = (
  prefix: string = "tori",
  index: number = 0,
  path: string = "m/44'/118'/0'/0/0",
) => {
  return (async () => {
    try {
      let mnemonic = await getMnemonic(index);
      console.log("mnemonic", mnemonic);
      if (!mnemonic) {
        console.log("no mnemonic found, creating new one");
        mnemonic = createMnemonic();
        await setMnemonic(mnemonic, index);
      }
      return await Secp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix, // maybe add validation ?
        hdPaths: [stringToPath(path)],
      });
    } catch (e) {
      throw new Error(`failed to get wallet ${e}`);
    }
  })();
};

export const getMnemonic = async (index: number = 0) => {
  try {
    console.log("getting mnemonic", index);
    return await getValueFor(`mnemonic-${index}`);
  } catch (e) {
    console.error(`failed to get mnemonic ${e}`);
    return null;
  }
};

export const setMnemonic = async (mnemonic: string, index: number = 0) => {
  try {
    await save(`mnemonic-${index}`, mnemonic);
  } catch (e) {
    throw new Error(`failed to save mnemonic ${e}`);
  }
};

export const resetWallet = async (index: number) => {
  try {
    await remove(`mnemonic-${index}`);
  } catch (e) {
    throw new Error(`failed to remove mnemonic ${e}`);
  }
};
