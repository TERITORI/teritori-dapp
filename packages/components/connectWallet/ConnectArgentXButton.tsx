import {
  argent,
  useAccount,
  useConnect,
  useNetwork,
} from "@starknet-react/core";
import React, { useEffect } from "react";
import { Linking } from "react-native";
import { shortString } from "starknet";
import { StarknetWindowObject } from "starknetkit";

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
  const { account: connectedAccount } = useAccount();
  const dispatch = useAppDispatch();
  const { connectAsync } = useConnect();
  const { chain: connectedChain } = useNetwork();

  useEffect(() => {
    if (!connectedAccount || !connectedChain) return;

    const chainId = shortString.decodeShortString(
      "0x" + connectedChain.id.toString(16),
    );
    const network = getStarknetNetworkByChainId(chainId);
    if (!network) throw Error("failed to get starknet network");

    dispatch(setSelectedNetworkId(network.id));
    dispatch(setSelectedWalletId("argentX-" + connectedAccount.address));
    dispatch(setIsArgentXConnected(true));
  }, [connectedAccount, connectedChain, dispatch]);

  const handlePress = async () => {
    // FIXME: only work with argentX for now, later we can allow to select all available wallets
    const starknet = window.starknet as StarknetWindowObject;
    if (!starknet) {
      Linking.openURL(
        "https://chromewebstore.google.com/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb",
      );
      return;
    }

    try {
      await connectAsync({ connector: argent() });
      onDone?.();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToast({
          type: "error",
          message: err.message,
          mode: "normal",
          title: "Failed to connect to ArgentX",
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
