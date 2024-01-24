import { Secp256k1HdWallet } from "@cosmjs/amino";
import { getWalletFromMnemonic } from "@cosmology/core/src/utils/wallet";

import { getValueFor, remove, save } from "../../../hooks/useMobileSecureStore";
import { mustGetCosmosNetwork } from "../../../networks";
import { addSelected } from "../../../store/slices/wallets";
import { useAppDispatch } from "../../../store/store";
import { createMnemonic } from "../util/seed";

export const getNativeWallet = (token?: "TORI", index: number = 0) => {
  return (async () => {
    try {
      let mnemonic = await getMnemonic(index);
      if (!mnemonic) {
        console.log("no mnemonic found, creating new one");
        mnemonic = createMnemonic();
        console.log("mnemonic", mnemonic);
        await setMnemonic(mnemonic, index);
      }
      console.log("mnemonic", mnemonic);
      return await getWalletFromMnemonic({
        mnemonic,
        token, //has to be all caps for TORI
      });
    } catch (e) {
      throw new Error(`failed to get wallet ${e}`);
    }
  })();
};

export const useRegisterWallet = async (
  wallet: Promise<Secp256k1HdWallet>,
  index: any,
) => {
  const dispatch = useAppDispatch();
  const networkId = "teritori";
  const network = mustGetCosmosNetwork(networkId);
  const instance = await wallet;
  instance.getAccounts().then((accounts) => {
    dispatch(
      addSelected({
        publicKey: accounts[0].address,
        network: network.kind,
        networkId: network.id,
        index,
      }),
    );
  });
};

export const getMnemonic = async (index: number = 0) => {
  try {
    return await getValueFor(`mnemonic-${index}`);
  } catch (e) {
    throw new Error(`failed to get mnemonic ${e}`);
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
