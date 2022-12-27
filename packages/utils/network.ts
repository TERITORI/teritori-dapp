import { PublicKey } from "@solana/web3.js";
import { bech32 } from "bech32";
import { WalletProvider } from "./walletProvider";

export enum Network {
  Unknown = "Unknown",
  Teritori = "Teritori",
  Solana = "Solana",
  Ethereum = "Ethereum",
  Atom = "Atom",
  CosmosHub = "CosmosHub",
  Juno = "Juno",
  Osmosis = "Osmosis",
}

export const addressToNetwork = (address: string) => {
  try {
    const bech32Result = bech32.decode(address);
    switch (bech32Result.prefix) {
      case "tori":
        return Network.Teritori;
    }
  } catch {}
  try {
    // eslint-disable-next-line no-new
    new PublicKey(address); // this will throw if the address is invalid
    return Network.Solana;
  } catch {}
  return Network.Unknown;
};

export const walletProviderToNetwork = (walletProvider: WalletProvider) => {
  let network: Network | null = null;

  switch (walletProvider) {
    case WalletProvider.Metamask:
      network = Network.Ethereum;
      break;
    case WalletProvider.Keplr:
      network = Network.Teritori;
      break;
  }

  return network;
};
