import { starknetSepoliaCurrencies } from "./currencies";
import { NetworkKind, StarknetNetworkInfo } from "../types";

export const starknetSepoliaNetwork: StarknetNetworkInfo = {
  id: "starknet-sepolia",
  kind: NetworkKind.Starknet,
  chainId: "534e5f5345504f4c4941", // SN_SEPOLIA
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

  defaultContract:
    "0x024068475e88548b0d6d06c6fbc5c691ce223ac611ca32a0a1b1c08a439d752a",
};
