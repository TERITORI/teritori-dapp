import { Network } from "../../utils/network";
import { WalletProvider } from "../../utils/walletProvider";

export interface Wallet {
  id: string;
  publicKey: string;
  provider: WalletProvider;
  connected: boolean;
  network: Network;
}
