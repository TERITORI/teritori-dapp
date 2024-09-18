import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import {
  NetworkFeature,
  getGnoNetwork,
  getNetworkFeature,
} from "../../../networks";
import { zodProject } from "../../../utils/projects/types";

import { extractGnoJSONString } from "@/utils/gno";

export const useLastTokens = (networkId: string) => {
  return useQuery(["lastTokens"], async () => {
    const gnoNetwork = getGnoNetwork(networkId);
    if (!gnoNetwork) {
      return { projects: [], nextOffset: 0 };
    }

    const pmFeature = getNetworkFeature(
      networkId,
      NetworkFeature.LaunchpadERC20,
    );

    if (!pmFeature) {
      return null;
    }

    const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
    const pkgPath = pmFeature.launchpadERC20PkgPath;
    const query = `GetLastTokensJSON()`;
    const contractData = await client.evaluateExpression(pkgPath, query);

    const res = extractGnoJSONString(contractData);

    return zodProject.parse(res);
  });
};
