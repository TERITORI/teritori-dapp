import React from "react";
import { Linking } from "react-native";
import { useAccount, useConnect } from "wagmi";

import metamaskSVG from "../../../assets/icons/metamask.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { getNetwork } from "../../networks";
import { setIsMetamaskConnected } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { ConnectWalletButton } from "./components/ConnectWalletButton";

export const ConnectMetamaskButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const dispatch = useAppDispatch();
  const { connectAsync, connectors } = useConnect();
  const { connector: activeConnector, isConnected } = useAccount();

  const handlePress = async () => {
    try {
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        Linking.openURL(
          "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
        );
        return;
      }
      const ethereumNetworkId = process.env.ETHEREUM_NETWORK_ID;
      if (!ethereumNetworkId) {
        console.error("no ethereum network id");
        return;
      }
      const network = getNetwork(ethereumNetworkId);
      if (!network) {
        console.error(`no ${ethereumNetworkId} network`);
        return;
      }

      const metamaskConnector = connectors.find((c) => c.id === "metaMask");
      if (!metamaskConnector) {
        console.error(`no metamask connector found`);
        return;
      }

      if (activeConnector?.id !== "metaMask" || !isConnected) {
        const result = await connectAsync({ connector: metamaskConnector });
        console.log("Connected account:", result.account);
      }

      dispatch(setIsMetamaskConnected(true));
      onDone && onDone();
    } catch (err) {
      onDone && onDone();
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to connect Metamask",
          message: err.message,
        });
      }
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
