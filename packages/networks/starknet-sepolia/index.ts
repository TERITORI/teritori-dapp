import { starknetSepoliaCurrencies } from "./currencies";
import { NetworkKind, StarknetNetworkInfo } from "../types";

export const starknetSepoliaNetwork: StarknetNetworkInfo = {
  id: "starknet-sepolia",
  kind: NetworkKind.Starknet,
  chainId: "SN_SEPOLIA", // 0x534e5f5345504f4c4941
  displayName: "Starknet Sepolia",
  icon: "starknet.svg",
  features: [],
  currencies: starknetSepoliaCurrencies,
  txExplorer: "https://starkscan.co/tx/$hash",
  accountExplorer: "https://starkscan.co/contract/$address",
  contractExplorer: "https://starkscan.co/contract/$address",
  idPrefix: "sepolia",
  testnet: true,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  addressPrefix: "starknet",
  restEndpoint: "https://alpha-sepolia.starknet.io",
  rpcEndpoint: "https://rpc.sepolia.starknet.io",
};
