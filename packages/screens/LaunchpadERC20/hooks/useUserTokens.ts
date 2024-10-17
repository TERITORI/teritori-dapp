import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { getGnoNetwork, getNetworkFeature, NetworkFeature } from "@/networks";
import { extractGnoJSONString } from "@/utils/gno";
import { zodToken } from "@/utils/types/types";

export const useUserTokens = (networkId: string, addr: string) => {
  return useQuery(["userTokens", addr], async () => {
    const gnoNetwork = getGnoNetwork(networkId);
    if (!gnoNetwork) {
      return null;
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
    const query = `GetUserTokensJSON("${addr}")`;
    const contractData = await client.evaluateExpression(pkgPath, query);

    const res = extractGnoJSONString(contractData);
    const tokens = z.array(zodToken).parse(res);

    return tokens;
  });
};
