import { NetworkKind } from "@/networks";

export type TransactionForm = {
  toAddress: string;
  fromAddress: string;
  amount: string;
};

export interface StoreWallet {
  index: number;
  address: string;
  name: string;
  provider: "native" | "ledger" | "google";
  network: NetworkKind;
  networkId: string;
}
