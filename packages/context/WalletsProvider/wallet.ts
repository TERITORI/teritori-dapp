import { NetworkKind } from "../../networks";
import { WalletProvider } from "../../utils/walletProvider";

export interface Wallet {
  id: string;
  address: string;
  userId: string;
  networkId: string;
  networkKind: NetworkKind;
  provider: WalletProvider;
  connected: boolean;
}
