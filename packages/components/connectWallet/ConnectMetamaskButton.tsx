import { useMetaMask } from "metamask-react";
import React from "react";
import { Linking } from "react-native";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import metamaskSVG from "../../../assets/icons/metamask.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useEnabledNetworks } from "../../hooks/useEnabledNetworks";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import {
  EthereumNetworkInfo,
  getEthereumNetwork,
  NetworkKind,
} from "../../networks";
import { setSelectedNetworkId } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";

export const ConnectMetamaskButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const dispatch = useAppDispatch();
  const { status, connect } = useMetaMask();
  const selectedNetworkId = useSelectedNetworkId();
  const enabledNetworks = useEnabledNetworks();

  const isConnected = status === "connected";

  const handlePress = async () => {
    try {
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        Linking.openURL(
          "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        );
        return;
      }

      const selectableEthereumNetworks = enabledNetworks.filter(
        (n): n is EthereumNetworkInfo => n.kind === NetworkKind.Ethereum,
      );

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

      dispatch(setSelectedNetworkId(network.id));

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
