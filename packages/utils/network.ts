import { WalletProvider } from "./walletProvider";
import { NetworkKind } from "../networks";

export const walletProviderToNetworkKind = (
  walletProvider: WalletProvider | undefined
) => {
  switch (walletProvider) {
    case WalletProvider.Metamask:
      return NetworkKind.Ethereum;
    case WalletProvider.Keplr:
      return NetworkKind.Cosmos;
    case WalletProvider.Leap:
      return NetworkKind.Cosmos;
    case WalletProvider.Adena:
      return NetworkKind.Gno;
    default:
      return NetworkKind.Unknown;
  }
};
