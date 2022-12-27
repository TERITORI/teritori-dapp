import { getNetwork } from "../networks";
import { WalletProvider } from "../utils/walletProvider";
import useSelectedWallet from "./useSelectedWallet";

export const useSelectedNetworkId = () => {
  const selectedWallet = useSelectedWallet();
  if (!selectedWallet) return "";

  let networkId = "";
  switch (selectedWallet.provider) {
    case WalletProvider.Keplr:
      networkId = process.env.TERITORI_NETWORK_ID || "";
      break;
    case WalletProvider.Metamask:
      networkId = process.env.ETHEREUM_NETWORK_ID || "";
      break;
  }

  return networkId;
};

export const useSelectedNetwork = () => {
  const networkId = useSelectedNetworkId();
  return getNetwork(networkId);
};
