import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { useUtils } from "./useUtils";
import { mustGetGnoNetwork } from "../../../networks";
import { Project } from "../types";

const toJSON = (contractData: string, isArray: boolean) => {
  const regex = isArray ? /("\[.*\]")/ : /("{.*}")/;

  // FIXME: Wait JK to fix this JSON =============================================
  // NOTE: Don't know why extractGnoJSONString doesn't work here
  const rawData = contractData.match(regex)?.[0] || "";

  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  let contractJSON = JSON.parse(JSON.parse(rawData));

  if (isArray) {
    contractJSON = contractJSON.map((data: any) => {
      // FIXME: sanitize
      // eslint-disable-next-line no-restricted-syntax
      data.metadata = JSON.parse(data.metadata);
      return data;
    });
  } else {
    // eslint-disable-next-line no-restricted-syntax
    contractJSON.metadata = JSON.parse(contractJSON.metadata);
  }

  return contractJSON;
};

export const useProject = (networkId: string, projectId: string) => {
  const { mustGetValue } = useUtils();

  return useQuery(
    ["useProject", networkId, projectId],
    async () => {
      const gnoNetwork = mustGetGnoNetwork(networkId);
      const escrowPkgPath = mustGetValue(
        gnoNetwork.escrowPkgPath,
        "escrow pkg path",
      );
      const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
      const contractData = await client.evaluateExpression(
        escrowPkgPath,
        `RenderContract(${projectId})`,
      );

      return toJSON(contractData, false) as Project;
    },
    { refetchInterval: 5000 },
  );
};

export const useProjects = (
  networkId: string,
  startAfter: number,
  limit: number,
) => {
  const { mustGetValue } = useUtils();

  return useQuery(
    ["useProjects", networkId, startAfter, limit],
    async () => {
      const gnoNetwork = mustGetGnoNetwork(networkId);
      const escrowPkgPath = mustGetValue(
        gnoNetwork.escrowPkgPath,
        "escrow pkg path",
      );
      const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
      const contractsData = await client.evaluateExpression(
        escrowPkgPath,
        `RenderContracts(${startAfter},${limit})`,
      );

      return toJSON(contractsData, true) as Project[];
    },
    { initialData: [], refetchInterval: 5000 },
  );
};
