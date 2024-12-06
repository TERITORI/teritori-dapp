import { useCallback } from "react";

import { useAdenaStore } from "./useAdenaStore";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { GnoNetworkInfo, NetworkInfo, NetworkKind } from "@/networks";

export const useAdenaUtils = () => {
  const { setState } = useAdenaStore();
  const { setToast } = useFeedbacks();

  const addAdenaNetwork = useCallback(
    async (adena: any, selectedNetworkInfo: GnoNetworkInfo) => {
      const res = await adena.AddNetwork({
        chainId: selectedNetworkInfo.chainId,
        rpcUrl: selectedNetworkInfo.endpoint,
        chainName: selectedNetworkInfo.displayName,
      });

      if (res.status === "failure") {
        throw Error(res.message);
      }
    },
    [],
  );

  const switchAdenaNetwork = useCallback(
    async (adena: any, selectedNetworkInfo: NetworkInfo | undefined) => {
      if (!adena) return;
      if (selectedNetworkInfo?.kind !== NetworkKind.Gno) return;

      try {
        const network = await adena.GetNetwork();

        if (network.status === "failure") {
          if (network.type === "NOT_CONNECTED") return;
          if (network.type === "WALLET_LOCKED") return;
          throw Error(network.message);
        }

        const adenaChainId = network.data.chainId;

        if (adenaChainId === selectedNetworkInfo?.chainId) {
          return;
        }

        const res = await adena.SwitchNetwork(selectedNetworkInfo?.chainId);

        if (res.status === "success") {
          setState({ chainId: res.data.chainId });
          return;
        }

        console.warn(res);

        if (res.type === "UNADDED_NETWORK") {
          await addAdenaNetwork(adena, selectedNetworkInfo);
          await switchAdenaNetwork(adena, selectedNetworkInfo);
          return;
        }

        if (res.type === "REDUNDANT_CHANGE_REQUEST") {
          return;
        }

        throw Error(res.message);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setToast({
            type: "error",
            message: err.message,
            mode: "normal",
            title: "Failed to connect to Adena (3)",
          });
        }
      }
    },
    [setToast, addAdenaNetwork, setState],
  );

  return { switchAdenaNetwork, addAdenaNetwork };
};
