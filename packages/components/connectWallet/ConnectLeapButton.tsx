import { OfflineSigner } from "@cosmjs/proto-signing";
import React from "react";
import { Linking } from "react-native";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import leapSVG from "../../../assets/icons/leap-cosmos-logo.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useEnabledNetworks } from "../../hooks/useEnabledNetworks";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import {
  CosmosNetworkInfo,
  getCosmosNetwork,
  keplrChainInfoFromNetworkInfo,
  NetworkKind,
} from "../../networks";
import {
  setIsLeapConnected,
  setSelectedNetworkId,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";

export const ConnectLeapButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const dispatch = useAppDispatch();
  const networkId = useSelectedNetworkId();
  const enabledNetworks = useEnabledNetworks();
  const handlePress = async () => {
    try {
      // @ts-ignore
      const leap = window.leap;
      if (!leap) {
        Linking.openURL(
          "https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg",
        );
        return;
      }

      const selectableCosmosNetworks = enabledNetworks.filter(
        (n): n is CosmosNetworkInfo => n.kind === NetworkKind.Cosmos,
      );

      let network = getCosmosNetwork(networkId);
      if (!network) {
        if (selectableCosmosNetworks.length) {
          network = selectableCosmosNetworks[0];
        }
      }
      if (!network) {
        throw new Error("no suitable network");
      }

      await leap.experimentalSuggestChain(
        keplrChainInfoFromNetworkInfo(network),
      );

      await leap.enable(network.chainId);

      const offlineSigner: OfflineSigner = await leap.getOfflineSignerAuto(
        network.chainId,
      );
      const accounts = await offlineSigner.getAccounts();

      dispatch(setSelectedNetworkId(network.id));
      if (accounts.length) {
        dispatch(setSelectedWalletId("leap-" + accounts[0].address));
      }
      dispatch(setIsLeapConnected(true));

      onDone && onDone();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to connect Leap",
          message: err.message,
        });
      }
      onDone && onDone(err);
    }
  };
  return (
    <ConnectWalletButton
      text="Leap Wallet"
      icon={leapSVG}
      iconSize={16}
      onPress={handlePress}
    />
  );
};
