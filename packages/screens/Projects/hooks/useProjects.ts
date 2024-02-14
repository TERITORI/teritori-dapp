import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQuery } from "@tanstack/react-query";

import {
  NetworkFeature,
  getGnoNetwork,
  getNetworkFeature,
} from "../../../networks";
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

export const useProject = (
  networkId: string | undefined,
  projectId: string | undefined,
) => {
  return useQuery(
    ["useProject", networkId, projectId],
    async () => {
      if (!networkId || projectId === undefined) {
        return null;
      }

      const gnoNetwork = getGnoNetwork(networkId);
      if (!gnoNetwork) {
        return null;
      }

      const pmFeature = getNetworkFeature(
        networkId,
        NetworkFeature.GnoProjectManager,
      );

      if (!pmFeature) {
        return null;
      }

      const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
      const contractData = await client.evaluateExpression(
        pmFeature.projectsManagerPkgPath,
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
      const gnoNetwork = getGnoNetwork(networkId);
      if (!gnoNetwork) {
        return [];
      }

      const pmFeature = getNetworkFeature(
        networkId,
        NetworkFeature.GnoProjectManager,
      );
      if (!pmFeature) {
        return [];
      }

      const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);

      const pkgPath = pmFeature.projectsManagerPkgPath;
      const expr = `RenderContracts(${startAfter},${limit},"${filterByFunder}","${filterByContractor}")`;
      console.log("projects", pkgPath, expr);

      const contractsData = await client.evaluateExpression(pkgPath, expr);

      console.log("projects data", contractsData);

      const projects = toJSON(contractsData, true) as Project[];
      projects.sort((p1, p2) => p2.id - p1.id);

      console.log("projects", projects);

      return projects;
    },
    { initialData: [], refetchInterval: 10000 },
  );
};
