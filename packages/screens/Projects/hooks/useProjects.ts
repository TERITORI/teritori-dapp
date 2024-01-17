import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import { useUtils } from "./useUtils";
import { mustGetGnoNetwork } from "../../../networks";
import { extractGnoString } from "../../../utils/gno";
import { Project } from "../types";

const toJSON = (contractData: string, isArray: boolean) => {
  // const regex = isArray ? /("\[.*\]")/ : /("{.*}")/;
  //
  // // FIXME: Wait JK to fix this JSON =============================================
  // // NOTE: Don't know why extractGnoJSONString doesn't work here
  // let rawData = contractData.match(regex)?.[0] || "";

  let rawData = extractGnoString(contractData);

  // FIXME: dont support \n for now
  rawData = rawData.replace(/\n/g, " ");

  // FIXME: sanitize
  // eslint-disable-next-line no-restricted-syntax
  let contractJSON: any = JSON.parse(rawData);

  if (Array.isArray(contractJSON)) {
    contractJSON = contractJSON.map((data: any) => {
      // FIXME: sanitize
      // eslint-disable-next-line no-restricted-syntax
      data.metadata = JSON.parse(data.metadata.replace(/\n/g, " "));
      return data;
    });
  } else {
    // FIXME: sanitize
    // eslint-disable-next-line no-restricted-syntax
    contractJSON.metadata = JSON.parse(
      contractJSON.metadata.replace(/\n/g, " "),
    );
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
  filterByFunder: string = "", // By default, get only projects which have not funder
  filterByContractor: string = "", // By default, get only projects which have not contractor
) => {
  const { mustGetValue } = useUtils();

  return useQuery(
    [
      "useProjects",
      networkId,
      startAfter,
      limit,
      filterByFunder,
      filterByContractor,
    ],
    async () => {
      const gnoNetwork = mustGetGnoNetwork(networkId);
      const escrowPkgPath = mustGetValue(
        gnoNetwork.escrowPkgPath,
        "escrow pkg path",
      );
      const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
      const contractsData = await client.evaluateExpression(
        escrowPkgPath,
        `RenderContracts(${startAfter},${limit},"${filterByFunder}","${filterByContractor}")`,
      );

      const projects = toJSON(contractsData, true) as Project[];
      projects.sort((p1, p2) => p2.id - p1.id);
      return projects;
    },
    { initialData: [], refetchInterval: 5000 },
  );
};
