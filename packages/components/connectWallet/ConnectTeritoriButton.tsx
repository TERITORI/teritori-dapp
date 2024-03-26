import { Window as KeplrWindow } from "@keplr-wallet/types";
import React from "react";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import keplrSVG from "../../../assets/icons/keplr.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import {
  keplrChainInfoFromNetworkInfo,
  mustGetCosmosNetwork,
} from "../../networks";
import { useAppDispatch } from "../../store/store";

import {
  setIsKeplrConnected,
  setSelectedNetworkId,
  setSelectedWalletId,
} from "@/store/slices/settings";
import {
  addSelected,
  setSelectedNativeWalletIndex,
} from "@/store/slices/wallets";

export const ConnectTeritoriButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToastError } = useFeedbacks();
  const dispatch = useAppDispatch();
  const networkId = useSelectedNetworkId();

  const network = mustGetCosmosNetwork(networkId);
  const handlePress = async () => {
    try {
      //@ts-expect-error Not implemented
      const accounts = await window.getAccounts();
      console.log("get accounts", accounts);
      const maxIndex = 0;
      dispatch(
        addSelected({
          address: accounts[0].address,
          network: network.kind,
          name: `Account ${maxIndex + 1}`,
          provider: "native",
          networkId: "teritori",
          index: maxIndex + 1,
          hdPath: "m/44'/118'/0'/0/0",
        }),
      );

      dispatch(setSelectedNativeWalletIndex(maxIndex + 1));

      // dispatch(setSelectedNetworkId(network.id));
      // dispatch(setSelectedWalletId("tori-" + accounts[0].address));
      // dispatch(setIsKeplrConnected(true));
      onDone && onDone();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Failed to connect Teritori",
          message: err.message,
        });
      }
      onDone && onDone(err);
    }
  };

  return (
    <ConnectWalletButton
      text="Teritori Wallet"
      icon={keplrSVG}
      iconSize={16}
      onPress={handlePress}
    />
  );
};
