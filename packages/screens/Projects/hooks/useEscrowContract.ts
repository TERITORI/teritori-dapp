import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  getNetworkFeature,
  mustGetGnoNetwork,
  NetworkFeature,
} from "@/networks";
import { useUtils } from "@/screens/Projects/hooks/useUtils";
import { adenaVMCall, extractGnoString } from "@/utils/gno";

// This will call and get data from escrow contract
export const useQueryEscrow = (
  networkId: string,
  methodName: string,
  args: any[],
  enabled: boolean,
) => {
  const { mustGetValue } = useUtils();

  const gnoNetwork = mustGetGnoNetwork(networkId);

  const networkFeature = getNetworkFeature(
    networkId,
    NetworkFeature.GnoProjectManager,
  );

  const escrowPkgPath = mustGetValue(
    networkFeature?.projectsManagerPkgPath,
    "escrow pkg path",
  );

  return useQuery(
    ["queryEscrow", networkId, methodName, ...args],
    async () => {
      const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
      const argsStr = args
        .map((arg) => (typeof arg === "number" ? arg : `"${arg}"`))
        .join(",");

      return await client.evaluateExpression(
        escrowPkgPath,
        `${methodName}(${argsStr})`,
      );
    },
    { enabled },
  );
};

export const useEscrowContract = (
  networkId: string | undefined,
  walletAddress: string | undefined,
) => {
  const { mustGetValue } = useUtils();
  const { setToastError, setToastSuccess } = useFeedbacks();

  const _getEscrowInfo = (networkId: string) => {
    const pmFeature = getNetworkFeature(
      networkId,
      NetworkFeature.GnoProjectManager,
    );

    if (!pmFeature) {
      throw Error("Project Manager is not supported on this network");
    }

    const gnoNetwork = mustGetGnoNetwork(networkId);
    const escrowPkgPath = mustGetValue(
      pmFeature?.projectsManagerPkgPath,
      "escrow pkg path",
    );

    return { gnoNetworkEndpoint: gnoNetwork.endpoint, escrowPkgPath };
  };

  // This will call contract method and get the data
  const queryEscrow = async (methodName: string, args: any[]) => {
    if (!networkId) {
      setToastError({ title: "Error", message: "networkId not given" });
      return;
    }

    const { gnoNetworkEndpoint, escrowPkgPath } = _getEscrowInfo(networkId);

    const client = new GnoJSONRPCProvider(gnoNetworkEndpoint);
    const argsStr = args
      .map((arg) => (typeof arg === "number" ? arg : `"${arg}"`))
      .join(",");

    const res = await client.evaluateExpression(
      escrowPkgPath,
      `${methodName}(${argsStr})`,
    );

    return extractGnoString(res);
  };

  // This will execute the method and does not return result
  // only through error in case of problem
  const execEscrowMethod = async (
    func: string,
    args: any[],
    send: string = "",
    gasWanted: number = 2_000_000,
  ) => {
    try {
      if (!networkId) {
        setToastError({ title: "Error", message: "networkId not given" });
        return false;
      }

      const { escrowPkgPath } = _getEscrowInfo(networkId);

      const caller = mustGetValue(walletAddress, "caller");

      await adenaVMCall(
        networkId,
        {
          caller,
          send,
          pkg_path: escrowPkgPath,
          func,
          args,
        },
        { gasWanted },
      );

      setToastSuccess({
        title: "Success",
        message: "Action has been done successfully !",
      });

      return true;
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
      return false;
    }
  };

  return { execEscrowMethod, queryEscrow };
};
