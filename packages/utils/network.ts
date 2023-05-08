import { NetworkKind } from "../networks";
import { WalletProvider } from "./walletProvider";

export const walletProviderToNetworkKind = (
  walletProvider: WalletProvider | undefined
) => {
  switch (walletProvider) {
    case WalletProvider.Metamask:
      return NetworkKind.Ethereum;
    case WalletProvider.Keplr:
      return NetworkKind.Cosmos;
    default:
      return NetworkKind.Unknown;
  }
};
