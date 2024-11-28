import React from "react";
import { Linking } from "react-native";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import { useFeedbacks } from "../../context/FeedbacksProvider";

import adenaSVG from "@/assets/icons/adena.svg";
import { getGnoNetworkFromChainId } from "@/networks/index";
import {
  setIsAdenaConnected,
  setSelectedNetworkId,
  setSelectedWalletId,
} from "@/store/slices/settings";
import { useAppDispatch } from "@/store/store";

export const ConnectAdenaButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToast } = useFeedbacks();
  const dispatch = useAppDispatch();

  const handlePress = async () => {
    try {
      const adena = (window as any)?.adena;
      if (!adena) {
        Linking.openURL("https://adena.app/");
        return;
      }

      const establishResult = await adena.AddEstablish("Teritori dApp");
      if (establishResult.status === "failure") {
        throw Error(establishResult.message);
      }

      console.log("established", establishResult);

      const account = await adena.GetAccount();
      const address = account.data.address;
      const chainId = account.data.chainId;
      const gnoNetwork = getGnoNetworkFromChainId(chainId);

      if (!gnoNetwork) {
        throw new Error(`Unsupported chainId ${chainId}`);
      }

      dispatch(setSelectedNetworkId(gnoNetwork.id));
      dispatch(setSelectedWalletId(`adena-${gnoNetwork.id}-${address}`));
      dispatch(setIsAdenaConnected(true));

      onDone && onDone();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToast({
          type: "error",
          message: err.message,
          mode: "normal",
          title: "Failed to connect to Adena (1)",
        });
      }
      onDone && onDone(err);
    }
  };
  return (
    <ConnectWalletButton
      text="Adena Wallet"
      icon={adenaSVG}
      iconSize={20}
      onPress={handlePress}
    />
  );
};
