import { PublicKey } from "@solana/web3.js";
import { bech32 } from "bech32";

export enum Network {
  Unknown = "Unknown",
  Solana = "Solana",
  Teritori = "Teritori",
  Ethereum = "Ethereum",
  Atom = "Atom",
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
