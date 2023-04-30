import { Wallet } from "./wallet";
import { WalletProvider } from "../../utils/walletProvider";

export type UseWalletProviderResult = {
  hasProvider: boolean;
  ready: boolean;
  wallets: Wallet[];
  providerKind: WalletProvider;
};
