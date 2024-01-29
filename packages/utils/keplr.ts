import { OfflineSigner } from "@cosmjs/proto-signing";
import {
  Window as KeplrWindow,
  OfflineAminoSigner as KeplrOfflineAminoSigner,
  OfflineDirectSigner as KeplrOfflineDirectSigner,
  SignDoc as KeplrSignDoc,
} from "@keplr-wallet/types";
import Long from "long";

import { mustGetCosmosNetwork, parseUserId } from "../networks";

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
  const signer: OfflineSigner = {
    getAccounts: async () => {
      return keplrSigner.getAccounts();
    },
    signDirect: async (signerAddress, signDoc) => {
      if (!("signDirect" in keplrSigner)) {
        throw new Error("signDirect not implemented");
      }
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
    signAmino: async (signerAddress, tx) => {
      if (!("signAmino" in keplrSigner)) {
        throw new Error("signAmino not implemented");
      }
      return keplrSigner.signAmino(signerAddress, tx);
    },
  };
  return signer;
};

export const keplrSignArbitrary = async (
  userId: string,
  data: string | Uint8Array,
) => {
  const keplr = getKeplr();
  const [network, signerAddress] = parseUserId(userId);
  const cosmosNetwork = mustGetCosmosNetwork(network?.id);
  const signature = await keplr.signArbitrary(
    cosmosNetwork.chainId,
    signerAddress,
    data,
  );
  return signature;
};
