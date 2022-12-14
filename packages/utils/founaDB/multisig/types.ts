export interface DbSignature {
  bodyBytes: string;
  signature: string;
  address: string;
}

export interface DbCreateTransaction {
  type: string;
  recipientAddress: string;
  accountNumber: number;
  sequence: number;
  chainId: string;
  msgs: string;
  fee: string;
  memo: string;
  createdBy: string;
  createdAt: string;
}

export interface DbAccount {
  address: string;
  pubkeyJSON: string;
  chainId: string;
  userAddresses: string[];
}

export interface WalletAccount {
  address?: Uint8Array;
  pubkey: Uint8Array;
  algo: string;
  bech32Address: string;
  isNanoLedger?: boolean;
  name?: string;
}
