import React from "react";
import { Linking } from "react-native";

import { ConnectWalletButton } from "./components/ConnectWalletButton";
import adenaSVG from "@/assets/icons/adena.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  setIsAdenaConnected,
  setSelectedNetworkId,
} from "@/store/slices/settings";
import { useAppDispatch } from "@/store/store";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { NetworkKind } from "@/networks/types";
import { getGnoNetworkFromChainId } from "@/networks/index";

export const ConnectAdenaButton: React.FC<{
  onDone?: (err?: unknown) => void;
}> = ({ onDone }) => {
  const { setToast } = useFeedbacks();
  const dispatch = useAppDispatch();
  const selectedNetworkInfo = useSelectedNetworkInfo();

  const handlePress = async () => {
    try {
      const adena = (window as any)?.adena;
      if (!adena) {
        Linking.openURL("https://adena.app/");
        return;
      }

      // NOTE: we just show the connection popup, all the processing logic is already handled in useAdena
      const establishResult = await adena.AddEstablish("Teritori dApp");
      console.log("established", establishResult);
      dispatch(setIsAdenaConnected(true));

      // If we are not in Gno then try to switch to gno
      if (selectedNetworkInfo.kind !== NetworkKind.Gno) {
        const account = await adena.GetAccount();
        const gnoNetwork = getGnoNetworkFromChainId(account.data.chainId);
        dispatch(setSelectedNetworkId(gnoNetwork.id));
      }

      onDone && onDone();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToast({
          type: "error",
          message: err.message,
          mode: "normal",
          title: "Failed to connect to Adena",
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
