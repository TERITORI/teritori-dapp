import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

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

export const useEscrowContract = (networkId: string, walletAddress: string) => {
  const { mustGetValue } = useUtils();
  const { setToastError, setToastSuccess } = useFeedbacks();

  const networkFeature = getNetworkFeature(
    networkId,
    NetworkFeature.GnoProjectManager,
  );

  const gnoNetwork = mustGetGnoNetwork(networkId);
  const escrowPkgPath = mustGetValue(
    networkFeature?.projectsManagerPkgPath,
    "escrow pkg path",
  );

  // This will call contract method and get the data
  const queryEscrow = async (methodName: string, args: any[]) => {
    const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
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
    gasWanted: number = 2_000_000,
  ) => {
    try {
      const caller = mustGetValue(walletAddress, "caller");

      await adenaVMCall(
        networkId,
        {
          caller,
          send: "",
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
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    }
  };

  return { execEscrowMethod, queryEscrow };
};
