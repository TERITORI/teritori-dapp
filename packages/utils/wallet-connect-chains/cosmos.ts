import { JsonRpcRequest } from "@walletconnect/jsonrpc-utils";

import { osmosisNetwork } from "../../networks/osmosis";
import {
  NamespaceMetadata,
  ChainMetadata,
  ChainRequestRender,
  ChainsMap,
  BLOCKCHAIN_LOGO_BASE_URL,
} from "../wallet-connect";

export const CosmosChainData: ChainsMap = {
  "cosmoshub-4": {
    name: "Cosmos Hub",
    id: "cosmos:cosmoshub-4",
    rpc: ["https://rpc.cosmos.network"],
    slip44: 118,
    testnet: false,
  },
  "teritori-1": {
    name: "Teritori",
    id: "cosmos:teritori-1",
    rpc: ["https://rpc.mainnet.teritori.com"],
    slip44: 118,
    testnet: false,
  },
  "osmosis-1": {
    name: "Osmosis",
    id: "cosmos:osmosis-1",
    rpc: [osmosisNetwork.rpcEndpoint],
    slip44: 118,
    testnet: false,
  },
  "irishub-1": {
    name: "Irisnet",
    id: "cosmos:irishub-1",
    rpc: ["https://rpc.irisnet.org"],
    slip44: 566,
    testnet: false,
  },
  "kava-4": {
    name: "Kava",
    id: "cosmos:kava-4",
    rpc: ["https://kava4.data.kava.io"],
    slip44: 459,
    testnet: false,
  },
  "columbus-4": {
    name: "Terra",
    id: "cosmos:columbus-4",
    rpc: [],
    slip44: 330,
    testnet: false,
  },
};

export const CosmosMetadata: NamespaceMetadata = {
  "cosmoshub-4": {
    logo: BLOCKCHAIN_LOGO_BASE_URL + "cosmos:cosmoshub-4.png",
    rgb: "27, 31, 53",
  },
};

export function getChainMetadata(chainId: string): ChainMetadata {
  const reference = chainId.split(":")[1];
  const metadata = CosmosMetadata[reference];
  if (typeof metadata === "undefined") {
    throw new Error(`No chain metadata found for chainId: ${chainId}`);
  }
  return metadata;
}

export function getChainRequestRender(
  request: JsonRpcRequest
): ChainRequestRender[] {
  let params = [{ label: "Method", value: request.method }];

  switch (request.method) {
    default:
      params = [
        ...params,
        {
          label: "params",
          value: JSON.stringify(request.params, null, "\t"),
        },
      ];
      break;
  }
  return params;
}
