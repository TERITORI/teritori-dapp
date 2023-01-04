import { useMetaMask } from "metamask-react";
import React from "react";
import { Linking } from "react-native";

import metamaskSVG from "../../../assets/icons/metamask.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { getNetwork } from "../../networks";
import {
  setIsMetamaskConnected,
  setSelectedNetworkId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { ConnectWalletButton } from "./components/ConnectWalletButton";

export const ConnectMetamaskButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const dispatch = useAppDispatch();
  const { status, connect } = useMetaMask();

  const isConnected = status === "connected";

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

      if (!isConnected) {
        const address = await connect();
        console.log("Connected address:", address);
      }

      dispatch(setSelectedNetworkId(ethereumNetworkId));
      dispatch(setIsMetamaskConnected(true));
      onDone && onDone();
    } catch (err) {
      onDone && onDone(err);
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
