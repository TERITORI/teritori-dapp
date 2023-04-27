import * as encoding from "@walletconnect/encoding";

import { CosmosChainData } from "./wallet-connect-chains/cosmos";
import { EIP155ChainData } from "./wallet-connect-chains/eip155";
import { ElrondChainData } from "./wallet-connect-chains/elrond";
import { NearChainData } from "./wallet-connect-chains/near";
import { PolkadotChainData } from "./wallet-connect-chains/polkadot";
import { SolanaChainData } from "./wallet-connect-chains/solana";
import { TezosChainData } from "./wallet-connect-chains/tezos";
import { TronChainData } from "./wallet-connect-chains/tron";

export interface CosmosAccount {
  algo: string;
  address: string;
  pubkey: string;
}

export interface CosmosAccountInfo {
  account: CosmosAccount;
  networkId: string;
}

export interface AssetData {
  symbol: string;
  name: string;
  contractAddress?: string;
  balance?: string;
}

export interface ChainData {
  name: string;
  id: string;
  rpc: string[];
  slip44: number;
  testnet: boolean;
}
export interface ChainsMap {
  [reference: string]: ChainData;
}
export interface TxData {
  from: string;
  to: string;
  nonce: string;
  gasPrice: string;
  gasLimit: string;
  value: string;
  data: string;
}

export interface BlockScoutTx {
  value: string;
  txreceipt_status: string;
  transactionIndex: string;
  to: string;
  timeStamp: string;
  nonce: string;
  isError: string;
  input: string;
  hash: string;
  gasUsed: string;
  gasPrice: string;
  gas: string;
  from: string;
  cumulativeGasUsed: string;
  contractAddress: string;
  confirmations: string;
  blockNumber: string;
  blockHash: string;
}

export interface BlockScoutTokenTx {
  value: string;
  transactionIndex: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: string;
  to: string;
  timeStamp: string;
  nonce: string;
  input: string;
  hash: string;
  gasUsed: string;
  gasPrice: string;
  gas: string;
  from: string;
  cumulativeGasUsed: string;
  contractAddress: string;
  confirmations: string;
  blockNumber: string;
  blockHash: string;
}

export interface ParsedTx {
  timestamp: string;
  hash: string;
  from: string;
  to: string;
  nonce: string;
  gasPrice: string;
  gasUsed: string;
  fee: string;
  value: string;
  input: string;
  error: boolean;
  asset: AssetData;
  operations: TxOperation[];
}

export interface TxOperation {
  asset: AssetData;
  value: string;
  from: string;
  to: string;
  functionName: string;
}

export interface GasPricesResponse {
  fastWait: number;
  avgWait: number;
  blockNum: number;
  fast: number;
  fastest: number;
  fastestWait: number;
  safeLow: number;
  safeLowWait: number;
  speed: number;
  block_time: number;
  average: number;
}

export interface GasPrice {
  time: number;
  price: number;
}

export interface GasPrices {
  timestamp: number;
  slow: GasPrice;
  average: GasPrice;
  fast: GasPrice;
}

export interface MethodArgument {
  type: string;
}

export interface Method {
  signature: string;
  name: string;
  args: MethodArgument[];
}

export interface ChainRequestRender {
  label: string;
  value: string;
}

export interface ChainMetadata {
  name?: string;
  logo: string;
  rgb: string;
}

export interface NamespaceMetadata {
  [reference: string]: ChainMetadata;
}
export interface ChainNamespaces {
  [namespace: string]: ChainsMap;
}

export interface AccountAction {
  method: string;
  callback: (chainId: string, address: string) => Promise<void>;
}

export interface AccountBalances {
  [account: string]: AssetData[];
}

export const BLOCKCHAIN_LOGO_BASE_URL = "https://blockchain-api.xyz/logos/";

export const DEFAULT_MAIN_CHAINS = [
  // mainnets
  "eip155:1",
  "eip155:10",
  "eip155:100",
  "eip155:137",
  "eip155:42161",
  "eip155:42220",
  "cosmos:cosmoshub-4",
  "solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ",
  "polkadot:91b171bb158e2d3848fa23a9f1c25182",
  "elrond:1",
  "tron:0x2b6653dc",
  "tezos:mainnet",
];

export const DEFAULT_TEST_CHAINS = [
  // testnets
  "eip155:5",
  "eip155:420",
  "eip155:80001",
  "eip155:421611",
  "eip155:44787",
  "solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K",
  "polkadot:e143f23803ac50e8f6f8e62695d1ce9e",
  "near:testnet",
  "elrond:D",
  "tron:0xcd8690dc",
  "tezos:testnet",
];

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS];

/**
 * EIP155
 */
export enum DEFAULT_EIP155_METHODS {
  ETH_SEND_TRANSACTION = "eth_sendTransaction",
  ETH_SIGN_TRANSACTION = "eth_signTransaction",
  ETH_SIGN = "eth_sign",
  PERSONAL_SIGN = "personal_sign",
  ETH_SIGN_TYPED_DATA = "eth_signTypedData",
}

export enum DEFAULT_EIP_155_EVENTS {
  ETH_CHAIN_CHANGED = "chainChanged",
  ETH_ACCOUNTS_CHANGED = "accountsChanged",
}

/**
 * COSMOS
 */
export enum DEFAULT_COSMOS_METHODS {
  COSMOS_SIGN_DIRECT = "cosmos_signDirect",
  COSMOS_SIGN_AMINO = "cosmos_signAmino",
}

export enum DEFAULT_COSMOS_EVENTS {}

/**
 * SOLANA
 */
export enum DEFAULT_SOLANA_METHODS {
  SOL_SIGN_TRANSACTION = "solana_signTransaction",
  SOL_SIGN_MESSAGE = "solana_signMessage",
}

export enum DEFAULT_SOLANA_EVENTS {}

/**
 * POLKADOT
 */
export enum DEFAULT_POLKADOT_METHODS {
  POLKADOT_SIGN_TRANSACTION = "polkadot_signTransaction",
  POLKADOT_SIGN_MESSAGE = "polkadot_signMessage",
}

export enum DEFAULT_POLKADOT_EVENTS {}

/**
 * NEAR
 */
export enum DEFAULT_NEAR_METHODS {
  NEAR_SIGN_IN = "near_signIn",
  NEAR_SIGN_OUT = "near_signOut",
  NEAR_GET_ACCOUNTS = "near_getAccounts",
  NEAR_SIGN_AND_SEND_TRANSACTION = "near_signAndSendTransaction",
  NEAR_SIGN_AND_SEND_TRANSACTIONS = "near_signAndSendTransactions",
}

export enum DEFAULT_NEAR_EVENTS {}

/**
 * ELROND
 */
export enum DEFAULT_ELROND_METHODS {
  ELROND_SIGN_TRANSACTION = "erd_signTransaction",
  ELROND_SIGN_TRANSACTIONS = "erd_signTransactions",
  ELROND_SIGN_MESSAGE = "erd_signMessage",
  ELROND_SIGN_LOGIN_TOKEN = "erd_signLoginToken",
}

export enum DEFAULT_ELROND_EVENTS {}

/**
 * TRON
 */
export enum DEFAULT_TRON_METHODS {
  TRON_SIGN_TRANSACTION = "tron_signTransaction",
  TRON_SIGN_MESSAGE = "tron_signMessage",
}

export enum DEFAULT_TRON_EVENTS {}

/**
 * TEZOS
 */
export enum DEFAULT_TEZOS_METHODS {
  TEZOS_GET_ACCOUNTS = "tezos_getAccounts",
  TEZOS_SEND = "tezos_send",
  TEZOS_SIGN = "tezos_sign",
}

export enum DEFAULT_TEZOS_EVENTS {}

export const getAllChainNamespaces = () => {
  const namespaces: string[] = [];
  DEFAULT_CHAINS.forEach((chainId) => {
    const [namespace] = chainId.split(":");
    if (!namespaces.includes(namespace)) {
      namespaces.push(namespace);
    }
  });
  return namespaces;
};

export const getChainData = () => {
  const namespaces = getAllChainNamespaces();
  const chainData: ChainNamespaces = {};
  for (const namespace of namespaces) {
    let chains: ChainsMap | undefined;
    switch (namespace) {
      case "solana":
        chains = SolanaChainData;
        break;
      case "polkadot":
        chains = PolkadotChainData;
        break;
      case "near":
        chains = NearChainData;
        break;
      case "elrond":
        chains = ElrondChainData;
        break;
      case "tron":
        chains = TronChainData;
        break;
      case "cosmos":
        chains = CosmosChainData;
        break;
      case "eip155":
        chains = EIP155ChainData;
        break;
      case "tezos":
        chains = TezosChainData;
        break;
      default:
        console.error("Unknown chain namespace: ", namespace);
    }

    if (typeof chains !== "undefined") {
      chainData[namespace] = chains;
    }
  }
  return chainData;
};

export const getNamespacesFromChains = (chains: string[]) => {
  const supportedNamespaces: string[] = [];
  chains.forEach((chainId) => {
    const [namespace] = chainId.split(":");
    if (!supportedNamespaces.includes(namespace)) {
      supportedNamespaces.push(namespace);
    }
  });

  return supportedNamespaces;
};

export const getSupportedMethodsByNamespace = (namespace: string) => {
  switch (namespace) {
    case "eip155":
      return Object.values(DEFAULT_EIP155_METHODS);
    case "cosmos":
      return Object.values(DEFAULT_COSMOS_METHODS);
    case "solana":
      return Object.values(DEFAULT_SOLANA_METHODS);
    case "polkadot":
      return Object.values(DEFAULT_POLKADOT_METHODS);
    case "near":
      return Object.values(DEFAULT_NEAR_METHODS);
    case "elrond":
      return Object.values(DEFAULT_ELROND_METHODS);
    case "tron":
      return Object.values(DEFAULT_TRON_METHODS);
    case "tezos":
      return Object.values(DEFAULT_TEZOS_METHODS);
    default:
      throw new Error(`No default methods for namespace: ${namespace}`);
  }
};

export const getSupportedEventsByNamespace = (namespace: string) => {
  switch (namespace) {
    case "eip155":
      return Object.values(DEFAULT_EIP_155_EVENTS);
    case "cosmos":
      return Object.values(DEFAULT_COSMOS_EVENTS);
    case "solana":
      return Object.values(DEFAULT_SOLANA_EVENTS);
    case "polkadot":
      return Object.values(DEFAULT_POLKADOT_EVENTS);
    case "near":
      return Object.values(DEFAULT_NEAR_EVENTS);
    case "elrond":
      return Object.values(DEFAULT_ELROND_EVENTS);
    case "tron":
      return Object.values(DEFAULT_TRON_EVENTS);
    case "tezos":
      return Object.values(DEFAULT_TEZOS_EVENTS);
    default:
      throw new Error(`No default events for namespace: ${namespace}`);
  }
};

export const getRequiredNamespaces = (chains: string[]) => {
  const selectedNamespaces = getNamespacesFromChains(chains);
  console.log("selected namespaces:", selectedNamespaces);

  return Object.fromEntries(
    selectedNamespaces.map((namespace) => [
      namespace,
      {
        methods: getSupportedMethodsByNamespace(namespace),
        chains: chains.filter((chain) => chain.startsWith(namespace)),
        events: getSupportedEventsByNamespace(namespace) as any[],
      },
    ])
  );
};

export function convertHexToNumber(hex: string) {
  try {
    return encoding.hexToNumber(hex);
  } catch {
    return hex;
  }
}

export function convertHexToUtf8(hex: string) {
  try {
    return encoding.hexToUtf8(hex);
  } catch {
    return hex;
  }
}
