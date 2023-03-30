import {
  MultisigThresholdPubkey,
  Coin,
  isMultisigThresholdPubkey,
} from "@cosmjs/amino";
import { StargateClient, Account } from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMultisigContext } from "../../context/MultisigReducer";
import { mustGetCosmosNetwork } from "../../networks";
import { MultisigType } from "../../screens/Multisig/types";
import { getMultisig } from "../../utils/founaDB/multisig/multisigGraphql";

export const getMultisigAccount = async (
  address: string,
  networkId: string
) => {
  const network = mustGetCosmosNetwork(networkId);
  const client = await StargateClient.connect(network.rpcEndpoint);
  const accountOnChain = await client.getAccount(address);
  const res = await getMultisig(address, network.chainId);
  const data = res.data.data.getMultisig as MultisigType;

  return {
    accountData: accountOnChain,
    dbData: data,
  };
};

export const useGetMultisigAccount = (address: string) => {
  // variables
  const { state } = useMultisigContext();
  const { setToastError } = useFeedbacks();
  //  request
  const request = useQuery<{
    accountData: [MultisigThresholdPubkey, Account | null];
    holdings: Coin;
    dbData: MultisigType;
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
      if (
        accountOnChain?.pubkey &&
        !isMultisigThresholdPubkey(accountOnChain.pubkey)
      ) {
        setToastError({
          title: "Something went wrong!",
          message: "Pubkey on chain is not of type MultisigThreshold",
        });
        return null;
      }

      const res = await getMultisig(address, chainId);

      if (!res.data.data.getMultisig) {
        setToastError({
          title: "Something went wrong!",
          message:
            "Multisig has no pubkey on node, and was not created using this tool.",
        });
        return null;
      }
      const pubkey = JSON.parse(res.data.data.getMultisig.pubkeyJSON);
      const data = res.data.data.getMultisig as MultisigType;

      return {
        accountData: [pubkey, accountOnChain],
        holdings: tempHoldings,
        dbData: data,
      };
    },
    {}
  );

  return request;
};
