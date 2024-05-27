import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { z } from "zod";

import {
  NetworkFeature,
  getGnoNetwork,
  getNetworkFeature,
  parseNetworkObjectId,
} from "../../../networks";
import { Project, zodProject } from "../types";

import { extractGnoJSONString } from "@/utils/gno";

export const useProject = (projectId: string | undefined) => {
  return useQuery(
    ["project", projectId],
    async () => {
      const [network, localIdentifierStr] = parseNetworkObjectId(projectId);
      if (!network || !localIdentifierStr) {
        return null;
      }

      const gnoNetwork = getGnoNetwork(network.id);
      if (!gnoNetwork) {
        return null;
      }

      const pmFeature = getNetworkFeature(
        network.id,
        NetworkFeature.GnoProjectManager,
      );

      if (!pmFeature) {
        return null;
      }

      const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);
      const query = `RenderContractJSON(${parseInt(localIdentifierStr, 10)})`;
      console.log("query", query);
      const contractData = await client.evaluateExpression(
        pmFeature.projectsManagerPkgPath,
        query,
      );
      console.log("ret", contractData);

      const j = extractGnoJSONString(contractData);

      console.log("parsed", j);

      return zodProject.parse(j);
    },
    { staleTime: Infinity },
  );
};

export type ProjectFilter =
  | { byCandidatesForFunder: { funder: string } }
  | { byFunder: { funder: string } }
  | { byContractor: { contractor: string } }
  | { byContractorAndFunder: { contractor: string; funder: string } }
  | null;

export const useProjects = (
  networkId: string,
  filter: ProjectFilter = null,
) => {
  const { data, ...other } = useInfiniteQuery<{
    projects: Project[];
    nextOffset: number;
  }>(
    ["projects", networkId, filter],
    async ({ pageParam = 0 }) => {
      const gnoNetwork = getGnoNetwork(networkId);
      if (!gnoNetwork) {
        return { projects: [], nextOffset: 0 };
      }

      const pmFeature = getNetworkFeature(
        networkId,
        NetworkFeature.GnoProjectManager,
      );
      if (!pmFeature) {
        return { projects: [], nextOffset: 0 };
      }

      const client = new GnoJSONRPCProvider(gnoNetwork.endpoint);

      const limit = 12;

      const pkgPath = pmFeature.projectsManagerPkgPath;
      const expr = `RenderContractsJSON(${pageParam},${limit},${JSON.stringify(JSON.stringify(filter))})`;

      console.log("projhook fetching", expr);

      const contractsData = await client.evaluateExpression(pkgPath, expr);

      console.log("projhook res", contractsData);

      const j = extractGnoJSONString(contractsData);

      const projects = z.array(zodProject).parse(j);

      return {
        projects,
        nextOffset: pageParam + projects.length,
      };
    },
    {
      staleTime: Infinity,
      getNextPageParam: ({ nextOffset }) => nextOffset,
    },
  );

  const projects = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.projects);
  }, [data]);

  return { projects, ...other };
};
