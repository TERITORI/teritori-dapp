import { InjectedConnector, useConnect } from "@starknet-react/core";
import React from "react";
import { Linking } from "react-native";
import { StarknetWindowObject, connect } from "starknetkit";
import { shortString } from "starknet";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import { useFeedbacks } from "../../context/FeedbacksProvider";

import argentSVG from "@/assets/icons/argent-x.svg";
import { getStarknetNetworkByChainId } from "@/networks";
import {
  setIsArgentXConnected,
  setSelectedNetworkId,
  setSelectedWalletId,
} from "@/store/slices/settings";
import { useAppDispatch } from "@/store/store";

export const ConnectArgentXButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToast } = useFeedbacks();
  const dispatch = useAppDispatch();

  const { connectAsync: connectViaReact } = useConnect();

  const handlePress = async () => {
    // FIXME: only work with argentX for now, later we can allow to select all available wallets
    const starknet = window.starknet as StarknetWindowObject;
    if (!starknet) {
      Linking.openURL(
        "https://chromewebstore.google.com/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb",
      );
      return;
    }

    const connector = new InjectedConnector({
      options: {
        id: starknet.id,
        name: starknet.name,
        icon: starknet.icon,
      },
    });

    try {
      const { connectorData } = await connect({
        connectors: [connector],
      });

      const chainId = shortString.decodeShortString(
        "0x" + connectorData?.chainId?.toString(16) ?? "",
      );
      const network = getStarknetNetworkByChainId(chainId);
      if (!network) throw Error("failed to get starknet network");

      // FIXME: force to connect via react, check later to link react with normal connection
      await connectViaReact({ connector });

      dispatch(setIsArgentXConnected(true));
      dispatch(setSelectedNetworkId(network.id));
      if (connectorData?.account) {
        dispatch(setSelectedWalletId("argentX-" + connectorData?.account));
      }

      onDone?.();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToast({
          type: "error",
          message: err.message,
          mode: "normal",
          title: "Failed to connect to ArgentX (1)",
        });
      }
      onDone?.(err);
    }
  };
  return (
    <ConnectWalletButton
      text="Argent X Wallet"
      icon={argentSVG}
      iconSize={20}
      onPress={handlePress}
    />
  );
};
