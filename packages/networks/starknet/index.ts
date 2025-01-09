import { starknetCurrencies } from "./currencies";
import { NetworkKind, StarknetNetworkInfo } from "../types";

export const starknetNetwork: StarknetNetworkInfo = {
  id: "starknet",
  kind: NetworkKind.Starknet,
  chainId: "534e5f4d41494e",  // SN_MAIN
  displayName: "Starknet",  
  icon: "starknet.svg",
  features: [],
  currencies: starknetCurrencies,
  txExplorer: "https://starkscan.co/tx/$hash",
  accountExplorer: "https://starkscan.co/contract/$address",
  contractExplorer: "https://starkscan.co/contract/$address",
  idPrefix: "starknet",
  testnet: true,
  backendEndpoint: "https://dapp-backend.mainnet.teritori.com",
  addressPrefix: "starknet",
  restEndpoint: "https://alpha-mainnet.starknet.io",
  rpcEndpoint: "https://rpc.starknet.io",
};
