import { starknetSepoliaCurrencies } from "./currencies";
import { NetworkKind, StarknetNetworkInfo } from "../types";

export const starknetSepoliaNetwork: StarknetNetworkInfo = {
  id: "starknet-sepolia",
  kind: NetworkKind.Starknet,
  // chainId bigint: 393402133025997798000961n hex: 534e5f5345504f4c4941 string: SN_SEPOLIA
  chainId: "SN_SEPOLIA",
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

  todoListContractAddress:
    "0x0203268c10434d563a4954bcd2af176095082545cd80d3c71bcd2a949ae6f46e",
};
