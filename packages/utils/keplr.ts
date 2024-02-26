import { OfflineDirectSigner, OfflineSigner } from "@cosmjs/proto-signing";
import {
  Window as KeplrWindow,
  OfflineAminoSigner as KeplrOfflineAminoSigner,
  OfflineDirectSigner as KeplrOfflineDirectSigner,
  SignDoc as KeplrSignDoc,
} from "@keplr-wallet/types";
import Long from "long";

export const getKeplr = () => {
  const keplrWindow = window as KeplrWindow;
  if (!keplrWindow.keplr) {
    throw new Error("keplr not installed");
  }
  return keplrWindow.keplr;
};

// keplr is using a local cosmjs definition that is using Long instead of bigint
export const convertKeplrSigner = (
  keplrSigner: KeplrOfflineAminoSigner | KeplrOfflineDirectSigner,
): OfflineSigner => {
  if ("signDirect" in keplrSigner) {
    const signer: OfflineDirectSigner = {
      getAccounts: async () => {
        return keplrSigner.getAccounts();
      },
      signDirect: async (signerAddress, signDoc) => {
        const convertedSignDoc: KeplrSignDoc = {
          ...signDoc,
          accountNumber: Long.fromString(signDoc.accountNumber.toString()),
        };
        const response = await keplrSigner.signDirect(
          signerAddress,
          convertedSignDoc,
        );
        return {
          ...response,
          signed: {
            ...response.signed,
            accountNumber: BigInt(response.signed.accountNumber.toString()),
          },
        };
      },
    };
    return signer;
  }
  if ("signAmino" in keplrSigner) {
    return keplrSigner;
  }
  throw new Error("unexpected signer shape");
};
