import { StdFee } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";

export interface DbSignature {
  bodyBytes: string;
  signature: string;
  address: string;
}

export interface DbTransaction {
  accountNumber: number;
  sequence: number;
  chainId: string;
  msgs: EncodeObject[];
  fee: StdFee;
  memo: string;
}

export interface DbAccount {
  address: string;
  pubkeyJSON: string;
  chainId: string;
}

export interface WalletAccount {
  address?: Uint8Array;
  pubkey: Uint8Array;
  algo: string;
  bech32Address: string;
  isNanoLedger?: boolean;
  name?: string;
}
