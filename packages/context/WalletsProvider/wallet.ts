import { WalletProvider } from "../../utils/walletProvider";

export interface Wallet {
  id: string;
  address: string;
  provider: WalletProvider;
  connected: boolean;
}
