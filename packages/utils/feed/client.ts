import {
  Cw721MembershipClient,
  Cw721MembershipQueryClient,
} from "@/contracts-clients/cw721-membership";
import {
  getNetworkFeature,
  mustGetNonSigningCosmWasmClient,
  NetworkFeature,
  parseUserId,
} from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";

export const mustGetCw721MembershipQueryClient = async (
  networkId: string | undefined,
) => {
  if (!networkId) {
    throw new Error("Invalid network id");
  }
  const pmFeature = getNetworkFeature(
    networkId,
    NetworkFeature.CosmWasmPremiumFeed,
  );
  if (!pmFeature) {
    throw new Error(`Network ${networkId} does not support premium feed`);
  }
  const client = await mustGetNonSigningCosmWasmClient(networkId);
  const pmClient = new Cw721MembershipQueryClient(
    client,
    pmFeature.membershipContractAddress,
  );
  return pmClient;
};

export const mustGetCw721MembershipSigningClient = async (userId: string) => {
  const [network, callerAddress] = parseUserId(userId);
  if (!network || !callerAddress) {
    throw new Error(`Invalid user id ${userId}`);
  }
  const networkId = network.id;
  const pmFeature = getNetworkFeature(
    networkId,
    NetworkFeature.CosmWasmPremiumFeed,
  );
  if (!pmFeature) {
    throw new Error(`Network ${networkId} does not support premium feed`);
  }
  const client = await getKeplrSigningCosmWasmClient(networkId);
  const pmClient = new Cw721MembershipClient(
    client,
    callerAddress,
    pmFeature.membershipContractAddress,
  );
  return pmClient;
};
