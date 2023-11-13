import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import {
  TeritoriSquadStakingClient,
  TeritoriSquadStakingQueryClient,
} from "../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.client";
import {
  getCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../networks";

export const getCosmosNameServiceQueryClient = async (
  networkId: string | undefined,
) => {
  const network = getCosmosNetwork(networkId);
  if (!network?.nameServiceContractAddress) {
    return undefined;
  }

  let cosmWasmClient;
  try {
    cosmWasmClient = await mustGetNonSigningCosmWasmClient(network.id);
  } catch (err) {
    console.warn(
      `failed to get non signing cosmwasm client for network '${network.id}':`,
      err,
    );
    return undefined;
  }

  const nsClient = new TeritoriNameServiceQueryClient(
    cosmWasmClient,
    network.nameServiceContractAddress,
  );

  return nsClient;
};

export const getSquadStakingQueryClient = async (
  networkId: string | undefined,
) => {
  const network = mustGetCosmosNetwork(networkId);
  const contractAddress = network.riotSquadStakingContractAddressV2;
  if (!contractAddress) {
    throw new Error("missing squad staking contract address in network config");
  }
  const nonSigningClient = await mustGetNonSigningCosmWasmClient(network.id);
  return new TeritoriSquadStakingQueryClient(nonSigningClient, contractAddress);
};

export const getKeplrSquadStakingClient = async (
  userId: string | undefined,
) => {
  const [network, userAddress] = parseUserId(userId);
  const cosmosNetwork = mustGetCosmosNetwork(network?.id);
  const contractAddress = cosmosNetwork?.riotSquadStakingContractAddressV2;
  if (!contractAddress) {
    throw new Error("missing squad staking contract address in network config");
  }
  const cosmWasmClient = await getKeplrSigningCosmWasmClient(cosmosNetwork.id);
  return new TeritoriSquadStakingClient(
    cosmWasmClient,
    userAddress,
    contractAddress,
  );
};
