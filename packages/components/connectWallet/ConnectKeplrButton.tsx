import { Window as KeplrWindow } from "@keplr-wallet/types";
import React from "react";
import { Linking } from "react-native";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import keplrSVG from "../../../assets/icons/keplr.svg";
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
  setIsKeplrConnected,
  setSelectedNetworkId,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";

export const ConnectKeplrButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const dispatch = useAppDispatch();
  const networkId = useSelectedNetworkId();
  const enabledNetworks = useEnabledNetworks();
  const handlePress = async () => {
    try {
      const keplr = (window as KeplrWindow)?.keplr;
      if (!keplr) {
        Linking.openURL(
          "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap",
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

      await keplr.experimentalSuggestChain(
        keplrChainInfoFromNetworkInfo(network),
      );

      await keplr.enable(network.chainId);

      const offlineSigner = await keplr.getOfflineSignerAuto(network.chainId);
      const accounts = await offlineSigner.getAccounts();

      dispatch(setSelectedNetworkId(network.id));
      if (accounts.length) {
        dispatch(setSelectedWalletId("keplr-" + accounts[0].address));
      }
      dispatch(setIsKeplrConnected(true));

      onDone && onDone();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to connect Keplr",
          message: err.message,
        });
      }
      onDone && onDone(err);
    }
  };

  return (
    <ConnectWalletButton
      text="Keplr Wallet"
      icon={keplrSVG}
      iconSize={16}
      onPress={handlePress}
    />
  );
};
