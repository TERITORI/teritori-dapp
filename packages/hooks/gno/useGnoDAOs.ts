import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { getGnoNetwork } from "../../networks";
import { extractGnoJSONString } from "../../utils/gno";

export type GnoDAORegistration = {
  pkgPath: string;
  addr: string;
  createdAt: number;
  name: string;
  description: string;
  imageURI: string;
};

export const useGnoDAOs = (networkId: string | undefined) => {
  const { data, ...other } = useQuery(["gno-daos", networkId], async () => {
    const network = getGnoNetwork(networkId);
    if (!network) return [];
    const client = new GnoJSONRPCProvider(network.endpoint);
    const res: GnoDAORegistration[] = extractGnoJSONString(
      await client.evaluateExpression(
        "gno.land/r/demo/dao_registry_v5",
        'ListJSON("", "", 0, false)'
      )
    );
    console.log("gnoDAOs", res);
    return res;
  });
  return { gnoDAOs: data, ...other };
};
