import { Pubkey, pubkeyToAddress } from "@cosmjs/amino";
import { Decimal } from "@cosmjs/math";
import { Coin } from "@cosmjs/stargate";

import { useMultisigContext } from "../../context/MultisigReducer";
import { getNonSigningStargateClient } from "../../networks";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const useMultisigHelpers = () => {
  const { state } = useMultisigContext();

  const selectedNetworkId = useSelectedNetworkId();

  // functions
  const getPubkeyFromNode = async (address: string) => {
    if (!state?.chain?.nodeAddress) {
      throw new Error("Unable to fetch");
    }
    const client = await getNonSigningStargateClient(selectedNetworkId);

    const accountOnChain = await client.getAccount(address);

    if (!accountOnChain || !accountOnChain.pubkey) {
      throw new Error(
        "Account has no pubkey on chain, this address will need to send a transaction to appear on chain."
      );
    }
    return accountOnChain.pubkey.value;
  };

  /**
   * Takes a Coin (e.g. `{"amount": "1234", "denom": "uatom"}`) and converts it into a user-readable string.
   *
   * The state.chain provided displayDenom/displayDenomExponent
   * will be used if the denom matches the denom stored in the state.chain object.
   *
   * A leading "u" is interpreted as µ (micro) and uxyz will be converted to XYZ
   * for displaying.
   *
   * @param {object} coin (e.g. `{"amount": "1234", "denom": "uatom"}`)
   * @return {string} The abbreviated string.
   */
  const coinSimplified = (coin: Coin) => {
    // null, undefined and this sort of things
    if (!coin) return null;

    if (coin.denom === state.chain.denom) {
      const exponent = Number(state.chain.displayDenomExponent);
      const value = Decimal.fromAtomics(
        coin.amount ?? "0",
        exponent
      ).toString();
      const ticker = state.chain.displayDenom;
      return { value, ticker };
    }

    // Auto-convert leading "u"s
    if (coin.denom?.startsWith("u")) {
      const value = Decimal.fromAtomics(coin.amount ?? "0", 6).toString();
      const ticker = coin.denom.slice(1).toUpperCase();
      return { value, ticker };
    }

    // Fallback to plain coin display
    return { value: coin.amount, ticker: coin.denom };
  };

  const participantAddressesFromMultisig = (multisigPubkey: Pubkey) => {
    const values: string[] = multisigPubkey.value.pubkeys.map(
      (p: Pubkey) =>
        pubkeyToAddress(p, state.chain?.addressPrefix || "") as string
    );
    return values;
  };

  // returns
  return {
    getPubkeyFromNode,
    coinSimplified,
    participantAddressesFromMultisig,
  };
};
