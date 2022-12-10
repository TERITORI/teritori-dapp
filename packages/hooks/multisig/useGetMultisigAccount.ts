import {
  MultisigThresholdPubkey,
  isMultisigThresholdPubkey,
  Coin,
} from "@cosmjs/amino";
import { StargateClient, Account } from "@cosmjs/stargate";
import { assert } from "@cosmjs/utils";
import { useQuery } from "@tanstack/react-query";

import { useMultisigContext } from "../../context/MultisigReducer";
import { getMultisig } from "../../utils/founaDB/multisig/multisigGraphql";

export const useGetMultisigAccount = (address: string) => {
  // variables
  const { state } = useMultisigContext();

  //  request
  const request = useQuery<{
    accountData: [MultisigThresholdPubkey, Account | null];
    holdings: Coin;
    id: string;
  } | null>(
    ["multisig-account", address],
    async () => {
      if (!state.chain?.nodeAddress || !state.chain?.denom) {
        return null;
      }

      const client = await StargateClient.connect(state.chain.nodeAddress);
      const accountOnChain = await client.getAccount(address);
      const chainId = await client.getChainId();
      const tempHoldings = await client.getBalance(address, state.chain.denom);

      let pubkey, id;
      // if (accountOnChain?.pubkey) {
      //   assert(
      //     isMultisigThresholdPubkey(accountOnChain.pubkey),
      //     "Pubkey on chain is not of type MultisigThreshold"
      //   );
      //   pubkey = accountOnChain.pubkey;
      // } else {
      //   console.log("No pubkey on chain for: ", address);

      const res = await getMultisig(address, chainId);
      console.log("res", res);
      console.log("data", res.data.data.getMultisig);
      console.log("id", res.data.data.getMultisig._id);

      if (!res.data.data.getMultisig) {
        throw new Error(
          "Multisig has no pubkey on node, and was not created using this tool."
        );
      }
      pubkey = JSON.parse(res.data.data.getMultisig.pubkeyJSON);
      id = res.data.data.getMultisig._id;

      // }

      return {
        accountData: [pubkey, accountOnChain],
        holdings: tempHoldings,
        id,
      };
    },
    {}
  );

  return request;
};
