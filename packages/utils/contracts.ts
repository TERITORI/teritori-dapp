import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import {
  TeritoriSquadStakingClient,
  TeritoriSquadStakingQueryClient,
} from "../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.client";
import { SquadStakingV3__factory } from "../evm-contracts-clients/teritori-squad-staking/SquadStakingV3__factory";
import {
  getCosmosNetwork,
  getEthereumNetwork,
  getKeplrSigningCosmWasmClient,
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "../networks";
import { getMetaMaskEthereumProvider } from "./ethereum";

export const getCosmosNameServiceQueryClient = async (
  networkId: string | undefined
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
      err
    );
    return undefined;
  }

  const nsClient = new TeritoriNameServiceQueryClient(
    cosmWasmClient,
    network.nameServiceContractAddress
  );

  return nsClient;
};

export const getEthereumSquadStakingQueryClient = async (
  networkId: string | undefined
) => {
  const network = getEthereumNetwork(networkId);
  const contractAddress = network?.riotSquadStakingContractAddress;
  if (!contractAddress) {
    throw new Error("missing squad staking contract address in network config");
  }

  const provider = await getMetaMaskEthereumProvider(network.chainId);
  if (!provider) {
    throw Error("unable to get ethereum provider");
  }
  const client = SquadStakingV3__factory.connect(contractAddress, provider);
  return client;
};

export const getCosmosSquadStakingQueryClient = async (
  networkId: string | undefined
) => {
  const network = getCosmosNetwork(networkId);
  const contractAddress = network?.riotSquadStakingContractAddressV2;
  if (!contractAddress) {
    throw new Error("missing squad staking contract address in network config");
  }
  const nonSigningClient = await mustGetNonSigningCosmWasmClient(network.id);
  return new TeritoriSquadStakingQueryClient(nonSigningClient, contractAddress);
};

export const getKeplrSquadStakingClient = async (
  userId: string | undefined
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
    contractAddress
  );
};
