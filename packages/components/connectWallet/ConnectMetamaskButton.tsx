import { detect as detectBrowser } from "detect-browser";
import { useMetaMask } from "metamask-react";
import React from "react";
import { Linking } from "react-native";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import metamaskSVG from "../../../assets/icons/metamask.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { useSwitchNetwork } from "../../hooks/useSwitchNetwork";
import { getEthereumNetwork, selectableEthereumNetworks } from "../../networks";

export const ConnectMetamaskButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const { status, connect } = useMetaMask();
  const selectedNetworkId = useSelectedNetworkId();
  const switchNetwork = useSwitchNetwork();

  const isConnected = status === "connected";

  const handlePress = async () => {
    try {
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        const installURL =
          detectBrowser()?.name === "firefox"
            ? "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
            : "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
        Linking.openURL(installURL);
        return;
      }
      let network = getEthereumNetwork(selectedNetworkId);
      if (!network) {
        if (selectableEthereumNetworks.length) {
          network = selectableEthereumNetworks[0];
        }
      }
      if (!network) {
        throw new Error("no suitable network");
      }

      if (!isConnected) {
        const address = await connect();
        console.log("Connected address:", address);
      }

      switchNetwork(network.id);

      onDone && onDone();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to connect Metamask",
          message: err.message,
        });
      }
      onDone && onDone(err);
    }
  };
  return (
    <ConnectWalletButton
      text="Metamask Wallet"
      icon={metamaskSVG}
      iconSize={16}
      onPress={handlePress}
    />
  );
};
